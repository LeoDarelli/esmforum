# Pair Programming — Plano de Aplicação

## Contexto

Este documento descreve como a prática de Pair Programming do Extreme Programming seria aplicada no desenvolvimento das novas funcionalidades do ESM Forum. O projeto está sendo desenvolvido individualmente, portanto a seção abaixo descreve a estratégia que seria adotada em caso de trabalho em dupla — conforme orientação didática do enunciado.

---

## O que é Pair Programming

Pair Programming é uma prática XP em que dois desenvolvedores trabalham juntos em um único computador (ou sessão compartilhada). Um assume o papel de **driver** (escreve o código) e o outro de **navigator** (revisa em tempo real, pensa na direção geral, antecipa problemas). Os papéis se alternam regularmente.

**Benefícios comprovados:**
- Menos bugs introduzidos (o navigator funciona como revisão contínua)
- Compartilhamento de conhecimento entre os membros da dupla
- Decisões de design mais bem fundamentadas (duas perspectivas)
- Onboarding mais rápido em partes do código desconhecidas

---

## Estratégia para este projeto

### Ferramentas utilizadas

| Ferramenta | Uso |
|---|---|
| **VS Code Live Share** | Compartilhamento de editor em tempo real; permite que ambos vejam e editem o mesmo arquivo simultaneamente |
| **Discord** | Chamada de voz/vídeo durante a sessão; compartilhamento de tela como fallback |
| **GitHub** | Controle de versão; commits atribuídos a ambos via `Co-authored-by` |

### Configuração de sessão no VS Code Live Share

```
1. Instalar extensão "Live Share" no VS Code (ambos os membros)
2. Driver inicia sessão: Ctrl+Shift+P → "Live Share: Start Collaboration Session"
3. Compartilhar o link gerado com o navigator via Discord
4. Navigator entra na sessão e pode editar em tempo real
```

---

## Rotação de papéis (Driver / Navigator)

A rotação seria feita a cada **25–30 minutos** (técnica Pomodoro adaptada), garantindo que ambos os membros experimentem os dois papéis em cada sessão de trabalho.

### Esquema de rotação por funcionalidade

| Funcionalidade | Sessão 1 (Driver → Navigator) | Sessão 2 (Driver → Navigator) |
|---|---|---|
| Busca por palavra-chave | Membro A → Membro B | Membro B → Membro A |
| Categorização por tags | Membro B → Membro A | Membro A → Membro B |
| Sistema de votação | Membro A → Membro B | Membro B → Membro A |
| Perfil de usuário | Membro B → Membro A | Membro A → Membro B |
| Notificações | Membro A → Membro B | Membro B → Membro A |

### Responsabilidades por papel

**Driver:**
- Digita o código
- Explica em voz alta o que está fazendo
- Implementa a solução imediata
- Escreve os testes unitários

**Navigator:**
- Revisa o código sendo escrito em tempo real
- Pensa nos casos de borda e possíveis bugs
- Consulta documentação quando necessário
- Questiona decisões de design ("por que não usar X aqui?")
- Anota itens para refatoração futura

---

## Quando aplicar Pair Programming

Nem todo momento de desenvolvimento justifica pair programming. A estratégia seria:

| Situação | Usar PP? | Justificativa |
|---|---|---|
| Implementar nova funcionalidade | **Sim** | Alto valor: decisões de design, prevenção de bugs |
| Escrever testes | **Sim** | Navigator garante cobertura de casos de borda |
| Configuração de ambiente | Não | Tarefa mecânica; individual é mais eficiente |
| Debugging complexo | **Sim** | Dois pares de olhos acham o problema mais rápido |
| Ajustes de CSS/estilo | Não | Tarefa visual e individual; não se beneficia de PP |
| Code review assíncrono | Não | PP síncrono substituiria; escolher um ou outro |

---

## Adaptações para o contexto remoto/educacional

Como o projeto é desenvolvido a distância:

1. **Sessões agendadas:** combinadas com antecedência via Discord (ex: terças e quintas, 19h–21h)
2. **Duração máxima de sessão:** 2 horas com pausa de 10 minutos no meio
3. **Registro de decisões:** ao final de cada sessão, o navigator documenta no commit message ou em comentário no card do GitHub Projects as principais decisões de design tomadas
4. **Assincronicidade quando necessário:** se um membro precisar trabalhar fora do horário combinado, commita com mensagem clara para o parceiro revisar na próxima sessão — funcionando como um "pair programming assíncrono"

---

## Exemplo de fluxo para a funcionalidade de Busca

```
19:00 — Início da sessão (Membro A = Driver, Membro B = Navigator)
19:00 - 19:25 — Driver implementa o endpoint GET /busca?q=:termo no server.js
                 Navigator revisa query SQL e sugere uso de índice full-text
19:25 — Troca de papéis
19:25 - 19:50 — Driver (B) escreve testes para o endpoint de busca
                 Navigator (A) revisa cobertura dos casos: termo vazio, 
                 termo sem resultados, case sensitivity
19:50 — Pausa (10 min)
20:00 — Troca de papéis novamente para implementar o frontend da busca
...
```
