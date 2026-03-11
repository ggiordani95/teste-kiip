FROM node:22-alpine AS builder
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

COPY packages/shared/ ./packages/shared/
COPY apps/api/ ./apps/api/
RUN pnpm turbo build --filter=@task-manager/api && pnpm --filter=@task-manager/api deploy --legacy --prod /prod/api

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /prod/api ./
COPY --from=builder /app/apps/api/migrations ./migrations

EXPOSE 3001
CMD ["node", "dist/index.js"]
