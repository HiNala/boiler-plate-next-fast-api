FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY apps/web/package.json ./
RUN npm install

# Copy source code
COPY apps/web/src ./src
COPY apps/web/lib ./lib
COPY apps/web/public ./public
COPY apps/web/*.json ./
COPY apps/web/*.ts ./
COPY apps/web/*.mjs ./

EXPOSE 3000

CMD ["npm", "run", "dev"] 