# 🐍 FastAPI Backend

Modern Python API built with FastAPI 0.115.13, Python 3.13, and PostgreSQL 17.5.

## 🚀 Quick Start

**⚡ Recommended: Run from repository root**
```bash
# From repository root
docker compose up --build
# API available at http://localhost:8000
```

## ✨ Features

- 🚀 **FastAPI 0.115.13** with automatic OpenAPI documentation and Python 3.13 support
- 🔒 **Security Middleware** (CORS, TrustedHost)
- 📊 **Health Check Endpoints** with system monitoring
- 🔐 **Bearer Token Authentication** ready
- 📝 **Comprehensive Logging** and error handling
- 🏷️ **Type Hints** with Pydantic v2 integration throughout the codebase
- 🗄️ **Prisma ORM** for type-safe database queries
- ⚡ **ASGI 3-spec** compliance with Uvicorn 0.30+

## 🏗️ Project Structure

```
apps/api/
├─ app/
│   └─ main.py              ⟵ FastAPI application
├─ pyproject.toml           ⟵ Python dependencies (Python 3.13)
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
For API-only development with Python 3.13:
```bash
# Install Python dependencies (requires Python 3.13)
poetry install

# Generate Prisma client
poetry run prisma generate

# Start development server
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🔌 API Endpoints

### Health & Monitoring
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health with system monitoring
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
- 🚫 **Input Validation** - Pydantic v2 models for request validation
- 🔧 **Starlette 0.39** compatibility for enhanced security features

## 🌐 Environment Configuration

```bash
# Database (PostgreSQL 17.5)
DATABASE_URL=postgres://app:app@db:5432/app

# API Configuration
FRONTEND_ORIGIN=http://localhost:3000
ALLOWED_HOSTS=localhost,127.0.0.1,api
ENVIRONMENT=development
```

## 🗄️ Database Integration

### Prisma ORM
The API uses Prisma for type-safe database operations with PostgreSQL 17.5:

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
- PostgreSQL 17.5-specific features and optimizations

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
- **Performance**: Enhanced with Python 3.13 performance improvements

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
- **Docker**: Runs in containerized environment with Python 3.13-slim
- **Heroku**: Compatible with Procfile deployment

## 🔗 Dependencies

### Core Dependencies (Production-Ready Versions)
- **FastAPI 0.115.13**: Latest stable with Python 3.13 support and Pydantic v2
- **Uvicorn 0.30+**: ASGI server with standard extras for ASGI 3-spec compliance
- **Prisma 0.15.0**: Latest Python client for PostgreSQL 17.5 compatibility
- **Python-dotenv 1.0.0**: Environment variable management
- **Psutil 5.9.0**: System monitoring utilities
- **Watchfiles 0.21.0**: Fast file watching for development

### Development Dependencies
- **Poetry 1.8.2**: Dependency management
- **Pytest 7.4.0**: Testing framework
- **Ruff 0.1.6**: Fast Python linter
- **Python 3.13**: Base runtime environment with latest performance improvements

### Runtime Environment
- **Python 3.13**: Current stable CPython with performance enhancements
- **Docker**: Python 3.13-slim with build tools for compilation dependencies
- **PostgreSQL**: 17.5-alpine for optimal database performance

## 📚 Learn More

**FastAPI Resources:**
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - Official documentation
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/) - Step-by-step guide
- [OpenAPI Specification](https://swagger.io/specification/) - API documentation standard
- [FastAPI 0.115 Release Notes](https://github.com/tiangolo/fastapi/releases/tag/0.115.13) - Latest features

**Python Resources:**
- [Python 3.13 Release Notes](https://docs.python.org/3.13/whatsnew/3.13.html) - New features and improvements
- [Python Type Hints](https://docs.python.org/3/library/typing.html)
- [Prisma Python Docs](https://prisma-client-py.readthedocs.io/)
- [Poetry Documentation](https://python-poetry.org/docs/)

---

**Part of the Full-Stack Boilerplate** - See main [README.md](../../README.md) for complete setup instructions and [Version Matrix](../../docs/Version_Matrix.md) for compatibility details. 