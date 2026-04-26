# Processo de Desenvolvimento — ESM Forum

## Processo escolhido: Kanban

### Justificativa

Para o desenvolvimento das novas funcionalidades do ESM Forum, foi escolhido o **Kanban** em vez do Scrum. A decisão se baseia nas seguintes características do projeto:

**1. Escopo bem delimitado e sem interdependências críticas entre funcionalidades**

As cinco funcionalidades solicitadas (votação, busca, tags, perfil de usuário e notificações) são razoavelmente independentes entre si. Não há uma sequência rígida em que uma deva obrigatoriamente ser concluída antes da outra começar. No Scrum, planejar sprints com metas fixas seria artificialmente burocrático nesse contexto.

**2. Equipe pequena (individual ou dupla)**

O Scrum foi projetado para equipes de 5–9 pessoas, com papéis específicos (Product Owner, Scrum Master, Developers). Em um projeto individual ou de dupla, manter cerimônias como Daily Scrum, Sprint Review e Sprint Retrospective formalizada gera overhead sem ganho proporcional. O Kanban é mais leve e adequado para times pequenos.

**3. Entrega contínua é mais valiosa que entrega por ciclos**

O projeto é educacional com prazo definido, mas sem necessidade de releases periódicas sincronizadas. O Kanban permite que cada funcionalidade seja entregue assim que pronta, sem aguardar o fim de um sprint.

**4. Flexibilidade para repriorização**

Caso o desenvolvimento de uma funcionalidade revele uma complexidade inesperada (por exemplo, notificações exigir um sistema de autenticação mais robusto), o Kanban permite reordenar o backlog imediatamente. No Scrum, isso só aconteceria no próximo Sprint Planning.

---

## Características do Kanban adotado

### Colunas do Board

| Coluna | Descrição |
|---|---|
| **Backlog** | Funcionalidades priorizadas aguardando desenvolvimento |
| **Em Progresso** | Funcionalidade em desenvolvimento ativo |
| **Em Revisão** | Código escrito, aguardando revisão/testes |
| **Concluído** | Funcionalidade entregue e testada |

### Limite de WIP (Work In Progress)

- **Em Progresso:** máximo 2 itens simultâneos
- **Em Revisão:** máximo 2 itens simultâneos

O limite de WIP é uma prática central do Kanban: evita que o desenvolvedor inicie muitas tarefas sem terminar nenhuma, o que aumentaria o tempo de ciclo e fragmentaria o foco.

### Fluxo de trabalho

1. Funcionalidades são criadas no **Backlog** já priorizadas (ver seção abaixo)
2. O desenvolvedor puxa o item de maior prioridade para **Em Progresso**
3. Após implementação e testes locais, o item vai para **Em Revisão**
4. Após revisão (self-review ou pair review), o item vai para **Concluído**

---

## Priorização das funcionalidades

A priorização considera: valor para o usuário, complexidade técnica e dependências implícitas.

| Prioridade | Funcionalidade | Justificativa |
|---|---|---|
| 1 | Busca de perguntas por palavra-chave | Alta utilidade imediata; implementação simples (query SQL com LIKE) |
| 2 | Categorização por tags | Organiza o conteúdo; base útil para filtros futuros |
| 3 | Sistema de votação (upvote/downvote) | Aumenta engajamento; requer nova coluna no banco |
| 4 | Perfil de usuário com histórico | Depende de usuários cadastrados; maior escopo |
| 5 | Notificação de novas respostas | Maior complexidade técnica (polling ou websockets); entregue por último |

---

## Comparação resumida: Kanban vs Scrum neste contexto

| Critério | Kanban | Scrum |
|---|---|---|
| Tamanho ideal de equipe | 1–4 pessoas | 5–9 pessoas |
| Cerimônias | Mínimas | Daily, Planning, Review, Retro |
| Entrega | Contínua | Por sprint (1–4 semanas) |
| Repriorização | A qualquer momento | No próximo Sprint Planning |
| Adequação a este projeto | **Alta** | Média |
