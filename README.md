# Task Manager - Kiip

Aplicacao web de gerenciamento de tarefas para times, construida como um monorepo com Turborepo.

## Stack Tecnologica

| Camada     | Tecnologia                          |
| ---------- | ----------------------------------- |
| Monorepo   | Turborepo + npm workspaces          |
| Backend    | Node.js + Fastify + TypeScript      |
| Frontend   | React 19 + Vite + TanStack Query    |
| Validacao  | Zod (schemas compartilhados)        |
| Persistencia | JSON file (arquivo local)         |
| Container  | Docker + Docker Compose             |

## Como Rodar

### Opcao 1: Docker Compose (recomendado)

```bash
docker compose up --build
```

Acesse:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:3001/api/tasks

### Opcao 2: Desenvolvimento Local

Pre-requisitos: Node.js 22+ e npm 10+

```bash
# Instalar dependencias
npm install

# Rodar em modo desenvolvimento (API + Frontend simultaneamente)
npm run dev
```

Acesse:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001/api/tasks

## Estrutura do Projeto

```
.
├── apps/
│   ├── api/                    # Backend Fastify
│   │   └── src/
│   │       ├── controllers/    # Handling de request/response
│   │       ├── services/       # Logica de negocio + validacao
│   │       ├── repositories/   # Acesso a dados
│   │       ├── plugins/        # Plugins Fastify (error handler)
│   │       ├── routes/         # Definicao de rotas
│   │       ├── database.ts     # Camada de persistencia JSON
│   │       └── index.ts        # Entry point
│   └── web/                    # Frontend React
│       └── src/
│           ├── api/            # Fetch wrappers tipados
│           ├── hooks/          # TanStack Query hooks
│           ├── components/     # Componentes React
│           └── styles/         # CSS global
├── packages/
│   └── shared/                 # Schemas Zod + tipos TypeScript
├── docker-compose.yml
└── turbo.json
```

## API Endpoints

| Metodo | Rota              | Descricao                          |
| ------ | ----------------- | ---------------------------------- |
| GET    | /api/tasks        | Listar tarefas (filtro por status) |
| POST   | /api/tasks        | Criar nova tarefa                  |
| PATCH  | /api/tasks/:id    | Atualizar tarefa                   |
| DELETE | /api/tasks/:id    | Deletar tarefa                     |
| GET    | /api/health       | Health check                       |

**Filtro por status**: `GET /api/tasks?status=pending|in_progress|done`

## Decisoes Tecnicas

### Por que Turborepo + npm workspaces?

Permite compartilhar tipos e schemas entre frontend e backend com type safety de ponta a ponta, sem publicar pacotes. O Turborepo gerencia o pipeline de build com cache e paralelismo.

### Por que JSON file ao inves de banco de dados?

Para um MVP com objetivo de demo, um arquivo JSON oferece:
- **Zero dependencias externas** -- nao precisa instalar nem configurar banco
- **Sem compilacao nativa** -- roda em qualquer SO sem build tools (g++, python)
- **Simplicidade** -- o foco do desafio e arquitetura, nao infraestrutura

O repository pattern abstrai completamente a persistencia. Trocar para PostgreSQL/SQLite no futuro requer mudar apenas a classe `Database` e o `TaskRepository`, sem alterar services, controllers ou frontend.

### Por que Fastify?

Fastify e mais rapido que Express, tem suporte nativo a TypeScript, sistema de plugins, e validacao de schema integrada. E um framework moderno com boa DX.

### Por que TanStack Query?

Gerencia cache, refetch automatico, estados de loading/error, e invalidacao de queries pos-mutation. Elimina a necessidade de gerenciamento manual de estado do servidor.

### Arquitetura do Backend

Separacao de responsabilidades em camadas:

- **Routes** -- registra endpoints no Fastify
- **Controllers** -- extrai dados do request, chama service, formata response
- **Services** -- validacao com Zod, logica de negocio, lanca erros tipados
- **Repositories** -- acesso a dados, mapping de campos (snake_case -> camelCase)
- **Database** -- persistencia em arquivo JSON com leitura/escrita atomica

### Validacao compartilhada com Zod

Os schemas Zod vivem no pacote `@task-manager/shared` e sao usados tanto no backend (validacao de requests) quanto no frontend (tipos TypeScript). Isso garante que frontend e backend sempre concordam sobre o formato dos dados.

## O que faria diferente com mais tempo

- **Testes automatizados**: testes unitarios para services/repositories e testes de integracao para os endpoints da API
- **PostgreSQL/SQLite**: persistencia robusta com migrations versionadas
- **Paginacao**: para lidar com grande volume de tarefas
- **Drag and drop**: mover tarefas entre status arrastando cards (Kanban)
- **Busca e ordenacao**: filtrar por texto e ordenar por diferentes campos
- **WebSocket/SSE**: atualizacoes em tempo real quando outro usuario modifica tarefas
- **CI/CD**: pipeline com lint, type check, testes e build automatizado
- **Rate limiting e logging estruturado**: para producao
