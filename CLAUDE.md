# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack application providing AI-powered career profile evaluations for tech professionals in the Indian market. Uses GPT-4o to generate personalized career assessments, recommendations, and roadmaps.

**Key Innovation**: PostgreSQL-based intelligent caching layer using SHA256 hash-based deduplication to reduce OpenAI API costs by 50-99%.

## Architecture

### Three-Tier Clean Architecture

```
API Layer (src/api/)
    ↓
Service Layer (src/services/)
    ↓
Repository Layer (src/repositories/)
    ↓
Database (PostgreSQL)
```

Each layer communicates only with adjacent layers. Never bypass layers (e.g., API → Repository directly).

### Backend (`backend/src/`)

- **`api/main.py`**: FastAPI app with routes under `/career-profile-tool/api` prefix
- **`services/run_poc.py`**: Core orchestrator (~500 lines) — the only place that calls OpenAI, via `async call_openai_structured()` using `AsyncOpenAI` client
- **`services/`**: Specialized logic modules — `scoring_logic.py`, `mba_evaluator.py`, `interview_readiness_logic.py`, `quick_wins_logic.py`, `timeline_logic.py`, etc.
- **`repositories/cache_repository.py`**: PostgreSQL cache operations with shared singleton pattern
- **`models/`**: Pydantic schemas — `models.py` (validated), `models_raw.py` (raw OpenAI responses)
- **`config/settings.py`**: Pydantic V2 `BaseSettings` — all configuration centralized here
- **`config/telemetry.py`**: OpenTelemetry/SigNoz instrumentation (FastAPI, psycopg2, httpx auto-instrumentation)
- **`config/exceptions.py`**: Custom exceptions (`AppException`, `DatabaseError`, `OpenAIError`, `CacheError`, `ValidationError`, `RateLimitError`, `ConfigurationError`, `NotFoundError`)

### Frontend (`frontend/src/`)

- React app with nanostores for state management (not Redux)
- API client: `utils/api.js` → `apiRequest()` with custom `ApiError` class
- Auth: `api/authService.js` — signup/OTP verification flow
- Served via nginx in production (Node 18 build → nginx alpine)

### Hash-Based Caching System

1. User submits profile evaluation request
2. Backend generates SHA256 hash of normalized payload (`json.dumps(payload, sort_keys=True)`)
3. Check PostgreSQL cache using `cache_key` + `model` composite lookup
4. Cache HIT: Return stored response (instant, zero OpenAI cost)
5. Cache MISS: Call OpenAI API, store response with hash, return result

**Critical**: JSONB returns as dict from psycopg2 — must convert to JSON string before Pydantic validation.

### Database

- **Table**: `response_cache` with composite unique key `(cache_key, model)` and `user_input` JSONB column
- **Schema bootstrap**: `backend/init.sql` — update when schema changes
- **View**: `cache_statistics` for monitoring cache growth

### API Routing

**Base Path**: All routes under `/career-profile-tool`

- **Dev**: Frontend at `localhost:3000/career-profile-tool/`, Backend at `localhost:8000/career-profile-tool/api/*`
- **Prod**: CloudFront routes `scaler.com/career-profile-tool/*` to Elastic Beanstalk

No CORS needed in production (same-origin). Root (`/`) returns 404 by design.

### Observability

- **Logging**: Structured JSON logging via `get_logger(__name__)` from `src.config.logging_config` — never use print statements
- **Tracing**: OpenTelemetry spans exported to SigNoz OTEL collector (gRPC on port 4317, HTTP on 4318)
- **Error tracking**: Sentry integration (production only, DSN-based)
- **Request correlation**: `request_id_var` context variable across logs and Sentry

## Development Commands

### Docker (Recommended)

```bash
docker compose up --build    # First time setup
docker compose up            # Daily development
docker compose watch         # Live code reloading
docker compose logs -f backend
docker compose up --build backend  # Rebuild specific service
docker compose down
```

### Backend-Only (without Docker)

```bash
cd backend
uv sync --all-extras                              # Install deps (uv package manager)
uv run uvicorn backend.main:app --reload --port 8000  # Dev server
uv run pytest backend/tests --maxfail=1           # Run tests
uv run pytest --cov=src                           # Coverage
uv run black backend/src backend/tests            # Format
uv run ruff check backend                         # Lint
```

### Frontend-Only (without Docker)

```bash
cd frontend
npm install && npm start     # Dev server
npm test                     # Tests
npm run lint:fix             # Lint + fix
```

### Health Check

```bash
curl http://localhost:8000/career-profile-tool/api/health
```

## Implementation Guidelines

### Import Paths

All imports use absolute `src.*` paths. Never use relative imports.
```python
from src.models import FullProfileEvaluationResponse
from src.services.run_poc import run_poc
from src.repositories.cache_repository import CacheRepository
```

### Database Connection

Always obtain `CacheRepository` via the shared singleton — never instantiate directly:
```python
from src.repositories.cache_repository import get_cache_repository
cache_repo = get_cache_repository()
```

### Configuration

Access all config via the singleton:
```python
from src.config.settings import settings
```

### OpenAI Calls

**Only `src/services/run_poc.py` calls OpenAI** via `call_openai_structured()`. Uses `AsyncOpenAI` with exponential backoff retry (controlled by `openai_max_retries` and `openai_retry_delay` settings).

Cache-first pattern:
1. `cache_repo.generate_cache_key(payload, model)`
2. `cache_repo.get(cache_key, model)` — return immediately if cached
3. Call OpenAI, store result, return

### Testing

- Unit tests: `backend/tests/unit/<feature>/test_<subject>.py`
- Integration tests: `backend/tests/integration/`
- Use `pytest.mark.asyncio` for async services
- Frontend: React Testing Library specs in `frontend/src/__tests__/`

### Coding Style

- Python: 4-space indent, full type hints, `snake_case` files. Format with Black, lint with Ruff.
- Frontend: PascalCase component files, camelCase hooks/stores, styled-components co-located with components.

### Commits

Imperative form, optionally scoped: `feat(cache): add hashed response key`

## Common Issues

- **Import errors**: Ensure all use `src.*` absolute paths, rebuild containers
- **Cache not working**: Check database logs, look for "Cache HIT/MISS" in backend logs
- **JSONB validation errors**: PostgreSQL JSONB returns dict — convert to JSON string before validation
- **Backend won't start**: Check `OPENAI_API_KEY` and `DATABASE_URL` in `.env`

## Production

AWS Elastic Beanstalk + CloudFront. Environment variables:
```
OPENAI_API_KEY, DATABASE_URL, ENVIRONMENT=production,
LOG_LEVEL=INFO, LOG_FORMAT=json, ADMIN_USERNAME, ADMIN_PASSWORD
```
