## Como rodar

# Pre-requisito: API e Web rodando (pnpm dev na raiz)
`pnpm --filter @task-manager/web test:e2e`

## Configuracao

| Config | Valor |
|--------|-------|
| Framework | Playwright 1.58 |
| Browser | Chromium |
| Base URL | `http://127.0.0.1:3000` |
| API URL | `http://127.0.0.1:3001` |
| Arquivo | `apps/web/tests/e2e/kanban.spec.ts` |
| Config | `apps/web/playwright.config.ts` |

---

## Cobertura (35 testes)

### Board loading (4 testes)

| Teste | O que valida |
|-------|-------------|
| displays board title | Titulo do board e visivel apos carregamento |
| renders all three columns | Colunas todo, in-progress e done existem |
| shows column names | Headers "A Fazer", "Em Progresso", "Concluido" |
| shows add card button in each column | Botao "Add a card" em cada coluna |

### Create task (10 testes)

| Teste | O que valida |
|-------|-------------|
| opens create panel from pending column | Painel lateral abre com titulo, descricao, assignee e botao submit |
| creates a task with title only | Task aparece na coluna correta apos criacao |
| creates a task with title and description | Descricao e persistida (verificada ao reabrir o painel de edicao) |
| creates a task with assignee | Avatar do membro aparece no card apos atribuicao |
| creates task in in_progress column | Task criada na coluna "Em Progresso" |
| creates task in done column | Task criada na coluna "Concluido" |
| submit button is disabled when title is empty | Validacao: botao desabilitado sem titulo |
| shows character counter for title | Contador "X/30" atualiza ao digitar |
| shows character counter for description | Contador "X/500" atualiza ao digitar |
| title maxlength is enforced at 30 chars | Input nao aceita mais de 30 caracteres |

### Edit task (5 testes)

| Teste | O que valida |
|-------|-------------|
| opens edit panel when clicking a task card | Painel abre com dados preenchidos e botao "Salvar" |
| edits task title | Titulo atualizado aparece no card, titulo antigo desaparece |
| edits task description | Descricao atualizada persiste ao reabrir painel |
| edits task assignee | Membro pode ser atribuido via edicao |
| removes task assignee | Membro pode ser removido selecionando "Sem responsavel" |

### Delete task (2 testes)

| Teste | O que valida |
|-------|-------------|
| deletes a task from the board | Card desaparece apos deletar |
| delete button appears on hover | Botao de excluir fica visivel ao passar o mouse |

### Side panel (5 testes)

| Teste | O que valida |
|-------|-------------|
| closes panel with cancel button | Botao "Cancelar" fecha o painel |
| closes panel with X button | Botao X no header fecha o painel |
| closes panel with Escape key | Tecla Escape fecha o painel |
| closes panel by clicking backdrop | Clicar no fundo escuro fecha o painel |
| panel slides in from the right | Painel esta posicionado no lado direito da tela |

### Drag and drop (1 teste)

| Teste | O que valida |
|-------|-------------|
| moves task between columns via drag and drop | Task pode ser arrastada entre colunas e permanece no board |

### Task card display (5 testes)

| Teste | O que valida |
|-------|-------------|
| shows task title on card | Titulo visivel no card |
| shows status badge on card | Badge de status (ex: "A Fazer") visivel |
| shows task key on card | Chave no formato KAN-{id} visivel |
| column task count updates after creating | Contador da coluna incrementa ao criar task |
| column task count updates after deleting | Contador da coluna decrementa ao deletar task |

### Full CRUD flow (1 teste)

| Teste | O que valida |
|-------|-------------|
| create, read, update, delete task end to end | Fluxo completo: criar com descricao → abrir e verificar campos → editar titulo e descricao → verificar persistencia → deletar |

### Multiple tasks (2 testes)

| Teste | O que valida |
|-------|-------------|
| creates multiple tasks in different columns | Tasks criadas em colunas diferentes aparecem cada uma na coluna correta |
| creates multiple tasks in same column | Multiplas tasks na mesma coluna coexistem |

---

## Helpers reutilizaveis

O arquivo de teste usa helpers que abstraem acoes comuns:

```typescript
waitForApi(page)          // Aguarda API responder (polling ate 20 tentativas)
loadBoard(page)           // Navega para / e espera board carregar
createTask(page, column, title, options?)  // Cria task via painel lateral
findTaskCard(page, title) // Localiza card pelo titulo
deleteTask(page, title)   // Hover + click no botao excluir
```

## Data-testid utilizados

| TestID | Componente | Uso |
|--------|-----------|-----|
| `board-title` | KanbanPage | Titulo do board no header |
| `kanban-board` | KanbanBoard | Container principal |
| `kanban-column-{key}` | KanbanColumn | Coluna (todo, in-progress, done) |
| `add-task-button-{status}` | KanbanColumn | Botao "Add a card" (pending, in_progress, done) |
| `task-card-{id}` | TaskCard | Card individual |
| `modal-task-title` | TaskFormPanel | Input do titulo |
| `modal-task-description` | TaskFormPanel | Textarea da descricao |
| `modal-task-assignee` | MemberSelect | Select de responsavel |
| `modal-submit-task` | TaskFormPanel | Botao de submit |

---

## Notas

- Cada teste cria e deleta seus proprios dados (cleanup automatico)
- Testes rodam sequencialmente (`fullyParallel: false`) para evitar conflitos no banco
- Drag-and-drop usa `dragTo()` do Playwright com a lib `@hello-pangea/dnd`
- Traces sao gravados no primeiro retry para debug de falhas
