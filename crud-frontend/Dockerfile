# ✅ Multi-stage build → Image เล็กลง Production-ready
FROM node:24-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source & Build
COPY . .
RUN npm run build

# ─────────────────────────────────────
# Production Stage
# ─────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy เฉพาะที่จำเป็นจาก builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]