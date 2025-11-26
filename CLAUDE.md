# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Free Profile Evaluation is a full-stack application that provides AI-powered career profile evaluations for tech professionals in the Indian market. It uses ChatGPT (GPT-4) to generate personalized career assessments, recommendations, and roadmaps based on user input.

**Key Innovation**: PostgreSQL-based intelligent caching layer that uses SHA256 hash-based deduplication to reduce OpenAI API costs by 50-99%.

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

**Critical Design Principle**: Each layer has a single responsibility and communicates only with adjacent layers. Never bypass layers (e.g., API → Repository directly).

### Backend Structure (`backend/src/`)

- **`api/main.py`**: FastAPI application with API routes under `/career-profile-tool/api` prefix
- **`services/`**: Business logic - `run_poc.py` orchestrates pipeline, specialized logic modules
- **`repositories/`**: Data access - `cache_repository.py` for PostgreSQL cache operations
- **`models/`**: Pydantic schemas - `models.py` (validated), `models_raw.py` (raw OpenAI)
- **`config/`**: Configuration - `settings.py`, `exceptions.py`, `logging_config.py`
- **`utils/`**: Helpers - `label_mappings.py`, `validate_response.py`

### Hash-Based Caching System

1. User submits profile evaluation request
2. Backend generates SHA256 hash of normalized payload (`json.dumps(payload, sort_keys=True)`)
3. Check PostgreSQL cache using `cache_key` + `model` composite lookup
4. Cache HIT: Return stored response (instant, zero OpenAI cost)
5. Cache MISS: Call OpenAI API, store response with hash, return result

**Critical**: JSONB returns as dict from psycopg2, must convert to JSON string before validation.

### API Routing

**Base Path**: All routes under `/career-profile-tool`

- **Development**: Frontend at `localhost:3000/career-profile-tool/`, Backend at `localhost:8000/career-profile-tool/api/*`
- **Production**: CloudFront routes `scaler.com/career-profile-tool/*` to Elastic Beanstalk

No CORS needed (same-origin in both environments). Root (`/`) returns 404 by design.

## Development Commands

### Docker Development (Recommended)

```bash
# First time setup
docker compose up --build

# Daily development (uses cached builds)
docker compose up

# Live code reloading (best for active development)
docker compose watch

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Rebuild specific service
docker compose up --build backend

# Stop services
docker compose down
```

### Backend-Only Development (without Docker)

```bash
cd backend

# Install dependencies (uses uv package manager)
uv sync --all-extras

# Run server with auto-reload
uv run uvicorn backend.main:app --reload --port 8000

# Run tests
uv run pytest backend/tests --maxfail=1
uv run pytest --cov=src

# Linting and formatting
uv run black backend/src backend/tests
uv run ruff check backend
```

### Frontend-Only Development (without Docker)

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm start

# Run tests
npm test

# Linting
npm run lint
npm run lint:fix
```

### Health Check

```bash
curl http://localhost:8000/career-profile-tool/api/health
```

### Clear Cache (for testing)

```sql
DELETE FROM response_cache;
```

## Implementation Guidelines

### Import Paths

All imports use absolute `src.*` paths:
```python
from src.models import FullProfileEvaluationResponse
from src.services.run_poc import run_poc
from src.repositories.cache_repository import CacheRepository
```

Never use relative imports like `from models import ...` or `from ..services import ...`

### Configuration

Access all configuration via `src.config.settings`:
```python
from src.config.settings import settings
api_key = settings.openai_api_key
```

### OpenAI API Calls

**Only one place calls OpenAI**: `src/services/run_poc.py` in `call_openai_structured()`.

Always follow this pattern:
1. Generate cache key: `cache_repo.generate_cache_key(payload, model)`
2. Check cache: `cache_repo.get(cache_key, model)`
3. If cached, return immediately
4. If not cached, call OpenAI, then store result

### Error Handling

Use custom exceptions from `src.config.exceptions`:
- `DatabaseError`, `OpenAIError`, `CacheError`, `ValidationError`

### Logging

Use structured logging (never print statements):
```python
from src.config.logging_config import get_logger
logger = get_logger(__name__)
```

### Coding Style

- Python: 4-space indent, full type hints, `snake_case` files
- Format with Black, lint with Ruff
- Frontend: PascalCase component files, camelCase hooks/stores

## Common Issues

- **Import errors**: Ensure all use `src.*` absolute paths, rebuild containers
- **Cache not working**: Check database logs, look for "Cache HIT/MISS" in backend logs
- **JSONB validation errors**: PostgreSQL JSONB returns dict, convert to JSON string before validation
- **Backend won't start**: Check `OPENAI_API_KEY` and `DATABASE_URL` in `.env`

## Production

AWS Elastic Beanstalk + CloudFront. CloudFront routes `scaler.com/career-profile-tool/*` to EB.

Environment variables:
```
OPENAI_API_KEY=sk-proj-xxxxx
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/dbname
ENVIRONMENT=production
LOG_LEVEL=INFO
LOG_FORMAT=json
ADMIN_USERNAME=xxx
ADMIN_PASSWORD=xxx
```
