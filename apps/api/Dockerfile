FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
RUN npm ci

COPY packages/shared/ ./packages/shared/
COPY apps/api/ ./apps/api/
RUN npx turbo build --filter=@task-manager/api

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/shared/dist ./packages/shared/dist
COPY apps/api/package.json ./apps/api/
RUN npm ci --omit=dev --workspace=@task-manager/api --workspace=@task-manager/shared

COPY --from=builder /app/apps/api/dist ./apps/api/dist

RUN mkdir -p /data
EXPOSE 3001

CMD ["node", "apps/api/dist/index.js"]
