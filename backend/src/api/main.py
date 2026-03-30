"""
FastAPI application for Free Profile Evaluation.
Handles HTTP endpoints for profile evaluation.
"""
import hashlib
import json
import logging
import os
from uuid import uuid4
from typing import Dict, Optional, Any

from fastapi import FastAPI, HTTPException, APIRouter, Depends, Security, Header, Query, Request
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel, ConfigDict
from typing import Optional

from src.models import FullProfileEvaluationResponse
from src.services.run_poc import run_poc
from src.config.logging_config import setup_logging, get_logger
from src.config.settings import get_settings
from src.config.sentry_config import init_sentry, capture_exception
from src.config.otel_config import init_otel
from src.config.request_context import request_id_var

# Setup logging
setup_logging()
logger = get_logger(__name__)


class QuizResponses(BaseModel):
    currentRole: str
    experience: str
    targetRole: str
    problemSolving: str
    systemDesign: str
    portfolio: str
    mockInterviews: str
    currentCompany: str
    currentSkill: str
    requirementType: str
    targetCompany: str
    # Optional label fields for display (sent from frontend)
    currentRoleLabel: Optional[str] = None
    targetRoleLabel: Optional[str] = None
    targetCompanyLabel: Optional[str] = None
    primaryGoal: Optional[str] = None  # Add primaryGoal field

    model_config = ConfigDict(extra="forbid")


class Goals(BaseModel):
    requirementType: list[str]
    targetCompany: str
    topicOfInterest: list[str]

    model_config = ConfigDict(extra="forbid")


class EvaluationRequest(BaseModel):
    background: str
    quizResponses: QuizResponses
    goals: Goals
    questionsAndAnswers: Optional[list[Dict[str, Any]]] = None

    model_config = ConfigDict(extra="forbid")


# =====================================================
# Career Roadmap Tool (CRT) Models
# =====================================================
class CRTQuizResponses(BaseModel):
    """
    CRT Quiz responses - flexible schema to accept any quiz fields.
    Fields based on career-roadmap-tool UnifiedContext.
    """
    background: Optional[str] = None
    currentBackground: Optional[str] = None
    stepsTaken: Optional[str] = None
    targetRole: Optional[str] = None
    targetRoleLabel: Optional[str] = None
    yearsOfExperience: Optional[str] = None
    codeComfort: Optional[str] = None
    currentSkills: Optional[list[str]] = None
    timeline: Optional[str] = None
    currentRole: Optional[str] = None
    currentRoleLabel: Optional[str] = None
    targetCompany: Optional[str] = None
    targetCompanyLabel: Optional[str] = None

    model_config = ConfigDict(extra="allow")  # Allow additional fields


class CRTStoreRequest(BaseModel):
    """Request body for storing CRT quiz responses."""
    quizResponses: Dict[str, Any]

    model_config = ConfigDict(extra="forbid")


class CRTStoreResponse(BaseModel):
    """Response containing the MD5 hash key."""
    hash_key: str


app = FastAPI(title="Full Profile Evaluation API")


@app.middleware("http")
async def add_request_context(request: Request, call_next):
    token = request_id_var.set(str(uuid4()))
    try:
        return await call_next(request)
    finally:
        request_id_var.reset(token)


# Initialize integrations (no-ops if DSN / OTEL endpoint not configured).
init_sentry()
init_otel(app)

# Create API router for all endpoints
api_router = APIRouter()

# Note: CORS middleware not needed because all requests come through proxy
# - Dev: React dev server proxies /api/* to localhost:8000
# - Prod: Nginx proxies /api/* to backend:8000
# Both configurations result in same-origin requests, eliminating CORS issues

# Basic Auth for admin endpoints (primary method)
security = HTTPBasic()


def verify_admin_credentials(
    request: Request,
    admin_token: Optional[str] = Query(None, alias="admin_token"),
    x_admin_token: Optional[str] = Header(None, alias="X-Admin-Token")
) -> str:
    """
    Verify admin credentials using multiple methods (for CloudFront compatibility):
    1. Basic Auth (if available)
    2. Token in query parameter (works with CloudFront)
    3. Token in X-Admin-Token header

    Args:
        credentials: HTTP Basic Auth credentials (optional)
        admin_token: Token from query parameter
        x_admin_token: Token from X-Admin-Token header

    Returns:
        Username if credentials are valid

    Raises:
        HTTPException: If credentials are invalid
    """
    settings = get_settings()
    correct_username = settings.admin_username
    correct_password = settings.admin_password

    # === DETAILED DEBUG LOGGING ===
    logger.info(f"[AUTH DEBUG] === New Auth Request ===")
    logger.info(f"[AUTH DEBUG] Request URL: {request.url}")
    logger.info(f"[AUTH DEBUG] Request path: {request.url.path}")
    logger.info(f"[AUTH DEBUG] Query string: {request.url.query}")
    logger.info(f"[AUTH DEBUG] Query params dict: {dict(request.query_params)}")
    logger.info(f"[AUTH DEBUG] admin_token (FastAPI parsed): {admin_token[:20] if admin_token else None}...")
    logger.info(f"[AUTH DEBUG] x_admin_token (header): {x_admin_token[:20] if x_admin_token else None}...")
    logger.info(f"[AUTH DEBUG] All headers: {dict(request.headers)}")
    logger.info(f"[AUTH DEBUG] Expected username: '{correct_username}'")
    logger.info(f"[AUTH DEBUG] Expected password length: {len(correct_password) if correct_password else 0}")

    # Method 1: Try token-based auth (works better with CloudFront)
    if admin_token or x_admin_token:
        import hashlib
        expected_token = hashlib.sha256(
            f"{correct_username}:{correct_password}".encode()
        ).hexdigest()
        
        provided_token = admin_token or x_admin_token
        if provided_token == expected_token:
            logger.info("Successful admin token authentication")
            return correct_username
        else:
            logger.warning("Failed admin token authentication attempt")
            raise HTTPException(
                status_code=401,
                detail="Authentication failed"
            )
    
    # Method 2: Try Basic Auth (fallback)
    # Manually extract Basic Auth credentials from header
    authorization = request.headers.get("Authorization", "")
    if authorization.startswith("Basic "):
        try:
            import base64
            encoded = authorization.split(" ")[1]
            decoded = base64.b64decode(encoded).decode("utf-8")
            username, password = decoded.split(":", 1)
            credentials = HTTPBasicCredentials(username=username, password=password)
        except Exception:
            credentials = None
    else:
        credentials = None
    
    if credentials:
        logger.info(
            f"Auth check: provided_username='{credentials.username}', "
            f"expected_username='{correct_username}', "
            f"username_match={credentials.username == correct_username}, "
            f"password_length_provided={len(credentials.password)}, "
            f"password_length_expected={len(correct_password)}, "
            f"password_match={credentials.password == correct_password}"
        )
        
        if credentials.username == correct_username and credentials.password == correct_password:
            logger.info(f"Successful admin authentication for username: {credentials.username}")
            return credentials.username
        else:
            logger.warning(
                f"Failed admin authentication attempt: "
                f"username='{credentials.username}' (expected '{correct_username}')"
            )
            raise HTTPException(
                status_code=401,
                detail="Authentication failed"
            )
    
    # No valid authentication method provided
    raise HTTPException(
        status_code=401,
        detail="Authentication failed"
    )


@api_router.post("/evaluate", response_model=FullProfileEvaluationResponse)
async def evaluate_profile(request: EvaluationRequest) -> FullProfileEvaluationResponse:
    logger.info("Received profile evaluation request")

    try:
        result = run_poc(
            input_payload=request.model_dump(),
        )
        logger.info("Profile evaluation completed successfully")
        return result
    except RuntimeError as exc:
        capture_exception(exc)
        logger.exception("Evaluation failed due to configuration error")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - unexpected path
        capture_exception(exc)
        logger.exception("Unexpected error while generating evaluation")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate evaluation. Check server logs for details.",
        ) from exc


@api_router.get("/health")
@api_router.head("/health")
async def healthcheck() -> Dict[str, str]:
    return {"status": "ok"}


@api_router.post("/admin/test/sentry-otel")
async def test_sentry_and_otel(
    username: str = Depends(verify_admin_credentials),
) -> Dict[str, Any]:
    """
    Staging-only diagnostic endpoint to verify:
    - Sentry receives the exception (via `capture_exception`)
    - SigNoz receives the request trace/span (via OpenTelemetry instrumentation)
    - JSON logs contain the same `trace_id` for correlation
    """
    settings = get_settings()
    if settings.environment.lower() == "production":
        raise HTTPException(status_code=404, detail="Not found")

    from opentelemetry import trace
    from src.config.request_context import get_request_id

    span_context = trace.get_current_span().get_span_context()
    trace_id = f"{span_context.trace_id:032x}" if span_context and getattr(span_context, "is_valid", False) else None
    request_id = get_request_id()

    try:
        raise RuntimeError("Sentry/OTel test error (triggered by admin diagnostic route)")
    except Exception as exc:
        capture_exception(exc)
        logger.exception("Sentry/OTel diagnostic route triggered an error")
        raise HTTPException(
            status_code=500,
            detail={
                "test": "sentry_otel",
                "trace_id": trace_id,
                "request_id": request_id,
            },
        ) from exc


@api_router.get("/admin/view/response/{cache_key}")
async def get_response_by_cache_key(
    cache_key: str,
    username: str = Depends(verify_admin_credentials)
) -> Dict[str, Any]:
    """
    Admin endpoint to view a cached response by its cache key.
    
    Args:
        cache_key: The SHA256 hash key (response_id) from response_cache table
        
    Returns:
        Dictionary containing the cached response and input payload
    """
    from src.repositories.cache_repository import CacheRepository
    
    logger.info(f"Admin view request for cache_key: {cache_key[:16]}...")
    
    cache_repo = CacheRepository()
    model_name = "gpt-4o"  # Default model
    
    cache_entry = cache_repo.get_by_key(cache_key, model_name)
    
    if not cache_entry:
        raise HTTPException(
            status_code=404,
            detail=f"Response not found for cache_key: {cache_key}"
        )
    
    return {
        "user_input": cache_entry["user_input"],
        "response": cache_entry["response_json"],
    }


crt_router = APIRouter(prefix="/crt", tags=["Career Roadmap Tool"])


def _make_crt_hash(quiz_responses: Dict[str, Any]) -> str:
    """Generate MD5 hash from quiz responses (deterministic)."""
    serialized = json.dumps(quiz_responses, sort_keys=True, separators=(",", ":"))
    return hashlib.md5(serialized.encode("utf-8")).hexdigest()


@crt_router.post("/store", response_model=CRTStoreResponse)
async def store_crt_quiz_responses(request: CRTStoreRequest) -> CRTStoreResponse:
    from database import get_db_connection
    
    quiz_responses = request.quizResponses
    hash_key = _make_crt_hash(quiz_responses)
    
    logger.info(f"Storing CRT quiz responses with hash: {hash_key}")
    
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO crt_quiz_responses (hash_key, quiz_responses)
                    VALUES (%s, %s)
                    ON CONFLICT (hash_key) DO UPDATE SET
                        quiz_responses = EXCLUDED.quiz_responses
                    """,
                    (hash_key, json.dumps(quiz_responses))
                )
        
        logger.info(f"Successfully stored CRT quiz responses: {hash_key}")
        return CRTStoreResponse(hash_key=hash_key)
        
    except Exception as exc:
        capture_exception(exc)
        logger.exception(f"Failed to store CRT quiz responses: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Failed to store quiz responses"
        ) from exc


@crt_router.get("/admin/view/{hash_key}")
async def get_crt_quiz_responses(
    hash_key: str,
    username: str = Depends(verify_admin_credentials)
) -> Dict[str, Any]:
    from database import get_db_connection
    from psycopg2.extras import RealDictCursor
    
    logger.info(f"Admin view request for CRT hash: {hash_key}")
    
    try:
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """
                    SELECT quiz_responses, created_at
                    FROM crt_quiz_responses
                    WHERE hash_key = %s
                    """,
                    (hash_key,)
                )
                result = cur.fetchone()
        
        if not result:
            raise HTTPException(
                status_code=404,
                detail=f"Quiz responses not found for hash: {hash_key}"
            )
        
        return {
            "hash_key": hash_key,
            "quiz_responses": result["quiz_responses"],
            "created_at": result["created_at"].isoformat() if result["created_at"] else None
        }
        
    except HTTPException:
        raise
    except Exception as exc:
        capture_exception(exc)
        logger.exception(f"Failed to retrieve CRT quiz responses: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve quiz responses"
        ) from exc


# Include CRT router under the main API router
api_router.include_router(crt_router)

# =====================================================
# MBA Readiness Evaluation (No OpenAI - Mapping Based)
# =====================================================
mba_router = APIRouter(prefix="/mba", tags=["MBA Readiness"])


def _generate_mba_cache_key(payload: Dict[str, Any]) -> str:
    """Generate a cache key for MBA evaluation responses."""
    # Include only deterministic fields for cache key
    cache_payload = {
        'role': payload.get('role'),
        'experience': payload.get('experience'),
        'career_goal': payload.get('career_goal'),
        'currentRole': payload.get('currentRole'),
    }
    # Add all quiz response keys (excluding timestamps or random fields)
    for key, value in payload.items():
        if key not in cache_payload and not key.startswith('_'):
            # Normalize arrays by sorting for consistent hashing
            if isinstance(value, list):
                cache_payload[key] = sorted(value)
            else:
                cache_payload[key] = value
    
    # Normalize primaryGoal array if present
    if 'primaryGoal' in cache_payload and isinstance(cache_payload['primaryGoal'], list):
        cache_payload['primaryGoal'] = sorted(cache_payload['primaryGoal'])
    
    serialized = json.dumps(cache_payload, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


@mba_router.post("/evaluate")
async def evaluate_mba_readiness(request: Dict[str, Any]):
    """
    Evaluate MBA readiness based on quiz responses.
    Pure mapping-based evaluation - no OpenAI API calls.

    Request body should contain:
    - role: str (product-manager, finance, sales, marketing, operations, founder)
    - experience: str (0-2, 2-5, 5-8, 8-12, 12+)
    - career_goal: str
    - Role-specific question responses

    Returns:
        Complete evaluation with scores, skills, quick wins, AI tools, etc.
    """
    from src.services.mba_evaluator import evaluate_mba_readiness
    from src.repositories.cache_repository import CacheRepository

    logger.info(f"Received MBA evaluation request for role: {request.get('role')}")

    try:
        # Pass request as-is to preserve dash-case quiz question keys
        # (skill scoring maps expect keys like 'pm-retention-problem', not 'pm_retention_problem')
        result = evaluate_mba_readiness(request)

        # Generate cache key and store response for admin view
        cache_key = _generate_mba_cache_key(request)
        model_name = "mba-evaluation"  # Use distinct model name for MBA
        
        # Store in cache with user_input for admin view
        cache_repo = CacheRepository()
        user_input = {
            "evaluation_type": "mba",  # Mark as MBA evaluation
            "quizResponses": request,
        }
        cache_repo.set(
            cache_key,
            model_name,
            json.dumps(result),
            user_input=user_input
        )
        
        # Add response_id to result
        result["response_id"] = cache_key
        
        logger.info(f"MBA evaluation completed successfully, response_id: {cache_key[:16]}...")
        return result

    except Exception as exc:
        capture_exception(exc)
        logger.exception(f"Failed to evaluate MBA readiness: {exc}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate MBA evaluation: {str(exc)}"
        ) from exc


@mba_router.get("/admin/view/{cache_key}")
async def get_mba_response_by_cache_key(
    cache_key: str,
    username: str = Depends(verify_admin_credentials)
) -> Dict[str, Any]:
    """
    Admin endpoint to view an MBA evaluation response by its cache key.
    
    Args:
        cache_key: The SHA256 hash key (response_id) from response_cache table
        
    Returns:
        Dictionary containing the cached MBA response and input payload
    """
    from src.repositories.cache_repository import CacheRepository
    
    logger.info(f"Admin view request for MBA cache_key: {cache_key[:16]}...")
    
    cache_repo = CacheRepository()
    model_name = "mba-evaluation"
    
    cache_entry = cache_repo.get_by_key(cache_key, model_name)
    
    if not cache_entry:
        raise HTTPException(
            status_code=404,
            detail=f"MBA response not found for cache_key: {cache_key}"
        )
    
    return {
        "evaluation_type": "mba",
        "user_input": cache_entry["user_input"],
        "response": cache_entry["response_json"],
    }


# Include MBA router under the main API router
api_router.include_router(mba_router)

app.include_router(api_router, prefix="/career-profile-tool/api")

def create_app() -> FastAPI:
    return app
