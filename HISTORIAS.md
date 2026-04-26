# Histórias de Usuário — ESM Forum

## Priorização

As 3 histórias foram ordenadas da seguinte forma:

| Prioridade | Funcionalidade | Justificativa |
|---|---|---|
| 1 | Busca de perguntas por palavra-chave | Maior valor imediato para o usuário; implementação mais simples (uma query SQL); não depende de outras funcionalidades |
| 2 | Sistema de votação (upvote/downvote) | Alto impacto no engajamento; complexidade média (nova tabela de votos); independente das tags |
| 3 | Categorização por tags | Útil para organização, mas depende de volume de perguntas para fazer diferença; maior esforço de implementação |

---

## História 1: Busca de Perguntas por Palavra-chave

**Como** usuário do fórum,
**Eu quero** buscar perguntas por palavra-chave,
**Para** encontrar rapidamente discussões relevantes sem precisar rolar toda a lista de perguntas.

**Critérios de Aceitação:**
- [ ] O sistema deve exibir um campo de busca na página principal
- [ ] A busca deve retornar perguntas cujo texto contenha a palavra-chave informada (sem distinção de maiúsculas/minúsculas)
- [ ] Os resultados devem exibir o ID, o texto da pergunta e o número de respostas
- [ ] Caso nenhuma pergunta seja encontrada, o sistema deve exibir a mensagem "Nenhuma pergunta encontrada para sua busca"
- [ ] A busca com campo vazio deve retornar todas as perguntas (comportamento padrão da listagem)

---

## História 2: Sistema de Votação em Perguntas (Upvote/Downvote)

**Como** usuário do fórum,
**Eu quero** votar em perguntas (upvote ou downvote),
**Para** destacar as perguntas mais úteis e relevantes para a comunidade.

**Critérios de Aceitação:**
- [ ] Cada pergunta deve exibir botões de upvote (+1) e downvote (-1) com o contador de votos atual
- [ ] O contador de votos deve ser atualizado imediatamente após o voto
- [ ] Um usuário não pode votar mais de uma vez na mesma pergunta com o mesmo tipo de voto
- [ ] Um usuário pode trocar seu voto (de upvote para downvote ou vice-versa); nesse caso o voto anterior é substituído
- [ ] Um usuário pode cancelar seu voto clicando novamente no mesmo botão que já votou

---

## História 3: Categorização de Perguntas por Tags

**Como** usuário do fórum,
**Eu quero** adicionar tags às perguntas (ex: tecnologia, carreira, dúvidas-gerais),
**Para** organizar o conteúdo por tema e facilitar a navegação por assunto.

**Critérios de Aceitação:**
- [ ] Ao criar uma pergunta, o usuário deve poder selecionar uma ou mais tags de uma lista pré-definida
- [ ] As tags associadas a uma pergunta devem ser exibidas junto ao texto da pergunta
- [ ] O sistema deve permitir filtrar a lista de perguntas por tag
- [ ] As tags disponíveis inicialmente são: tecnologia, carreira, dúvidas-gerais, outros
- [ ] Uma pergunta pode ter no máximo 3 tags
