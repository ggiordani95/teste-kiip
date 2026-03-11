<div align="center">

# Teste Kiip

**Teste Técnico — Desenvolvedor(a) Pleno Full Stack**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5-000000?logo=fastify&logoColor=white)](https://fastify.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)

</div>

---

## Funcionalidades

- Criar tarefas com título, descrição e responsável
- Visualizar tarefas organizadas em colunas do kanban
- Atualizar status arrastando entre colunas (drag-and-drop)
- Editar titulo, descricao e responsavel de tarefas existentes
- Deletar tarefas

---

## Quick Start

### Docker (recomendado)

**1.** Crie um arquivo `.env` na raiz do projeto:

```env
# Postgres
POSTGRES_DB=taskmanager
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# API
NODE_ENV=production
API_PORT=3001
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/taskmanager
FRONTEND_URL=http://localhost:3004

# Web
NEXT_PUBLIC_API_URL=http://api:3001
WEB_PORT=3004
```

**2.** Suba tudo com um comando:

```bash
docker compose up --build
```

**3.** Acesse:

| Servico  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3004       |
| API      | http://localhost:3001       |
| Postgres | `localhost:5433`           |

---

### Desenvolvimento local

```bash
# 1. Subir o banco
docker compose up postgres -d

# 2. Configurar variaveis de ambiente
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

<details>
<summary><strong>apps/api/.env</strong></summary>

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/taskmanager
FRONTEND_URL=http://localhost:3004
```

</details>

<details>
<summary><strong>apps/web/.env</strong></summary>

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

</details>

```bash
# 3. Instalar dependencias e rodar
pnpm install
pnpm dev
```

---

## Testes

```bash
pnpm test
```

Roda todos os testes do monorepo via Turborepo (backend + frontend).

---

## Docs

- Todas documentações na pasta `/docs`.
