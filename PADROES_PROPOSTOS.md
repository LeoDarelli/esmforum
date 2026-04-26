# Padrões de Projeto Propostos — ESM Forum

---

## Padrão 1: Strategy — Estratégias de Busca

### Justificativa e Contexto

**Funcionalidade:** Busca de perguntas por palavra-chave (com extensão para busca por tag e busca por data)

**Problema que resolve:** conforme novas formas de busca são adicionadas (por keyword, por tag, por período), o código de busca cresce com `if/else` ou `switch` difíceis de manter. Cada nova estratégia exige modificar o código existente.

**Por que Strategy é adequado:** o padrão Strategy define uma família de algoritmos intercambiáveis. Cada estratégia de busca é encapsulada em seu próprio módulo; o código cliente (rota) não precisa saber qual estratégia está usando.

### Proposta de Solução

Criar uma interface de estratégia de busca e implementações concretas para cada tipo:

- `BuscaPorKeyword` — filtra pelo texto da pergunta
- `BuscaPorTag` — filtra pela tag associada
- `BuscaSemFiltro` — retorna todas as perguntas (padrão)

O contexto (`ServicoBusca`) recebe a estratégia e a executa.

### Diagrama de Classes

Ver arquivo `padrao_strategy.mmd`

### Exemplo de Código

```javascript
// estrategias/BuscaPorKeyword.js
class BuscaPorKeyword {
    executar(modelo, parametros) {
        return modelo.buscar_perguntas(parametros.termo);
    }
}

// estrategias/BuscaPorTag.js
class BuscaPorTag {
    executar(modelo, parametros) {
        return modelo.buscar_perguntas_por_tag(parametros.tag);
    }
}

// estrategias/BuscaSemFiltro.js
class BuscaSemFiltro {
    executar(modelo, parametros) {
        return modelo.listar_perguntas();
    }
}

// servicos/ServicoBusca.js (contexto)
class ServicoBusca {
    constructor(estrategia) {
        this.estrategia = estrategia;
    }
    buscar(modelo, parametros) {
        return this.estrategia.executar(modelo, parametros);
    }
}

// server.js — rota usa o contexto sem conhecer a estratégia
app.get('/busca', (req, res) => {
    const termo = req.query.q;
    const tag = req.query.tag;

    let estrategia;
    if (termo) estrategia = new BuscaPorKeyword();
    else if (tag) estrategia = new BuscaPorTag();
    else estrategia = new BuscaSemFiltro();

    const servico = new ServicoBusca(estrategia);
    const resultado = servico.buscar(modelo, { termo, tag });
    res.json(resultado);
});
```

---

## Padrão 2: Observer — Notificação de Novas Respostas

### Justificativa e Contexto

**Funcionalidade:** Notificação de novas respostas às perguntas do usuário

**Problema que resolve:** quando uma resposta é cadastrada, o sistema precisa notificar o autor da pergunta. Sem o padrão Observer, a lógica de notificação ficaria misturada com a lógica de cadastro de respostas — violando o SRP.

**Por que Observer é adequado:** o padrão Observer define uma dependência de um-para-muitos entre objetos. Quando o objeto "sujeito" (cadastro de resposta) muda de estado, todos os "observadores" registrados (sistema de notificação) são notificados automaticamente. Isso desacopla quem produz o evento de quem reage a ele.

### Proposta de Solução

- `GerenciadorRespostas` (sujeito) — emite evento quando nova resposta é cadastrada
- `NotificadorUsuario` (observador) — reage ao evento e registra a notificação
- `LogAuditoria` (observador opcional) — reage ao mesmo evento para fins de log

### Diagrama de Classes

Ver arquivo `padrao_observer.mmd`

### Exemplo de Código

```javascript
// eventos/GerenciadorRespostas.js (sujeito)
class GerenciadorRespostas {
    constructor() {
        this.observadores = [];
    }
    registrar_observador(observador) {
        this.observadores.push(observador);
    }
    cadastrar_resposta(modelo, id_pergunta, texto) {
        const id_resposta = modelo.cadastrar_resposta(id_pergunta, texto);
        const pergunta = modelo.get_pergunta(id_pergunta);
        // notifica todos os observadores
        this.observadores.forEach(obs => obs.notificar({ id_pergunta, id_resposta, pergunta }));
        return id_resposta;
    }
}

// observadores/NotificadorUsuario.js
class NotificadorUsuario {
    notificar(evento) {
        // registra notificação no banco para o autor da pergunta
        console.log(`Notificando usuário ${evento.pergunta.id_usuario} sobre nova resposta`);
    }
}

// server.js — configuração dos observadores
const gerenciador = new GerenciadorRespostas();
gerenciador.registrar_observador(new NotificadorUsuario());

app.post('/respostas', (req, res) => {
    const id_resposta = gerenciador.cadastrar_resposta(
        modelo, req.body.id_pergunta, req.body.resposta
    );
    res.json({ id_resposta });
});
```

---

## Padrão 3: Factory — Criação de Perguntas com Validação

### Justificativa e Contexto

**Funcionalidade:** Criação de perguntas (com extensão para suporte a diferentes tipos: pergunta simples, pergunta com tags, pergunta com anexo)

**Problema que resolve:** a lógica de criação de uma pergunta pode variar conforme o tipo (com ou sem tags, com ou sem categorização). Sem o Factory, a rota precisaria conter `if/else` para decidir como criar cada tipo — acoplando a lógica de criação ao controller.

**Por que Factory é adequado:** o padrão Factory centraliza a lógica de criação de objetos. O cliente (rota) pede ao Factory para criar uma pergunta sem precisar saber qual classe concreta será usada. Isso facilita adicionar novos tipos de perguntas no futuro.

### Proposta de Solução

- `PerguntaFactory` — decide qual tipo de pergunta criar com base nos parâmetros recebidos
- `PerguntaSimples` — pergunta sem tags
- `PerguntaComTags` — pergunta com uma ou mais tags associadas

### Diagrama de Classes

Ver arquivo `padrao_factory.mmd`

### Exemplo de Código

```javascript
// modelos/PerguntaSimples.js
class PerguntaSimples {
    constructor(texto, id_usuario) {
        this.texto = texto;
        this.id_usuario = id_usuario;
        this.tags = [];
    }
    salvar(modelo) {
        return modelo.cadastrar_pergunta(this.texto);
    }
}

// modelos/PerguntaComTags.js
class PerguntaComTags {
    constructor(texto, id_usuario, tags) {
        this.texto = texto;
        this.id_usuario = id_usuario;
        this.tags = tags;
    }
    salvar(modelo) {
        const id = modelo.cadastrar_pergunta(this.texto);
        modelo.associar_tags(id, this.tags);
        return id;
    }
}

// factory/PerguntaFactory.js
class PerguntaFactory {
    static criar(dados) {
        if (dados.tags && dados.tags.length > 0) {
            return new PerguntaComTags(dados.texto, dados.id_usuario, dados.tags);
        }
        return new PerguntaSimples(dados.texto, dados.id_usuario);
    }
}

// server.js — rota não sabe qual tipo de pergunta está criando
app.post('/perguntas', (req, res) => {
    const pergunta = PerguntaFactory.criar(req.body);
    const id_pergunta = pergunta.salvar(modelo);
    res.json({ id_pergunta });
});
```
