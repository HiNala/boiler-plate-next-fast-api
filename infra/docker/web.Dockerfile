FROM node:22-bookworm-slim

WORKDIR /app

# Copy package files first for better caching
COPY apps/web/package*.json ./

# Install dependencies and generate new lock file
RUN npm install

# Copy configuration files
COPY apps/web/*.json ./
COPY apps/web/*.js ./
COPY apps/web/*.ts ./
COPY apps/web/*.mjs ./

# Copy source code
COPY apps/web/src ./src
COPY apps/web/lib ./lib
COPY apps/web/public ./public

# Set environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Use npm run dev for development
CMD ["npm", "run", "dev"] 