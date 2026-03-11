# Decisoes Tecnicas

---

## Ports & Adapters no backend

Os services dependem de **interfaces (ports)** e nao de implementacoes concretas. Isso permite:

- Trocar o banco de dados sem alterar logica de negocio
- Testes unitarios com mocks dos repositories (sem banco real)
- Fronteira clara entre dominio e infraestrutura

## Modelo de boards

A separacao `board → configuration → tasks` adiciona um nivel de indirecao. Para o escopo do teste e mais do que necessario, mas demonstra modelagem extensivel — suportaria multiplos boards, configuracoes de colunas diferentes e workflows customizados sem refatoracao.

## Kanban ao inves de lista simples

Uma lista com filtro atenderia os requisitos. O kanban adiciona drag-and-drop e visualizacao por colunas, mostrando capacidade de implementar interacoes mais ricas mantendo o codigo organizado.

## Schemas compartilhados (Zod)

O pacote `@task-manager/shared` contem os schemas de validacao usados tanto no backend (validacao de input) quanto no frontend (tipos TypeScript). Garante **consistencia entre as camadas** sem duplicacao.

## Status fixos no card

Os status das tasks sao fixos: **A Fazer**, **Em Progresso** e **Terminado**. Sao independentes do nome da coluna — cada coluna mapeia para um status, mas o nome pode ser editado livremente.

## Optimistic updates

Mutations de move e update usam optimistic updates com snapshot/rollback. O usuario ve a mudanca instantaneamente enquanto o request acontece em background. Em caso de erro, o estado anterior e restaurado automaticamente.

---

## Trade-offs

| Decisao | Beneficio | Custo |
|---------|-----------|-------|
| Modelo board/configuration/tasks | Modelagem extensivel, demonstra capacidade | Complexidade extra para um CRUD simples |
| Optimistic updates | UX instantanea, sem loading | Complexidade no gerenciamento de cache |
| Ports & Adapters | Testabilidade, desacoplamento | Mais arquivos e indirecao |
| Kanban com drag-and-drop | UX rica e visual | Mais complexo que uma lista com filtros |
| Feature folder unica | Organizacao clara | Pode parecer over-engineering para 1 feature |
| DI container manual | Zero dependencias, controle total | Composicao manual no boot |
