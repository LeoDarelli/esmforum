# Implementação com SOLID — Busca de Perguntas por Palavra-chave

## Funcionalidade Implementada

**Busca de perguntas por palavra-chave** — o usuário pode digitar um termo e o sistema retorna apenas as perguntas cujo texto contém aquele termo. Se o campo estiver vazio, retorna todas as perguntas.

**Endpoint adicionado:** `GET /busca?q=termo`

---

## Arquivos modificados/criados

| Arquivo | Tipo | Descrição |
|---|---|---|
| `modelo.js` | Modificado | Adicionada função `buscar_perguntas(termo)` |
| `servicos/busca.js` | Novo | Lógica de negócio da busca (SRP + OCP) |
| `server.js` | Modificado | Adicionada rota `GET /busca` |

---

## Aplicação dos Princípios SOLID

### SRP — Single Responsibility Principle

A lógica de negócio da busca (o que fazer quando o termo está vazio, como tratar espaços em branco) foi isolada no módulo `servicos/busca.js`. A rota em `server.js` apenas recebe a requisição e delega. O `modelo.js` apenas executa a query.

```javascript
// servicos/busca.js — responsabilidade única: lógica de busca
function executar_busca(modelo, termo) {
    if (!termo || termo.trim() === '') {
        return modelo.listar_perguntas();
    }
    return modelo.buscar_perguntas(termo.trim());
}
module.exports = { executar_busca };
```

```javascript
// server.js — responsabilidade única da rota: HTTP
app.get('/busca', (req, res) => {
    try {
        const termo = req.query.q || '';
        const resultado = busca.executar_busca(modelo, termo);
        res.json(resultado);
    } catch(erro) {
        res.status(500).json(erro.message);
    }
});
```

### DIP — Dependency Inversion Principle

O módulo `servicos/busca.js` não importa diretamente `modelo.js` — ele **recebe o modelo como parâmetro**. Isso significa que qualquer objeto que implemente as funções `listar_perguntas()` e `buscar_perguntas()` pode ser usado, inclusive um mock nos testes.

```javascript
// servicos/busca.js — depende de abstração, não de implementação concreta
function executar_busca(modelo, termo) { // modelo é injetado
    ...
}
```

### OCP — Open/Closed Principle

O módulo `servicos/busca.js` permite que novas estratégias de busca sejam adicionadas **sem modificar** o código existente. Para adicionar busca por tag, basta adicionar uma nova função no serviço, sem tocar na rota ou no modelo atual.

```javascript
// servicos/busca.js — aberto para extensão
function executar_busca(modelo, termo) { ... }          // existente
function executar_busca_por_tag(modelo, tag) { ... }   // nova, sem modificar a anterior

module.exports = { executar_busca, executar_busca_por_tag };
```

---

## Trechos de código principais

### modelo.js — função adicionada

```javascript
function buscar_perguntas(termo) {
    const stmt = bd.prepare(
        "SELECT id_pergunta, texto, num_respostas FROM perguntas WHERE texto LIKE ?"
    );
    return stmt.all(`%${termo}%`);
}
```

### servicos/busca.js — módulo de serviço (novo)

```javascript
function executar_busca(modelo, termo) {
    if (!termo || termo.trim() === '') {
        return modelo.listar_perguntas();
    }
    return modelo.buscar_perguntas(termo.trim());
}

module.exports = { executar_busca };
```

### server.js — rota adicionada

```javascript
const busca = require('./servicos/busca');

app.get('/busca', (req, res) => {
    try {
        const termo = req.query.q || '';
        const resultado = busca.executar_busca(modelo, termo);
        res.json(resultado);
    } catch(erro) {
        res.status(500).json(erro.message);
    }
});
```

---

## Como testar

Com o servidor rodando (`node server.js`), abra o navegador ou use o terminal:

```bash
# Buscar perguntas com "Node"
curl http://localhost:5000/busca?q=Node

# Busca vazia — retorna todas as perguntas
curl http://localhost:5000/busca?q=

# Busca sem parâmetro — retorna todas as perguntas
curl http://localhost:5000/busca
```
