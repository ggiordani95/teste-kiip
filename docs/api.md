# API

Base: `http://localhost:3001`

Docs interativa (Scalar): `http://localhost:3001/api/docs`

## Boards

```
GET  /api/boards                    # lista boards
GET  /api/boards/:id                # detalhe
GET  /api/boards/:id/configuration  # colunas e status
GET  /api/boards/:id/tasks          # tasks (com filtros)
GET  /api/boards/:id/members        # membros
```

Filtros na listagem de tasks:

- `status` — pending, in_progress, done
- `assignee` — busca parcial pelo nome
- `query` — busca em titulo e descricao
- `startAt` — offset (default 0)
- `maxResults` — limite (default 50, max 100)

## Tasks

```
POST   /api/tasks           # criar
GET    /api/tasks/:id        # detalhe
PUT    /api/tasks/:id        # atualizar (titulo, descricao, responsavel)
PUT    /api/tasks/:id/move   # mover entre colunas
DELETE /api/tasks/:id        # deletar
```

## Exemplos

Criar:

```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"boardId": 1, "title": "Implementar login", "assignee": "Ana Silva"}'
```

Filtrar por status:

```bash
curl "http://localhost:3001/api/boards/1/tasks?status=pending"
```

Atualizar:

```bash
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Login com OAuth", "assignee": "Carlos Souza"}'
```

Mover:

```bash
curl -X PUT http://localhost:3001/api/tasks/1/move \
  -H "Content-Type: application/json" \
  -d '{"columnId": 2, "targetIndex": 0, "status": "in_progress"}'
```

Deletar:

```bash
curl -X DELETE http://localhost:3001/api/tasks/1
```
