# Padrões de Projeto Existentes — ESM Forum

---

## 1. Module Pattern (Padrão de Módulo)

**Onde está:** `modelo.js`

**O que é:** o Module Pattern organiza código relacionado em uma unidade coesa, expondo apenas a interface pública e ocultando os detalhes de implementação.

```javascript
// modelo.js — expõe apenas funções públicas via module.exports
let bd = require('./bd/bd_utils.js');

function reconfig_bd(mock_bd) { bd = mock_bd; }
function listar_perguntas() { ... }
function cadastrar_pergunta(texto) { ... }

module.exports = {
    reconfig_bd,
    listar_perguntas,
    cadastrar_pergunta,
    cadastrar_resposta,
    get_pergunta,
    get_respostas,
    get_num_respostas
};
```

**Avaliação:** implementação completa. O módulo encapsula o acesso ao banco e expõe uma API clara. A variável `bd` é privada ao módulo e só pode ser substituída através de `reconfig_bd`.

---

## 2. Facade Pattern (Padrão de Fachada) — parcial

**Onde está:** `server.js` em relação ao `modelo.js`

**O que é:** o Facade fornece uma interface simplificada para um subsistema complexo. O cliente não precisa conhecer os detalhes internos.

```javascript
// server.js usa modelo.js como fachada para o banco de dados
app.get('/', (req, res) => {
    const perguntas = modelo.listar_perguntas(); // não sabe como o banco funciona
    res.send(perguntas);
});
```

**Avaliação:** implementação parcial. `modelo.js` age como fachada para o banco SQLite — as rotas não precisam conhecer queries SQL ou a estrutura do banco. Porém, o padrão seria mais completo se `modelo.js` também abstraísse detalhes como tratamento de erros do banco, que atualmente vaza para as rotas via try/catch.

---

## 3. Dependency Injection (Injeção de Dependência) — simplificado

**Onde está:** função `reconfig_bd` em `modelo.js`

**O que é:** em vez de criar suas próprias dependências, um módulo recebe a dependência de fora, tornando-o testável e desacoplado.

```javascript
// modelo.js
let bd = require('./bd/bd_utils.js'); // dependência padrão

function reconfig_bd(mock_bd) {
    bd = mock_bd; // permite injetar outra implementação
}
```

**Avaliação:** implementação simplificada mas funcional. Permite que os testes injetem um banco em memória sem alterar o código de produção. Não usa framework de injeção de dependência (como Inversify), mas resolve o problema de forma direta e adequada ao tamanho do projeto.
