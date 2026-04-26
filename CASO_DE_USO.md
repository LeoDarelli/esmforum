# Caso de Uso: Buscar Perguntas por Palavra-chave

**Atores:** Usuário (visitante do fórum)

**Pré-condições:**
- O sistema está em execução (backend rodando na porta 5000)
- A página principal do fórum está carregada no navegador

---

## Fluxo Principal

1. O sistema exibe a página principal com a lista de perguntas e um campo de busca
2. O usuário digita uma palavra-chave no campo de busca
3. O usuário confirma a busca (pressiona Enter ou clica no botão Buscar)
4. O frontend envia a requisição `GET /busca?q=palavra-chave` para a API
5. A API consulta o banco de dados buscando perguntas cujo texto contenha a palavra-chave
6. O banco retorna a lista de perguntas correspondentes
7. A API retorna a lista em formato JSON para o frontend
8. O frontend exibe os resultados encontrados com ID, texto e número de respostas de cada pergunta

---

## Fluxo Alternativo 1: Nenhuma pergunta encontrada

- **5a.** O banco não encontra perguntas com a palavra-chave informada
- **5b.** A API retorna uma lista vazia
- **5c.** O frontend exibe a mensagem: "Nenhuma pergunta encontrada para sua busca"
- **5d.** O usuário pode limpar o campo e fazer uma nova busca

---

## Fluxo Alternativo 2: Campo de busca vazio

- **3a.** O usuário confirma a busca sem digitar nada no campo
- **3b.** O frontend envia `GET /busca?q=` (parâmetro vazio)
- **3c.** A API interpreta como ausência de filtro e retorna todas as perguntas
- **3d.** O sistema exibe a listagem completa (comportamento idêntico à página inicial)

---

## Fluxo Alternativo 3: Erro de comunicação com o servidor

- **4a.** O frontend tenta enviar a requisição mas o backend não está disponível
- **4b.** O frontend exibe a mensagem: "Erro ao conectar com o servidor. Tente novamente."
- **4c.** O usuário pode tentar novamente após o servidor ser restaurado

---

## Pós-condições

- A lista de perguntas exibida contém apenas as perguntas cujo texto inclui a palavra-chave buscada
- O estado do banco de dados não é alterado (operação somente de leitura)
- O campo de busca mantém o texto digitado pelo usuário para facilitar edição
