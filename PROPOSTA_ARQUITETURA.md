# Proposta de Organização Arquitetural — ESM Forum

---

## Proposta de Separação em Camadas

### Visão Geral

A proposta organiza o backend em três camadas bem definidas, cada uma com responsabilidade exclusiva:

```
Requisição HTTP
      ↓
┌─────────────────────────┐
│  Camada de Apresentação │  routes/
│  (API / Controllers)    │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Camada de Negócio      │  servicos/
│  (Services)             │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Camada de Dados        │  repositorios/
│  (Repositories)         │
└───────────┬─────────────┘
            ↓
         SQLite
```

---

### Camada de Apresentação — `routes/`

**Responsabilidades:**
- Receber requisições HTTP
- Extrair parâmetros do request (`req.body`, `req.params`, `req.query`)
- Chamar o serviço correspondente
- Retornar a resposta HTTP com status code adequado
- Tratar erros de HTTP (400, 404, 500)

**Não deve:** conter lógica de negócio, acessar o banco diretamente, validar regras de domínio.

**Módulos:**
- `routes/perguntas.js` — rotas GET / e POST /perguntas
- `routes/respostas.js` — rotas GET /respostas/:id e POST /respostas
- `routes/busca.js` — rota GET /busca

**Exemplo:**
```javascript
// routes/busca.js
const express = require('express');
const router = express.Router();
const ServicoBusca = require('../servicos/ServicoBusca');

router.get('/busca', (req, res) => {
    try {
        const resultado = ServicoBusca.buscar(req.query.q);
        res.json(resultado);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;
```

---

### Camada de Negócio — `servicos/`

**Responsabilidades:**
- Implementar regras de negócio (ex: validar se pergunta não está vazia, verificar se usuário já votou)
- Coordenar operações que envolvem múltiplas entidades
- Ser independente do protocolo HTTP (não conhece `req` ou `res`)

**Não deve:** acessar o banco diretamente, conhecer detalhes de HTTP.

**Módulos:**
- `servicos/ServicoPergunta.js` — lógica de criação e listagem de perguntas
- `servicos/ServicoResposta.js` — lógica de criação de respostas e notificações
- `servicos/ServicoBusca.js` — estratégias de busca
- `servicos/ServicoVoto.js` — lógica de upvote/downvote (validação de voto duplicado)

**Exemplo:**
```javascript
// servicos/ServicoVoto.js
const RepositorioVoto = require('../repositorios/RepositorioVoto');

function registrar_voto(id_pergunta, id_usuario, tipo) {
    const voto_existente = RepositorioVoto.buscar(id_pergunta, id_usuario);

    if (voto_existente && voto_existente.tipo === tipo) {
        RepositorioVoto.remover(voto_existente.id_voto); // cancela voto
        return { acao: 'cancelado' };
    }
    if (voto_existente) {
        RepositorioVoto.atualizar(voto_existente.id_voto, tipo); // troca voto
        return { acao: 'trocado' };
    }
    RepositorioVoto.criar(id_pergunta, id_usuario, tipo); // novo voto
    return { acao: 'registrado' };
}

module.exports = { registrar_voto };
```

---

### Camada de Dados — `repositorios/`

**Responsabilidades:**
- Executar queries SQL
- Mapear resultados do banco para objetos JavaScript
- Abstrair completamente o SQLite do resto da aplicação

**Não deve:** conter lógica de negócio, conhecer regras de validação.

**Módulos:**
- `repositorios/RepositorioPergunta.js`
- `repositorios/RepositorioResposta.js`
- `repositorios/RepositorioVoto.js`
- `repositorios/RepositorioTag.js`

**Exemplo:**
```javascript
// repositorios/RepositorioPergunta.js
const bd = require('../bd/bd_utils');

function listar() {
    return bd.prepare('SELECT * FROM perguntas').all();
}
function buscar_por_keyword(termo) {
    return bd.prepare('SELECT * FROM perguntas WHERE texto LIKE ?').all(`%${termo}%`);
}
function criar(texto) {
    const stmt = bd.prepare('INSERT INTO perguntas (texto) VALUES (?)');
    return stmt.run(texto).lastInsertRowid;
}

module.exports = { listar, buscar_por_keyword, criar };
```

---

## Proposta de Aplicação do Padrão MVC

### Estrutura MVC para o Backend

No contexto de uma API REST, o MVC é adaptado da seguinte forma:

| Componente | Equivalente REST | Responsabilidade |
|---|---|---|
| **Model** | `repositorios/` + `servicos/` | Dados e regras de negócio |
| **View** | Resposta JSON | Formato dos dados retornados ao cliente |
| **Controller** | `routes/` | Recebe requisição, aciona Model, retorna View |

### Aplicação para 2 funcionalidades

#### Funcionalidade 1: Busca de Perguntas

**Model (`RepositorioPergunta.buscar_por_keyword`):**
```javascript
function buscar_por_keyword(termo) {
    return bd.prepare('SELECT * FROM perguntas WHERE texto LIKE ?').all(`%${termo}%`);
}
```

**Controller (`routes/busca.js`):**
```javascript
router.get('/busca', (req, res) => {
    const resultado = ServicoBusca.buscar(req.query.q);
    res.json(resultado); // View: JSON formatado
});
```

**View (JSON retornado):**
```json
[
  { "id_pergunta": 1, "texto": "O que é Node.js?", "num_respostas": 3 }
]
```

---

#### Funcionalidade 2: Votação em Perguntas

**Model (`ServicoVoto.registrar_voto`):** contém toda a lógica de negócio (verificar voto duplicado, trocar, cancelar)

**Controller (`routes/votos.js`):**
```javascript
router.post('/votos', (req, res) => {
    const { id_pergunta, id_usuario, tipo } = req.body;
    const resultado = ServicoVoto.registrar_voto(id_pergunta, id_usuario, tipo);
    res.json(resultado); // View: JSON com ação realizada
});
```

**View (JSON retornado):**
```json
{ "acao": "registrado", "novo_total": 5 }
```

---

### Diagrama MVC Proposto

Ver arquivo `diagrama_mvc.mmd`

### Fluxo Completo: Busca de Perguntas

1. Usuário digita "Node.js" no campo de busca do React
2. React faz `GET /busca?q=Node.js`
3. **Controller** (`routes/busca.js`) extrai `q` do `req.query`
4. **Controller** chama `ServicoBusca.buscar("Node.js")`
5. **Service** decide a estratégia e chama `RepositorioPergunta.buscar_por_keyword("Node.js")`
6. **Model** executa `SELECT * FROM perguntas WHERE texto LIKE '%Node.js%'`
7. Banco retorna os registros
8. **Model** retorna array de objetos para o Service
9. **Controller** serializa como JSON (**View**) e retorna `200 OK`
10. React exibe os resultados para o usuário
