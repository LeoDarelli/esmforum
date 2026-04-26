# Design Simples — Análise do ESM Forum

## Princípio YAGNI (You Aren't Gonna Need It)

YAGNI orienta que o desenvolvedor só deve implementar o que é necessário agora, evitando código especulativo para necessidades futuras hipotéticas. Design simples também abrange: ausência de duplicação (DRY), código legível e a menor quantidade de código que passa em todos os testes.

---

## Análise do código existente

### Arquivo: `server.js` (rotas)

```javascript
app.get('/', (req, res) => {
  try {
    const perguntas = modelo.listar_perguntas();
    res.send(perguntas);
  }
  catch(erro) {
    res.status(500).json(erro.message); 
  }
});

app.post('/perguntas', (req, res) => {
  try {
    const id_pergunta = modelo.cadastrar_pergunta(req.body.pergunta);
    res.json({id_pergunta: id_pergunta});
  }
  catch(erro) {
    res.status(500).json(erro.message); 
  } 
});

app.get('/respostas/:id_pergunta', (req, res) => {
  const id_pergunta = req.params.id_pergunta;
  const pergunta = modelo.get_pergunta(id_pergunta);
  const respostas = modelo.get_respostas(id_pergunta);
  try {
    res.json({ pergunta: pergunta, respostas: respostas });
  }
  catch(erro) {
    res.status(500).json(erro.message); 
  } 
});

app.post('/respostas', (req, res) => {
  try {
    const id_pergunta = req.body.id_pergunta;
    const resposta = req.body.resposta;
    const id_resposta = modelo.cadastrar_resposta(id_pergunta, resposta);
    res.json({id_resposta: id_resposta});
  }
  catch(erro) {
    res.status(500).json(erro.message); 
  } 
});
```

### Arquivo: `modelo.js` (acesso a dados)

Funções exportadas:
- `reconfig_bd(mock_bd)` — substitui o banco para testes
- `listar_perguntas()` — retorna todas as perguntas com contagem de respostas
- `cadastrar_pergunta(texto)` — insere pergunta e retorna o ID
- `cadastrar_resposta(id_pergunta, texto)` — insere resposta e retorna o ID
- `get_pergunta(id_pergunta)` — retorna uma pergunta pelo ID
- `get_respostas(id_pergunta)` — retorna respostas de uma pergunta
- `get_num_respostas(id_pergunta)` — conta respostas de uma pergunta

---

## Aspectos que seguem Design Simples / YAGNI

### 1. Ausência de camadas desnecessárias

O sistema usa apenas duas camadas: **rotas** (`server.js`) e **modelo** (`modelo.js`). Não há controllers separados, services, repositórios, DTOs, ou outros padrões de arquitetura enterprise que seriam desnecessários dado o tamanho do sistema.

**Por que é YAGNI:** adicionar uma camada `service` entre rotas e modelo só faria sentido se houvesse lógica de negócio complexa a isolar. Aqui, a lógica se resume a operações CRUD diretas.

### 2. Sem autenticação especulativa

O sistema não possui sistema de login, JWT, sessions ou middleware de autenticação — mesmo que num fórum real isso seja esperado. O código só entrega o que o sistema atual precisa: perguntas e respostas públicas.

**Por que é YAGNI:** implementar autenticação antes de ela ser solicitada pelo cliente aumentaria a complexidade sem entregar valor imediato.

### 3. API mínima e coesa

Apenas 4 endpoints foram implementados — exatamente o necessário para as user stories existentes:

| Endpoint | Propósito |
|---|---|
| `GET /` | Listar perguntas |
| `POST /perguntas` | Criar pergunta |
| `GET /respostas/:id` | Ver pergunta + respostas |
| `POST /respostas` | Criar resposta |

Não há endpoints para edição (`PUT`), remoção (`DELETE`) ou paginação — porque não foram pedidos.

### 4. `reconfig_bd()` — testabilidade sem complexidade

A função `reconfig_bd(mock_bd)` em `modelo.js` permite injetar um banco de dados falso nos testes. É uma solução simples de injeção de dependência sem frameworks como inversify ou tsyringe.

**Por que é design simples:** entrega testabilidade com uma única função de 3 linhas.

### 5. Separação clara entre modelo e rotas

A separação `server.js` / `modelo.js` segue a lógica de separar "o que fazer" (modelo) de "como expor" (rotas), sem introduzir complexidade desnecessária de padrões como MVC completo.

---

## Oportunidades de simplificação identificadas

### 1. Duplicação no tratamento de erros

O bloco `try/catch` com `res.status(500).json(erro.message)` se repete em todos os 4 handlers. Isso viola DRY (Don't Repeat Yourself), que é um aspecto do design simples.

**Situação atual (repetido 4 vezes):**
```javascript
catch(erro) {
  res.status(500).json(erro.message); 
}
```

**Versão simplificada com middleware de erro do Express:**
```javascript
// Handlers passam o erro adiante
app.get('/', (req, res, next) => {
  try {
    const perguntas = modelo.listar_perguntas();
    res.send(perguntas);
  } catch(erro) {
    next(erro);
  }
});

// Um único handler de erro centralizado
app.use((erro, req, res, next) => {
  res.status(500).json(erro.message);
});
```

Isso reduz a repetição sem adicionar complexidade — é, portanto, uma simplificação genuína e não uma abstração especulativa.

### 2. `get_num_respostas` potencialmente redundante

A função `get_num_respostas(id_pergunta)` em `modelo.js` retorna a contagem de respostas de uma pergunta. Porém, `listar_perguntas()` já retorna o campo `num_respostas` calculado no SQL. Se `get_num_respostas` não for usada diretamente por nenhuma rota, ela representa código sem uso aparente — o que contradiz YAGNI.

**Observação:** pode ser necessária internamente ou nos testes. Antes de remover, verificar todos os pontos de uso.

---

## Conclusão

O código do ESM Forum demonstra consistentemente o princípio de design simples: faz exatamente o que é necessário, sem infraestrutura especulativa. A principal oportunidade de melhoria é eliminar a duplicação no tratamento de erros, o que tornaria o código mais simples ainda — não mais complexo.
