FROM node:22-bookworm-slim

WORKDIR /app

# Copy package files first for better caching
COPY apps/web/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire web application at once to avoid context issues
COPY apps/web/ ./

# Remove any local development files that shouldn't be in container
RUN rm -rf node_modules/.cache \
    && rm -rf .next \
    && rm -f .env.local

# Set environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Use npm run dev for development
CMD ["npm", "run", "dev"] 