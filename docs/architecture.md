# Arquitetura

Monorepo com 3 pacotes (Turborepo + pnpm):

```
packages/shared   →  Schemas Zod + tipos (usado por api e web)
apps/api          →  Backend Fastify + PostgreSQL
apps/web          →  Frontend Next.js 15 + React 19
```

## Backend

Segue Ports & Adapters. A ideia: o dominio nao conhece Fastify nem PostgreSQL.

```
apps/api/src/
├── config/              # env vars validadas com Zod
├── domain/
│   ├── ports/           # interfaces dos repositories
│   ├── services/        # logica de negocio
│   └── errors/          # NotFound, Validation
├── application/
│   ├── controllers/     # recebem/retornam objetos puros, sem Request/Reply
│   └── dtos/            # tipos de entrada/saida dos controllers
├── infrastructure/
│   ├── database/        # pool, migrations, transactions
│   ├── repositories/    # implementacoes PostgreSQL
│   └── http/            # routes Fastify, plugins, Scalar docs
└── di/                  # composition root (DI manual, sem framework)
```

Controllers nao importam nada do Fastify. As routes fazem a ponte — pegam params/body do request, chamam o controller, e devolvem o resultado.

Repositories sao interfaces no `domain/ports/`. O DI container conecta tudo no boot.

Migrations sao SQL puro em `migrations/`. Rodam em ordem e ficam registradas em `schema_migrations`.

## Frontend

```
apps/web/src/
├── app/                     # App Router (layout, page)
├── lib/                     # http client
├── components/              # Avatar, Modal, Select
└── features/tasks/
    ├── components/          # KanbanBoard, KanbanColumn, TaskCard, TaskFormPanel
    ├── hooks/               # useBoards, useTaskMutations, useDragAndDrop, useTaskForm
    ├── config/              # cores, icones, formatacao de datas
    ├── stores/              # Zustand (board ativo + dados do servidor)
    ├── pages/               # KanbanPage
    ├── api/                 # chamadas HTTP tipadas
    └── utils/               # agrupamento por coluna, reordenacao de cache
```

Estado do servidor fica no Zustand. O carregamento inicial usa `use()` do React 19 com `<Suspense>` — sem useEffect pra fetch.

Mutations fazem update otimista no store, chamam a API, e fazem refetch em background pra reconciliar. Se der erro, restaura o snapshot anterior.

## Shared

```
packages/shared/src/
├── schemas.ts    # Zod (task, board, member, column)
├── types.ts      # tipos inferidos dos schemas
└── index.ts      # re-exports
```

Usado nos dois lados. Backend valida input com `.parse()`, frontend usa os tipos pra tipar props e API calls.
