# Arquitetura

## Visao geral

O projeto e um monorepo com 3 pacotes gerenciados por Turborepo + pnpm workspaces:

```
packages/shared   →   Schemas Zod + tipos (usado por api e web)
apps/api          →   Backend Node.js + Fastify + PostgreSQL
apps/web          →   Frontend Next.js 15 + React 19
```

---

## Backend — Ports & Adapters

O backend segue o padrao Ports & Adapters (Hexagonal Architecture), separando dominio de infraestrutura:

```
apps/api/src/
├── config/                 # Variaveis de ambiente (validadas com Zod)
├── domain/
│   ├── ports/              # Interfaces dos repositories
│   ├── services/           # Logica de negocio
│   ├── errors/             # Erros de dominio (NotFound, Validation)
│   └── validate.ts         # Validacao generica com Zod
├── application/
│   └── controllers/        # Handlers puros (sem dependencia do Fastify)
├── infrastructure/
│   ├── database/           # Pool, migrations, transactions
│   ├── repositories/       # Implementacoes PostgreSQL dos ports
│   └── http/               # Routes, plugins, helpers (adapter Fastify)
└── di/                     # Composition root — DI container manual
```

### Principios

- **Controllers desacoplados do framework** — recebem/retornam objetos puros, sem `Request`/`Reply` do Fastify
- **Repositories como ports** — interfaces definidas no domain, implementacoes no infrastructure
- **DI container manual** — composicao no boot sem decorators, reflection ou frameworks de DI
- **Migrations sequenciais** — arquivos SQL em `migrations/`, executados em ordem e registrados em `schema_migrations`

---

## Frontend — Feature folder

```
apps/web/src/
├── app/                        # Next.js App Router (layout, page, providers)
├── lib/                        # Utilitarios compartilhados (http client)
├── components/                 # Componentes reutilizaveis
│   ├── Avatar.tsx
│   ├── Modal/
│   │   ├── Modal.tsx
│   │   └── hooks/useModal.ts
│   └── Select/
│       ├── Select.tsx
│       └── hooks/useDropdown.ts
└── features/tasks/             # Feature principal
    ├── components/             # KanbanBoard, KanbanColumn, TaskCard, Modals
    ├── hooks/                  # useTaskMutations, useColumnMutations, useDragAndDrop
    ├── config/                 # Constantes visuais (cores, icones, status)
    ├── stores/                 # Estado local (active board — Zustand)
    ├── pages/                  # KanbanPage (composicao da tela)
    ├── tasks.api.ts            # Chamadas HTTP tipadas
    ├── query-keys.ts           # Factory de query keys (TanStack Query)
    ├── task-cache.ts           # Helpers para optimistic updates
    └── group-tasks.ts          # Agrupamento de tasks por coluna
```

### Principios

- **Custom hooks** separando logica de UI em cada componente
- **Optimistic updates** com snapshot/rollback nas mutations de move e update
- **Drag-and-drop** com `@hello-pangea/dnd`
- **Componentes reutilizaveis** extraidos quando ha reuso real entre features

---

## Shared — Schemas compartilhados

```
packages/shared/src/
├── schemas.ts    # Schemas Zod (task, board, member, column)
├── types.ts      # Tipos TypeScript inferidos dos schemas
└── index.ts      # Barrel exports
```

O pacote `@task-manager/shared` e usado tanto no backend (validacao de input) quanto no frontend (tipos TypeScript). Garante **consistencia entre as camadas** sem duplicacao de definicoes.
