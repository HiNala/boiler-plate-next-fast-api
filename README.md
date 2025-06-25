# 🚀 Full-Stack Boilerplate: Next.js 15 + FastAPI + PostgreSQL

A production-ready, containerized full-stack application boilerplate with modern development tools and best practices.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)

## 📋 Current Package Versions

| Component | Technology | Version | Why This Version |
|-----------|------------|---------|------------------|
| **Frontend** | Next.js | 15.3.4 | Current "latest" tag - fully stable 15-series |
| | React | 19.1.0 | Bundled automatically by Next.js latest |
| | TypeScript | 5.8.3 | Official compiler used by Next.js 15 starter |
| | Tailwind CSS | 4.0.0 | Major v4 rewrite with faster build engine |
| **Backend** | Python | 3.13 | Current stable CPython; FastAPI tested against it |
| | FastAPI | 0.115.13 | Latest stable; supports Python 3.13 & Pydantic v2 |
| | Uvicorn | 0.30+ | ASGI 3-spec compliance with FastAPI latest |
| | Prisma (Python) | 0.15.0 | Latest Python client for database operations |
| **Database** | PostgreSQL | 17.5-alpine | Most recent minor; fully supported by Prisma |
| **Infrastructure** | Docker Engine | 27.5.1+ | Latest with BuildKit v0.18 and containerd 1.7.25 |
| | Node.js | 22 LTS | Active-LTS line; fulfills ≥18 requirement |
| | Poetry | 1.8.2 | Python dependency management |

> **🔧 Version Compatibility**: All versions are tested together and form a stable, production-ready stack. See [Version Matrix](docs/Version_Matrix.md) for detailed compatibility information.

## ✨ Features

### 🎯 **Frontend (Next.js 15)**
- ⚛️ **React 19** with Next.js App Router and Server Components
- 🎨 **Tailwind CSS 4.0** with faster build engine (~3-4x faster)
- 📱 **Responsive Design** with mobile-first approach
- 🔥 **Turbopack** for faster development builds (now stable)
- 🌙 **Dark Mode** support built-in
- 📖 **TypeScript 5.8** for enhanced type safety and satisfies operators

### 🐍 **Backend (FastAPI 0.115)**
- 🚀 **FastAPI** with automatic API documentation and Python 3.13 support
- 🔒 **Security Middleware** (CORS, TrustedHost)
- 📊 **Health Check Endpoints** with system monitoring
- 🔐 **Bearer Token Authentication** ready
- 📝 **Comprehensive Logging** and error handling
- 🏷️ **Type Hints** with Pydantic v2 integration

### 🐘 **Database (PostgreSQL 17.5)**
- ��️ **PostgreSQL 17.5** for reliable data storage with latest performance improvements
- 🔄 **Prisma ORM** for type-safe database queries
- 📦 **Docker Volumes** for data persistence
- 🔧 **Migration System** for schema management

### 🐳 **DevOps & Infrastructure**
- 🔧 **Docker Compose** with latest Engine 27.5+ features
- 🔄 **Hot Reload** enabled for all services
- 🌐 **CORS** properly configured
- 📊 **Health Monitoring** across all services
- 🛡️ **Security Headers** and middleware
- 📋 **Environment Configuration** management

## 🚀 Quick Start

**⚡ TL;DR - Get Started in 30 seconds:**
```bash
git clone https://github.com/HiNala/boiler-plate-next-fast-api.git
cd boiler-plate-next-fast-api
docker compose up --build
# Visit http://localhost:3000 🎉
```

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Engine 27.5.1+ recommended)
- [Git](https://git-scm.com/)
- [Node.js 22 LTS](https://nodejs.org/) (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HiNala/boiler-plate-next-fast-api.git
   cd boiler-plate-next-fast-api
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Start the development environment**
   ```bash
   docker compose up --build
   ```

4. **Access the applications**
   - 🌐 **Frontend**: http://localhost:3000
   - 🔗 **Backend API**: http://localhost:8000
   - 📖 **API Documentation**: http://localhost:8000/docs
   - 🏥 **Health Check**: http://localhost:3000/health

## 📁 Project Structure

```
boiler-plate-next-fast-api/
│
├─ 📁 apps/
│   ├─ 📁 web/                 ⟵ Next.js 15 Frontend
│   │   ├─ 📁 src/app/         ⟵ App Router pages
│   │   ├─ 📁 lib/             ⟵ Utility functions
│   │   ├─ 📄 package.json     ⟵ Frontend dependencies
│   │   └─ 📄 tailwind.config.ts
│   │
│   └─ 📁 api/                 ⟵ FastAPI Backend (Python 3.13)
│       ├─ 📁 app/             ⟵ API application code
│       │   └─ 📄 main.py      ⟵ FastAPI main application
│       ├─ 📄 pyproject.toml   ⟵ Python dependencies
│       └─ 📄 README.md
│
├─ 📁 prisma/                  ⟵ Database Schema & Migrations
│   └─ 📄 schema.prisma        ⟵ Prisma schema definition
│
├─ 📁 infra/                   ⟵ Infrastructure Configuration
│   └─ 📁 docker/              ⟵ Dockerfiles & Scripts
│       ├─ 📄 web.Dockerfile   ⟵ Next.js container (Node 22)
│       ├─ 📄 api.Dockerfile   ⟵ FastAPI container (Python 3.13)
│       └─ 📁 postgres/        ⟵ DB initialization scripts
│
├─ 📁 docs/                    ⟵ Documentation
│   └─ 📄 Version_Matrix.md    ⟵ Version compatibility matrix
│
├─ 📁 .github/                 ⟵ GitHub Actions CI/CD
│   └─ 📁 workflows/
│       └─ 📄 ci.yml
│
├─ 📄 docker-compose.yml       ⟵ Docker orchestration (main)
├─ 📄 .env.example             ⟵ Environment variables template
├─ 📄 .gitignore
├─ 📄 package.json             ⟵ Root workspace scripts
└─ 📄 README.md
```

## 🔧 Development Commands

### Simple Docker Commands (Run from Root)
```bash
# Start all services
docker compose up --build

# Start in background  
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Restart specific service
docker compose restart api
```

### NPM Workspace Commands
```bash
# Start development environment (same as docker compose up --build)
npm run dev

# Stop environment
npm run dev:down

# View logs  
npm run dev:logs

# Clean restart with fresh build
npm run dev:rebuild
```

### Database Commands
```bash
# Generate Prisma client
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio
```

## 🔌 API Endpoints

### Health & Monitoring
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health with system metrics
- `GET /api/status` - API status and configuration

### Documentation
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

### Meta Information
- `GET /` - API information and available endpoints

### Protected Routes (Example)
- `GET /api/protected` - Example of authenticated endpoint

## 🔐 Security Features

### Backend Security
- 🛡️ **CORS Middleware** - Configured for frontend origin
- 🔒 **Trusted Host Middleware** - Prevents host header attacks
- 🔐 **Bearer Token Authentication** - Ready for JWT implementation
- 📝 **Global Exception Handler** - Structured error responses
- 🚫 **Input Validation** - Pydantic models for request validation

### Infrastructure Security
- 🔧 **Environment Variables** - Sensitive data not hardcoded
- 🐳 **Container Isolation** - Services run in isolated containers
- 🔄 **Health Checks** - Monitor service availability
- 📊 **Logging** - Comprehensive logging for monitoring

## 🌐 Environment Configuration

### Development (.env)
```bash
# Database
DATABASE_URL=postgres://app:app@localhost:5432/app

# API Configuration
FRONTEND_ORIGIN=http://localhost:3000
ALLOWED_HOSTS=localhost,127.0.0.1
ENVIRONMENT=development

# Next.js Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production Considerations
- Use strong, unique passwords for database
- Set up SSL/TLS certificates
- Configure proper CORS origins
- Set up monitoring and logging
- Use secrets management for sensitive data

## 🗄️ Database Management

The database schema is defined in `prisma/schema.prisma`. The starter includes:
- User model with basic fields
- Proper indexing and relationships
- PostgreSQL-specific features

### Advanced Prisma Commands
```bash
# Create a new migration with a name
npx prisma migrate dev --name migration_name

# Reset database (removes all data)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## 🚢 Deployment

### Production Deployment
1. **Environment Setup**
   - Set production environment variables
   - Configure database connection string
   - Update `FRONTEND_ORIGIN` and `ALLOWED_HOSTS`

2. **Docker Production Build**
   ```bash
   # Build and run in production mode
   docker compose up --build -d
   ```

3. **Platform-Specific Deployment**
   - **Vercel** (Frontend): Deploy from `apps/web` directory
   - **Railway/Render** (Backend): Deploy from `apps/api` directory  
   - **Supabase/RDS** (Database): Update `DATABASE_URL` in environment
   - **Docker Hub**: Use provided Dockerfiles for container deployment

## 🧪 Testing

### Comprehensive Test Suite

The boilerplate includes a comprehensive testing infrastructure with multiple test types:

#### Quick Test Commands
```bash
# Run all tests at once (cross-platform)
npm run test

# Check platform compatibility first
npm run test:platform      # Verify system compatibility

# Run specific test suites
npm run test:health        # Health checks only
npm run test:integration   # Integration tests
npm run test:api          # API tests (pytest)
npm run test:web          # Web tests (Jest)

# Or use the test runner directly
node run-tests.js          # Run all tests
node run-tests.js --help   # Show all options
```

#### Test Types

**🏥 Health Checks** (`tests/health-check.js`)
- Verifies all services are running and responding
- Tests API endpoints and web frontend accessibility
- Validates CORS configuration
- Checks response times and service health

**🔗 Integration Tests** (`tests/integration/`)
- End-to-end functionality testing
- API response time and content type validation
- Error handling verification
- Security headers and environment configuration
- Full-stack communication testing

**🐍 API Tests** (`tests/api/`)
- Python pytest-based testing for FastAPI
- Comprehensive endpoint testing
- Error handling and performance tests
- Authentication and security validation
- Response format and data validation

**🌐 Web Tests** (`tests/web/`)
- Jest-based testing for Next.js frontend
- Page loading and rendering tests
- API integration from frontend perspective
- Performance and accessibility checks

**🔍 Platform Tests** (`tests/platform-check.js`)
- Cross-platform compatibility verification
- Dependency availability checking
- Path handling and shell compatibility
- Environment variable validation

#### Individual Test Commands

**Frontend Testing**
```bash
cd apps/web
npm run test        # Run Next.js tests
npm run test:watch  # Watch mode
npm run lint        # ESLint
```

**Backend Testing**
```bash
cd apps/api
poetry run pytest tests/api/ -v     # Run API tests
poetry run pytest --coverage        # With coverage
```

**Standalone Test Scripts**
```bash
# Health checks
node tests/health-check.js

# Integration tests  
node tests/integration/run-tests.js

# Comprehensive test runner
node run-tests.js --api-only        # API tests only
node run-tests.js --web-only        # Web tests only
node run-tests.js --integration     # Integration only
```

#### Cross-Platform Compatibility

**🌍 Platform Support**
- ✅ **Windows** (PowerShell, Command Prompt, Git Bash)
- ✅ **macOS** (Terminal, Zsh, Bash)
- ✅ **Linux** (Bash, Zsh, various distributions)
- ✅ **WSL** (Windows Subsystem for Linux)

**🔧 Automatic Detection**
- Python command selection (`python` vs `python3`)
- Path separator handling (Windows `\` vs Unix `/`)
- Shell command compatibility
- Dependency availability checks

**🛠️ Cross-Platform Features**
- Smart dependency detection and fallbacks
- Universal Docker Compose commands
- Platform-specific optimizations
- Error messages with platform-specific guidance

#### Test Configuration

Tests are configured to work with:
- **Development**: `http://localhost:3000` and `http://localhost:8000`
- **Custom URLs**: Set `WEB_URL` and `API_URL` environment variables
- **CI/CD**: Automatic retry logic and timeout handling
- **Cross-platform**: Automatic platform detection and adaptation

#### Prerequisites for Testing

**🚀 Quick Start (Cross-Platform)**
1. **Check compatibility**: `npm run test:platform`
2. **Start services**: `docker compose up --build`
3. **Run tests**: `npm run test:health` to verify everything works

**📋 Detailed Setup**
- **Docker**: Required for containerized services
- **Node.js**: v18+ for frontend and test runner
- **Python**: Optional for API tests (auto-detected: `python` or `python3`)
- **Poetry**: Optional for enhanced Python dependency management

**🔄 Auto-Installation**
- Web test dependencies install automatically
- Python dependencies fall back gracefully
- Platform-specific commands detected automatically
- Missing tools provide helpful installation guidance

#### Continuous Integration

**🔄 GitHub Actions Pipeline**
- Automated testing on every push and pull request
- Cross-platform compatibility testing (Ubuntu latest)
- Comprehensive service health checking with retry logic
- Security scanning with Trivy vulnerability detection
- Docker image building and tagging

**🛠️ CI/CD Features**
- PostgreSQL service integration with health checks
- Automatic dependency installation (Node.js, Python, Poetry)
- Platform compatibility verification
- Service startup verification with detailed logging
- Robust error handling and debugging information

**📊 Test Coverage in CI**
- Health checks with CI-optimized script
- Integration tests for end-to-end functionality
- API tests with pytest (when available)
- Web tests with Jest framework
- Code linting for both frontend and backend

**🔍 CI-Specific Optimizations**
- Simplified health check script for CI environments
- Enhanced timeout handling and retry logic
- Detailed debugging output for troubleshooting
- Non-blocking security scans to prevent false failures
- Proper exit codes for pipeline integration

## 🛠️ Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill processes on ports
npx kill-port 3000 8000 5432
```

**Docker Build Issues**
```bash
# Stop and clean everything
docker compose down --volumes

# Clean Docker cache
docker system prune -a

# Rebuild from scratch
docker compose up --build
```

**Database Connection Issues**
- Ensure PostgreSQL container is healthy
- Check `DATABASE_URL` in environment variables
- Verify network connectivity between containers

**CORS Issues**
- Check `FRONTEND_ORIGIN` matches your frontend URL
- Verify CORS middleware configuration in FastAPI

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [FastAPI](https://fastapi.tiangolo.com/) - Modern, fast web framework for Python
- [Prisma](https://prisma.io/) - Next-generation ORM for Node.js and TypeScript
- [PostgreSQL](https://postgresql.org/) - The World's Most Advanced Open Source Relational Database
- [Docker](https://docker.com/) - Containerization Platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS Framework

## 📞 Support

If you have any questions or run into issues, please:
1. Check the troubleshooting section above
2. Search existing [GitHub Issues](https://github.com/HiNala/boiler-plate-next-fast-api/issues)
3. Create a new issue with detailed information

---

**Built with ❤️ for the developer community**

⭐ If this project helped you, please consider giving it a star on GitHub! 