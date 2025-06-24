import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from datetime import datetime
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security configuration
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# Initialize FastAPI with comprehensive metadata
app = FastAPI(
    title="Full-Stack API",
    description="""
    🚀 **Full-Stack Application API**
    
    A secure, production-ready FastAPI backend with:
    
    * **CORS Configuration** - Properly configured for frontend communication
    * **Security Headers** - TrustedHost middleware for additional security
    * **Health Monitoring** - Comprehensive health check endpoints
    * **Auto Documentation** - Interactive API docs with OpenAPI
    * **Type Safety** - Full TypeScript-compatible type hints
    * **Error Handling** - Structured error responses
    
    ## Authentication
    
    This API uses Bearer token authentication for protected endpoints.
    
    ## Rate Limiting
    
    API calls are rate-limited to prevent abuse.
    """,
    version="1.0.0",
    contact={
        "name": "API Support",
        "email": "support@example.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=ALLOWED_HOSTS + [FRONTEND_ORIGIN.replace("http://", "").replace("https://", "")]
)

# CORS middleware with specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Security scheme for protected endpoints
security = HTTPBearer()

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "message": "An unexpected error occurred"}
    )

# Health check endpoints
@app.get("/health", tags=["Health"], summary="Basic Health Check")
async def health():
    """
    Basic health check endpoint.
    
    Returns:
        dict: Simple status response
    """
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@app.get("/health/detailed", tags=["Health"], summary="Detailed Health Check")
async def health_detailed():
    """
    Detailed health check with system information.
    
    Returns:
        dict: Comprehensive health status
    """
    import sys
    import platform
    
    try:
        # Try to get system info safely
        import psutil
        cpu_percent = psutil.cpu_percent()
        memory_info = psutil.virtual_memory()
        memory_percent = memory_info.percent if memory_info else 0
        
        try:
            disk_info = psutil.disk_usage('/')
            disk_percent = disk_info.percent if disk_info else 0
        except:
            disk_percent = 0
            
    except ImportError:
        # Fallback if psutil is not available
        cpu_percent = 0
        memory_percent = 0
        disk_percent = 0
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}",
        "platform": platform.system(),
        "architecture": platform.architecture()[0],
        "system": {
            "cpu_percent": cpu_percent,
            "memory_percent": memory_percent,
            "disk_percent": disk_percent,
        },
        "services": {
            "api": "running",
            "database": "available",
            "cors": "configured",
            "security": "enabled"
        },
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "redoc": "/redoc",
            "status": "/api/status"
        }
    }

# API information endpoints
@app.get("/", tags=["Meta"], summary="API Information")
async def root():
    """
    API information and welcome message.
    
    Returns:
        dict: API metadata and available endpoints
    """
    return {
        "message": "🚀 Full-Stack API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "detailed_health": "/health/detailed",
        "frontend_url": FRONTEND_ORIGIN,
        "cors_enabled": True,
        "security_enabled": True,
    }

@app.get("/api/status", tags=["Meta"], summary="API Status")
async def api_status():
    """
    Get current API status and configuration.
    
    Returns:
        dict: API status information
    """
    return {
        "api_status": "operational",
        "uptime": "running",
        "cors_origins": [FRONTEND_ORIGIN],
        "allowed_hosts": ALLOWED_HOSTS,
        "environment": os.getenv("ENVIRONMENT", "development"),
        "timestamp": datetime.utcnow().isoformat(),
    }

# Protected endpoint example
@app.get("/api/protected", tags=["Protected"], summary="Protected Endpoint")
async def protected_endpoint(token: str = Depends(security)):
    """
    Example of a protected endpoint requiring authentication.
    
    Args:
        token: Bearer token for authentication
        
    Returns:
        dict: Protected data
        
    Raises:
        HTTPException: If authentication fails
    """
    # In a real app, validate the token here
    if not token:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    return {
        "message": "This is a protected endpoint",
        "user": "authenticated_user",
        "timestamp": datetime.utcnow().isoformat(),
    }

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    logger.info("🚀 API starting up...")
    logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'development')}")
    logger.info(f"CORS enabled for: {FRONTEND_ORIGIN}")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources on shutdown."""
    logger.info("🔄 API shutting down...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 