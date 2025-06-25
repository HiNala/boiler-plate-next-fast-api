FROM python:3.13-slim

WORKDIR /app

# Install system dependencies and build tools
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
ENV POETRY_VERSION=1.8.2
RUN pip install "poetry==$POETRY_VERSION"

# Configure poetry: Don't create virtual environment, it's not needed in a container
ENV POETRY_NO_INTERACTION=1 \
    POETRY_VENV_IN_PROJECT=false \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Copy poetry files
COPY apps/api/pyproject.toml apps/api/poetry.lock* ./

# Install dependencies globally
RUN poetry config virtualenvs.create false && \
    poetry install --no-root --only main && \
    rm -rf $POETRY_CACHE_DIR

# Copy application code
COPY apps/api ./

# Copy schema from root  
COPY prisma ./prisma

# Generate Prisma client (will be done at runtime)
# RUN poetry run prisma generate

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 