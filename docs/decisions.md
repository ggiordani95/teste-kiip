# Decisoes tecnicas

## Por que Ports & Adapters?

Queria que os services fossem testaveis sem banco. Com interfaces nos ports, os testes unitarios usam mocks simples e rodam rapido. Tambem deixa facil trocar o banco se precisar — so implementa outro adapter.

## Por que um modelo de boards?

O teste pede um gerenciador de tarefas. Poderia ser so uma tabela de tasks com CRUD direto, mas achei que o modelo `board → columns → tasks` mostra melhor como eu penso modelagem. Suportaria multiplos boards e configuracoes de coluna sem mudar nada.

Sei que pra esse escopo e mais do que precisa. Mas preferi mostrar que sei fazer do que entregar o minimo.

## Por que kanban e nao uma lista?

Uma lista com filtro resolvia. Mas o kanban com drag-and-drop e uma interface que eu ja quis fazer direito, e achei que mostrava mais skill de frontend — lidar com estado otimista, reordenacao, animacoes. O codigo fica mais complexo, mas bem organizado.

## Zustand + use() ao inves de React Query

Comecei com TanStack Query mas decidi simplificar. O Zustand segura o estado do servidor, o `use()` do React 19 cuida do loading com Suspense, e as mutations fazem update otimista direto no store. Menos uma dependencia e menos abstracao.

## Schemas compartilhados

O pacote shared tem os schemas Zod usados nos dois lados. O backend valida input, o frontend infere tipos. Se eu mudo um campo, muda nos dois.

## Optimistic updates

Move e update atualizam a UI antes da resposta do servidor. Se der erro, volta pro estado anterior (snapshot/rollback). A UX fica instantanea.

## DI manual

Sem framework de DI, sem decorators, sem reflection. Um arquivo `container.ts` que instancia tudo na ordem certa. Mais verboso, mas zero magia.

## Trade-offs

| Decisao | O que ganho | O que pago |
|---------|------------|------------|
| Modelo board/columns/tasks | Extensivel, mostra modelagem | Complexidade extra pro escopo |
| Optimistic updates | UX sem loading | Logica de cache mais chatinha |
| Ports & Adapters | Testes faceis, desacoplado | Mais arquivos |
| Kanban + drag-and-drop | Interface rica | Mais codigo que uma lista |
| DI manual | Sem dependencia, controle total | Composicao na mao |
