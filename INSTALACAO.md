# Guia de Instalação — ESM Forum

## Pré-requisitos

| Ferramenta | Versão mínima | Como verificar |
|---|---|---|
| Node.js | 18.x | `node -v` |
| npm | 9.x | `npm -v` |
| Git | qualquer | `git --version` |

---

## 1. Backend (`esmforum`)

### 1.1 Fork e clone

1. Acesse [https://github.com/mtov/esmforum](https://github.com/mtov/esmforum)
2. Clique em **Fork** → **Create fork**
3. Clone o seu fork localmente:

```bash
git clone https://github.com/<seu-usuario>/esmforum.git
cd esmforum
```

### 1.2 Instalar dependências

```bash
npm install
```

### 1.3 Executar o servidor

```bash
node server.js
```

O backend ficará disponível em `http://localhost:5000`.

**Confirmação:** você deve ver no terminal:
```
ESM Forum rodando em 5000
```

### 1.4 Verificar endpoints

```bash
# Listar perguntas
curl http://localhost:5000/

# Criar pergunta
curl -X POST http://localhost:5000/perguntas \
  -H "Content-Type: application/json" \
  -d '{"pergunta": "O que é Engenharia de Software?"}'
```

---

## 2. Frontend (`esmforum-react`)

### 2.1 Fork e clone

1. Acesse o repositório do frontend (fork do repositório original)
2. Clique em **Fork** → **Create fork**
3. Clone o seu fork:

```bash
git clone https://github.com/<seu-usuario>/esmforum-react.git
cd esmforum-react
```

### 2.2 Instalar dependências

```bash
npm install
```

### 2.3 Executar o frontend

```bash
npm start
```

O frontend ficará disponível em `http://localhost:3000`.

> **Atenção:** o backend deve estar em execução antes de iniciar o frontend.

---

## 3. Executar os dois juntos

Abra dois terminais separados:

**Terminal 1 — Backend:**
```bash
cd esmforum
node server.js
```

**Terminal 2 — Frontend:**
```bash
cd esmforum-react
npm start
```

Acesse `http://localhost:3000` no navegador.

---

## 4. Rodar os testes do backend

```bash
cd esmforum
npm test
```

---

## Estrutura do projeto após instalação

```
.
├── esmforum/           # Backend Node.js + Express + SQLite
│   ├── server.js       # Entry point e definição das rotas
│   ├── modelo.js       # Camada de acesso a dados
│   ├── bd/             # Arquivo do banco SQLite
│   ├── testes/         # Testes automatizados (Jest)
│   └── package.json
└── esmforum-react/     # Frontend React
    ├── src/
    └── package.json
```

---

## Solução de problemas comuns

| Problema | Causa provável | Solução |
|---|---|---|
| `EADDRINUSE: port 5000` | Porta já em uso | Encerrar o processo que usa a porta: `npx kill-port 5000` |
| Frontend não carrega dados | Backend não está rodando | Iniciar `node server.js` primeiro |
| `Module not found` | Dependências não instaladas | Rodar `npm install` na pasta correta |
