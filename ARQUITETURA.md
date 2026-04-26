# Análise Arquitetural — ESM Forum

## Identificação da Arquitetura

### Estilo arquitetural

O ESM Forum segue uma arquitetura em **camadas (Layered Architecture)** combinada com o estilo **Cliente-Servidor**:

- **Cliente:** aplicação React (`esmforum-react`) rodando no navegador do usuário
- **Servidor:** aplicação Node.js + Express (`esmforum`) expondo uma API REST

Dentro do servidor, há duas camadas bem definidas:

| Camada | Arquivo | Responsabilidade |
|---|---|---|
| Apresentação (API) | `server.js` | Recebe requisições HTTP, chama o modelo, retorna respostas JSON |
| Dados | `modelo.js` | Executa queries no banco SQLite, retorna dados brutos |

A camada de **lógica de negócio** é praticamente inexistente no sistema atual — o que é coerente com YAGNI dado o escopo mínimo do projeto.

### Comunicação Frontend ↔ Backend

O frontend (React) e o backend (Express) se comunicam via **HTTP REST**:

- Frontend faz chamadas `fetch()` para `http://localhost:5000`
- Backend retorna dados em formato **JSON**
- O backend configura **CORS** para aceitar requisições do frontend em `localhost:3000`

Não há autenticação, sessões ou WebSockets — toda comunicação é stateless.

### Endpoints atuais

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Lista todas as perguntas |
| POST | `/perguntas` | Cadastra nova pergunta |
| GET | `/respostas/:id` | Retorna pergunta + respostas |
| POST | `/respostas` | Cadastra nova resposta |

---

## Diagrama Arquitetural

Ver arquivo `diagrama_arquitetura.mmd`
