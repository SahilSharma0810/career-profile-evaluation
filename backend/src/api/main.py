"""
FastAPI application for Free Profile Evaluation.
Handles HTTP endpoints for profile evaluation.
"""
import logging
import os
from typing import Dict, Optional, Any

from fastapi import FastAPI, HTTPException, APIRouter, Depends, Security
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel, ConfigDict

from src.models import FullProfileEvaluationResponse
from src.services.run_poc import run_poc
from src.config.logging_config import setup_logging, get_logger
from src.config.settings import get_settings

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


app = FastAPI(title="Full Profile Evaluation API")

# Create API router for all endpoints
api_router = APIRouter()

# Note: CORS middleware not needed because all requests come through proxy
# - Dev: React dev server proxies /api/* to localhost:8000
# - Prod: Nginx proxies /api/* to backend:8000
# Both configurations result in same-origin requests, eliminating CORS issues

# Basic Auth for admin endpoints
security = HTTPBasic()


def verify_admin_credentials(credentials: HTTPBasicCredentials = Security(security)) -> str:
    """
    Verify admin credentials for protected endpoints.
    
    Args:
        credentials: HTTP Basic Auth credentials
        
    Returns:
        Username if credentials are valid
        
    Raises:
        HTTPException: If credentials are invalid
    """
    settings = get_settings()
    correct_username = settings.admin_username
    correct_password = settings.admin_password
    
    if credentials.username != correct_username or credentials.password != correct_password:
        logger.warning(f"Failed admin authentication attempt for username: {credentials.username}")
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            # Removed WWW-Authenticate header to prevent browser's native popup
        )
    
    return credentials.username


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
        logger.exception("Evaluation failed due to configuration error")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - unexpected path
        logger.exception("Unexpected error while generating evaluation")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate evaluation. Check server logs for details.",
        ) from exc


@api_router.get("/health")
@api_router.head("/health")
async def healthcheck() -> Dict[str, str]:
    return {"status": "ok"}


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


app.include_router(api_router, prefix="/career-profile-tool/api")

def create_app() -> FastAPI:
    return app
