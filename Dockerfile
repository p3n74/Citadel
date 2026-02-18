# Citadel Codex – production image (server + web app)
# Runtime env (required): DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, CORS_ORIGIN
# Optional: PUBLIC_DIR (default /app/public). Port 3000.

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace and package files
COPY package.json package-lock.json turbo.json ./
COPY apps/web/package.json apps/web/
COPY apps/server/package.json apps/server/
COPY packages/api/package.json packages/api/
COPY packages/auth/package.json packages/auth/
COPY packages/config/package.json packages/config/
COPY packages/db/package.json packages/db/
COPY packages/env/package.json packages/env/

# Install all dependencies
RUN npm ci

# Copy source
COPY apps apps
COPY packages packages

# Generate Prisma client (required before server build)
RUN npm run db:generate

# Build web and server
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PUBLIC_DIR=/app/public

# Copy full workspace so npm prune can resolve workspaces
COPY --from=builder /app .
# Serve web app from /app/public
COPY --from=builder /app/apps/web/dist ./public

# Keep only production dependencies
RUN npm prune --production

EXPOSE 3001

CMD ["node", "apps/server/dist/index.mjs"]
