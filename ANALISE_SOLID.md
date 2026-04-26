# Análise SOLID — ESM Forum

Os princípios SOLID são cinco diretrizes de design de software orientado a objetos que tornam o código mais legível, extensível e fácil de manter.

---

## Pontos Positivos (onde o código segue SOLID)

### 1. SRP — Single Responsibility Principle (modelo.js)

O arquivo `modelo.js` tem uma única responsabilidade: **acesso aos dados**. Ele não faz roteamento, não formata respostas HTTP, não valida entradas — apenas executa operações no banco de dados.

```javascript
// modelo.js — responsabilidade única: dados
function listar_perguntas() { ... }
function cadastrar_pergunta(texto) { ... }
function cadastrar_resposta(id_pergunta, texto) { ... }
function get_pergunta(id_pergunta) { ... }
function get_respostas(id_pergunta) { ... }
```

**Por que respeita SRP:** se a estrutura do banco mudar, só `modelo.js` precisa ser alterado. As rotas em `server.js` não precisam saber como os dados são armazenados.

---

### 2. DIP — Dependency Inversion Principle (reconfig_bd)

A função `reconfig_bd(mock_bd)` permite substituir a dependência do banco de dados por um objeto mock durante os testes, sem alterar nenhuma outra parte do código.

```javascript
// modelo.js
let bd = require('./bd/bd_utils.js');

function reconfig_bd(mock_bd) {
    bd = mock_bd;
}
```

**Por que respeita DIP:** os módulos de alto nível (testes, futuras integrações) não dependem diretamente da implementação concreta do banco (`bd_utils.js`). Eles podem injetar qualquer objeto que implemente a mesma interface, seguindo o princípio de inversão de dependência.

---

### 3. SRP — Single Responsibility Principle (server.js — rotas)

Cada handler de rota em `server.js` tem uma responsabilidade bem delimitada: receber a requisição, chamar o modelo e retornar a resposta. Nenhum handler mistura lógica de banco com lógica de roteamento.

```javascript
// server.js — handler com responsabilidade única
app.post('/perguntas', (req, res) => {
    try {
        const id_pergunta = modelo.cadastrar_pergunta(req.body.pergunta);
        res.json({id_pergunta: id_pergunta});
    }
    catch(erro) {
        res.status(500).json(erro.message);
    }
});
```

**Por que respeita SRP:** o handler não acessa o banco diretamente, não valida regras de negócio complexas e não formata dados além do necessário. Cada parte do sistema faz apenas o que lhe compete.

---

## Oportunidades de Melhoria (onde o código viola SOLID)

### 1. SRP — server.js acumula responsabilidades demais

O arquivo `server.js` é responsável por: configurar o servidor Express, definir o middleware de CORS, declarar todas as rotas e iniciar o servidor na porta 5000. Isso são quatro responsabilidades distintas em um único arquivo.

```javascript
// server.js — múltiplas responsabilidades misturadas
const app = express()
app.use(express.json());

// Responsabilidade 1: configuração de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    ...
});

// Responsabilidade 2: rota de perguntas
app.get('/', ...);
app.post('/perguntas', ...);

// Responsabilidade 3: rota de respostas
app.get('/respostas/:id_pergunta', ...);
app.post('/respostas', ...);

// Responsabilidade 4: inicialização do servidor
app.listen(port, 'localhost', ...);
```

**Como melhorar:** separar em arquivos distintos — `routes/perguntas.js`, `routes/respostas.js`, `config/cors.js` e manter `server.js` apenas como ponto de entrada que monta as peças:

```javascript
// server.js melhorado — responsabilidade única: montar o servidor
const express = require('express');
const corsConfig = require('./config/cors');
const rotasPerguntas = require('./routes/perguntas');
const rotasRespostas = require('./routes/respostas');

const app = express();
app.use(express.json());
app.use(corsConfig);
app.use(rotasPerguntas);
app.use(rotasRespostas);

app.listen(5000, 'localhost', () => console.log('ESM Forum rodando em 5000'));
```

---

### 2. OCP — Open/Closed Principle (modelo.js não é extensível)

O `modelo.js` não respeita o OCP porque, para adicionar uma nova forma de buscar perguntas (ex: busca por tag, busca por data, busca por palavra-chave), é necessário **modificar** o arquivo existente em vez de **estendê-lo**.

```javascript
// Para adicionar busca, precisamos modificar modelo.js diretamente
function listar_perguntas() { ... }        // existente
function buscar_por_keyword(termo) { ... } // força modificação do arquivo
function buscar_por_tag(tag) { ... }       // força outra modificação
```

**Como melhorar:** criar um módulo separado de buscas (`servicos/busca.js`) que recebe o modelo como dependência e centraliza as estratégias de busca, permitindo adicionar novas sem alterar o código existente:

```javascript
// servicos/busca.js — extensão sem modificação
function executar_busca(modelo, termo) {
    if (!termo || termo.trim() === '') {
        return modelo.listar_perguntas();
    }
    return modelo.buscar_perguntas(termo.trim());
}

module.exports = { executar_busca };
```

Com essa abordagem, novas estratégias de busca são adicionadas neste módulo sem tocar em `modelo.js` ou `server.js`.
