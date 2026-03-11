# Testes E2E

Playwright rodando contra o app real (API + banco + frontend).

## Como rodar

```bash
# API e Web precisam estar rodando (pnpm dev)
pnpm --filter @task-manager/web test:e2e
```

Se nenhum servidor tiver rodando, o Playwright starta o `pnpm dev` automaticamente.

Config: `apps/web/playwright.config.ts`
Spec: `apps/web/tests/e2e/kanban.spec.ts`

## O que cobre (35 testes)

**Board loading** — titulo, colunas, nomes, botoes de adicionar

**Criar task** — com titulo, com descricao, com responsavel, em cada coluna, validacao de campo vazio, contadores de caracteres, maxlength

**Editar task** — abrir painel, editar titulo, editar descricao, atribuir/remover responsavel

**Deletar** — remover card, botao aparece no hover

**Painel lateral** — fechar com cancelar, X, Escape, backdrop; verifica que desliza pela direita

**Drag and drop** — arrastar task entre colunas

**Card** — titulo, badge de status, chave KAN-X, contador da coluna atualiza ao criar/deletar

**CRUD completo** — criar com descricao → abrir e conferir → editar → conferir persistencia → deletar

**Multiplas tasks** — em colunas diferentes, na mesma coluna

## Helpers do spec

```typescript
waitForApi(page)          // poll ate API responder
loadBoard(page)           // goto / e espera board
createTask(page, col, title, opts?)  // preenche form e submete
findTaskCard(page, title) // acha card pelo titulo
deleteTask(page, title)   // hover + click excluir
```

## TestIDs usados

```
board-title              # h1 do header
kanban-board             # container do board
kanban-column-{key}      # todo, in-progress, done
add-task-button-{status} # pending, in_progress, done
task-card-{id}           # card individual
modal-task-title         # input titulo
modal-task-description   # textarea descricao
modal-task-assignee      # select responsavel
modal-submit-task        # botao submit
```

Cada teste limpa os dados que criou. Rodam sequencialmente pra nao ter conflito no banco.
