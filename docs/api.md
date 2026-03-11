# API Endpoints

> Base URL: `http://localhost:3001`
>
> Documentacao interativa (Scalar): [`http://localhost:3001/api/docs`](http://localhost:3001/api/docs)

---

## Boards

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `GET` | `/api/boards` | Lista todos os boards |
| `GET` | `/api/boards/:id` | Detalhe de um board |
| `GET` | `/api/boards/:id/configuration` | Colunas e mapeamento de status |
| `GET` | `/api/boards/:id/tasks` | Tasks do board (filtros opcionais) |
| `GET` | `/api/boards/:id/members` | Membros do board |

### Query params para listagem de tasks

| Param | Tipo | Descricao |
|-------|------|-----------|
| `status` | `string` | Filtrar por status (`pending`, `in_progress`, `done`) |
| `assignee` | `string` | Filtrar por responsável (busca parcial) |
| `query` | `string` | Busca em titulo e descricao |
| `startAt` | `number` | Offset para paginacao (default: `0`) |
| `maxResults` | `number` | Limite de resultados (default: `50`, max: `100`) |

---

## Tasks

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `POST` | `/api/tasks` | Criar task |
| `GET` | `/api/tasks/:id` | Detalhe da task |
| `PUT` | `/api/tasks/:id` | Atualizar titulo, descricao ou responsável |
| `PUT` | `/api/tasks/:id/move` | Mover entre colunas |
| `DELETE` | `/api/tasks/:id` | Remover task |

---

## Exemplos

### Criar task

```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "boardId": 1,
    "title": "Implementar login",
    "description": "Adicionar autenticacao com JWT",
    "assignee": "Ana Silva"
  }'
```

### Listar tasks filtradas por status

```bash
curl "http://localhost:3001/api/boards/1/tasks?status=pending"
```

### Atualizar task

```bash
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar login com OAuth",
    "assignee": "Carlos Souza"
  }'
```

### Mover task para outra coluna

```bash
curl -X PUT http://localhost:3001/api/tasks/1/move \
  -H "Content-Type: application/json" \
  -d '{
    "columnId": 2,
    "targetIndex": 0,
    "status": "in_progress"
  }'
```

### Deletar task

```bash
curl -X DELETE http://localhost:3001/api/tasks/1
```
