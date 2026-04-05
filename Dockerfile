# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:22.22.0-alpine AS builder

# Accept build argument for base path
ARG NEXT_PUBLIC_BASE_PATH="/djong-pinisi"

# Set as environment variable for Next.js build
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH

RUN apk add --no-cache g++ make py3-pip libc6-compat

WORKDIR /app

# Install dependencies first (cached layer — only re-runs when lock file changes)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── Production stage ─────────────────────────────────────────────────────────
# Uses Next.js standalone output: no full node_modules needed at runtime.
# Final image is typically 60-80% smaller than copying node_modules wholesale.
FROM node:22.22.0-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3001

# Strip npm/corepack — not needed since we run `node server.js` directly (~20 MB saved)
RUN npm uninstall -g npm corepack 2>/dev/null || true \
  && rm -rf /usr/local/lib/node_modules/npm \
             /usr/local/lib/node_modules/corepack \
  && find /usr/local/bin -name "npm*" -o -name "npx*" -o -name "corepack*" | xargs rm -f || true

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001

# standalone/ already contains the minimal node_modules subset traced by Next.js
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

# Run the standalone Node.js server directly — no npm, no shell wrapper
CMD ["node", "server.js"]
