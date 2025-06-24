# 🚀 Full-Stack Boilerplate: Next.js 15 + FastAPI + PostgreSQL

A production-ready, containerized full-stack application boilerplate with modern development tools and best practices.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)

## ✨ Features

### 🎯 **Frontend (Next.js 15)**
- ⚛️ **React 19** with Next.js App Router
- 🎨 **Tailwind CSS** for styling
- 📱 **Responsive Design** with mobile-first approach
- 🔥 **Hot Reload** for instant development feedback
- 🌙 **Dark Mode** support built-in
- 📖 **TypeScript** for type safety

### 🐍 **Backend (FastAPI)**
- 🚀 **FastAPI** with automatic API documentation
- 🔒 **Security Middleware** (CORS, TrustedHost)
- 📊 **Health Check Endpoints** with system monitoring
- 🔐 **Bearer Token Authentication** ready
- 📝 **Comprehensive Logging** and error handling
- 🏷️ **Type Hints** throughout the codebase

### 🐘 **Database (PostgreSQL)**
- 🗄️ **PostgreSQL 16** for reliable data storage
- 🔄 **Prisma ORM** for type-safe database queries
- 📦 **Docker Volumes** for data persistence
- 🔧 **Migration System** for schema management

### 🐳 **DevOps & Infrastructure**
- 🔧 **Docker Compose** for easy orchestration
- 🔄 **Hot Reload** enabled for all services
- 🌐 **CORS** properly configured
- 📊 **Health Monitoring** across all services
- 🛡️ **Security Headers** and middleware
- 📋 **Environment Configuration** management

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/)

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
   docker compose -f infra/compose/docker-compose.dev.yml up --build
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
│   └─ 📁 api/                 ⟵ FastAPI Backend
│       ├─ 📁 app/             ⟵ API application code
│       │   └─ 📄 main.py      ⟵ FastAPI main application
│       ├─ 📄 pyproject.toml   ⟵ Python dependencies
│       └─ 📄 README.md
│
├─ 📁 prisma/                  ⟵ Database Schema & Migrations
│   └─ 📄 schema.prisma        ⟵ Prisma schema definition
│
├─ 📁 infra/                   ⟵ Infrastructure Configuration
│   ├─ 📁 docker/              ⟵ Dockerfiles
│   │   ├─ 📄 web.Dockerfile   ⟵ Next.js container
│   │   ├─ 📄 api.Dockerfile   ⟵ FastAPI container
│   │   └─ 📁 postgres/        ⟵ DB initialization scripts
│   │
│   └─ 📁 compose/             ⟵ Docker Compose files
│       └─ 📄 docker-compose.dev.yml
│
├─ 📁 .github/                 ⟵ GitHub Actions CI/CD
│   └─ 📁 workflows/
│       └─ 📄 ci.yml
│
├─ 📄 .env.example             ⟵ Environment variables template
├─ 📄 .gitignore
├─ 📄 package.json             ⟵ Root workspace scripts
└─ 📄 README.md
```

## 🔧 Development Commands

### Docker Commands
```bash
# Start all services
docker compose -f infra/compose/docker-compose.dev.yml up --build

# Start in background
docker compose -f infra/compose/docker-compose.dev.yml up -d

# Stop all services
docker compose -f infra/compose/docker-compose.dev.yml down

# View logs
docker compose -f infra/compose/docker-compose.dev.yml logs -f

# Restart specific service
docker compose -f infra/compose/docker-compose.dev.yml restart api
```

### Root Workspace Commands
```bash
# Start development environment
npm run dev

# Stop environment
npm run dev:down

# View logs
npm run dev:logs

# Prisma commands
npm run prisma:generate
npm run prisma:migrate
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

### Prisma Commands
```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name migration_name

# Open Prisma Studio (Database GUI)
npx prisma studio

# Reset database
npx prisma migrate reset
```

### Schema Management
The database schema is defined in `prisma/schema.prisma`. The starter includes:
- User model with basic fields
- Proper indexing and relationships
- PostgreSQL-specific features

## 🚢 Deployment

### Production Deployment
1. **Environment Setup**
   - Copy `.env.example` to `.env.production`
   - Set production environment variables
   - Configure database connection string

2. **Docker Production Build**
   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

3. **Platform-Specific Deployment**
   - **Vercel** (Frontend): Set build output to `apps/web`
   - **Railway/Render** (Backend): Use `apps/api` as root
   - **Supabase/RDS** (Database): Update `DATABASE_URL`

## 🧪 Testing

### Frontend Testing
```bash
cd apps/web
npm run test        # Run tests
npm run test:watch  # Watch mode
npm run lint        # ESLint
```

### Backend Testing
```bash
cd apps/api
poetry run pytest  # Run tests
poetry run coverage run -m pytest  # With coverage
```

## 🛠️ Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill processes on ports
npx kill-port 3000 8000 5432
```

**Docker Build Issues**
```bash
# Clean Docker cache
docker system prune -a
docker compose down --volumes
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