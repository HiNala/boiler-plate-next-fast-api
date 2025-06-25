# 🐍 FastAPI Backend

Modern Python API built with FastAPI, Prisma ORM, and PostgreSQL.

## 🚀 Quick Start

**⚡ Recommended: Run from repository root**
```bash
# From repository root
docker compose up --build
# API available at http://localhost:8000
```

## ✨ Features

- 🚀 **FastAPI** with automatic OpenAPI documentation
- 🔒 **Security Middleware** (CORS, TrustedHost)
- 📊 **Health Check Endpoints** with system monitoring
- 🔐 **Bearer Token Authentication** ready
- 📝 **Comprehensive Logging** and error handling
- 🏷️ **Type Hints** throughout the codebase
- 🗄️ **Prisma ORM** for type-safe database queries

## 🏗️ Project Structure

```
apps/api/
├─ app/
│   └─ main.py              ⟵ FastAPI application
├─ pyproject.toml           ⟵ Python dependencies
├─ poetry.lock              ⟵ Dependency lock file
└─ README.md                ⟵ This file
```

## 🔧 Development

### Container Development (Recommended)
The API runs automatically when you start the full stack:
```bash
# From repository root
docker compose up --build
```

### Local Development (Optional)
For API-only development:
```bash
# Install Python dependencies
poetry install

# Generate Prisma client
poetry run prisma generate

# Start development server
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🔌 API Endpoints

### Health & Monitoring
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health with system metrics
- `GET /api/status` - API status and configuration

### Documentation
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)
- `GET /openapi.json` - OpenAPI JSON schema

### Meta Information
- `GET /` - API information and available endpoints

### Protected Routes (Example)
- `GET /api/protected` - Example of authenticated endpoint

## 🔐 Security Features

- 🛡️ **CORS Middleware** - Configured for frontend origin
- 🔒 **Trusted Host Middleware** - Prevents host header attacks
- 🔐 **Bearer Token Authentication** - Ready for JWT implementation
- 📝 **Global Exception Handler** - Structured error responses
- 🚫 **Input Validation** - Pydantic models for request validation

## 🌐 Environment Configuration

```bash
# Database
DATABASE_URL=postgres://app:app@db:5432/app

# API Configuration
FRONTEND_ORIGIN=http://localhost:3000
ALLOWED_HOSTS=localhost,127.0.0.1,api
ENVIRONMENT=development
```

## 🗄️ Database Integration

### Prisma ORM
The API uses Prisma for type-safe database operations:

```bash
# Generate Prisma client
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

### Database Schema
Located in `prisma/schema.prisma` (repository root):
- User model with basic fields
- Proper indexing and relationships
- PostgreSQL-specific features

## 🧪 Testing

```bash
# Run API tests from repository root
python -m pytest tests/api/ -v

# Run with coverage
poetry run pytest --coverage

# Run specific test file
poetry run pytest tests/api/test_main.py -v
```

## 📊 Monitoring & Logging

- **Health Checks**: Built-in endpoints for service monitoring
- **System Metrics**: CPU, memory, and disk usage via `/health/detailed`
- **Structured Logging**: Comprehensive logging throughout the application
- **Error Handling**: Global exception handler with detailed error responses

## 🚀 Deployment

### Production Configuration
```bash
# Update environment variables
ENVIRONMENT=production
DATABASE_URL=your_production_database_url
FRONTEND_ORIGIN=https://your-frontend-domain.com
ALLOWED_HOSTS=your-api-domain.com,localhost
```

### Platform Deployment
- **Railway**: Deploy from `apps/api` directory
- **Render**: Use `poetry run uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Docker**: Runs in containerized environment
- **Heroku**: Compatible with Procfile deployment

## 🔗 Dependencies

### Core Dependencies
- **FastAPI**: Modern web framework for Python
- **Uvicorn**: ASGI server for FastAPI
- **Prisma**: Type-safe database client
- **Python-dotenv**: Environment variable management
- **Psutil**: System monitoring utilities

### Development Dependencies
- **Poetry**: Dependency management
- **Pytest**: Testing framework
- **Ruff**: Fast Python linter

## 📚 Learn More

**FastAPI Resources:**
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - Official documentation
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/) - Step-by-step guide
- [OpenAPI Specification](https://swagger.io/specification/) - API documentation standard

**Python Resources:**
- [Python Type Hints](https://docs.python.org/3/library/typing.html)
- [Prisma Python Docs](https://prisma-client-py.readthedocs.io/)
- [Poetry Documentation](https://python-poetry.org/docs/)

---

**Part of the Full-Stack Boilerplate** - See main [README.md](../../README.md) for complete setup instructions. 