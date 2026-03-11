# Task Manager — Teste Kiip

Kanban board pra gerenciar tarefas. Criar, editar, mover entre colunas com drag-and-drop, deletar.

**Stack:** Next.js 15, React 19, Fastify, PostgreSQL, Zustand, Playwright, Vitest

## Rodando com Docker

```bash
cp .env.example .env
docker compose up --build
```

| Servico  | URL |
|----------|-----|
| Frontend | http://localhost:3004 |
| API      | http://localhost:3001 |
| API Docs | http://localhost:3001/api/docs |

## Dev local

```bash
docker compose up postgres -d       # sobe o banco
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
pnpm install
pnpm dev
```

## Testes

```bash
pnpm test                           # unitarios (api + web)
pnpm --filter @task-manager/web test:e2e   # e2e com Playwright
```

## Docs

Detalhes de arquitetura, endpoints e decisoes tecnicas em `/docs`.
