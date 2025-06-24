# FastAPI Backend

Backend API built with FastAPI, Prisma, and PostgreSQL.

## Development

### Prerequisites
- Python 3.12+
- Poetry
- PostgreSQL (or use Docker)

### Setup
1. Install dependencies: `poetry install`
2. Set up environment: `cp .env.example .env`
3. Generate Prisma client: `poetry run prisma generate`
4. Run migrations: `poetry run prisma migrate dev`
5. Start server: `poetry run uvicorn app.main:app --reload`

### API Endpoints
- `GET /health` - Health check
- `GET /` - Root endpoint

### Docker
The API runs in a Docker container in development mode with hot reloading enabled. 