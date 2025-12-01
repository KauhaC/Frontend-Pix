# 🟧 **Sistema PIX -- Fullstack**

Um sistema completo simulando operações PIX com backend em **Node.js +
PostgreSQL** e frontend em **Next.js + TypeScript**, incluindo
autenticação, transferências, chaves PIX, extrato paginado e testes E2E
com Cypress.

------------------------------------------------------------------------

## 🧑‍💻 **Autores**

-   **Kauhã de Costa**
-   **Matheus Rembold**

------------------------------------------------------------------------

# 🟧 Tecnologias Utilizadas

## 🔹 **Backend (Node.js + TypeScript)**

-   Node.js\
-   TypeScript\
-   Express\
-   TypeORM\
-   PostgreSQL\
-   CORS\
-   JWT Authentication\
-   Zod *(validações opcionais)*

## 🔸 **Frontend (Next.js + TypeScript)**

-   Next.js 14 (App Router)\
-   React\
-   TypeScript\
-   Axios\
-   Zod\
-   TailwindCSS\
-   ContextAPI\
-   Hooks e componentes funcionais

## 🧪 **Testes E2E**

-   Cypress\
-   Interceptação de requisições\
-   Fluxo completo automatizado:\
    **Login → Transferência PIX → Extrato Paginado**

------------------------------------------------------------------------

# 🟧 Como Rodar o Projeto

# 🗄️ **BACKEND**

## 1️⃣ Instale as dependências

``` bash
npm install
```

## 2️⃣ Configure o Banco PostgreSQL

Crie o banco:

    pix_db

Configure o `.env`:

    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASS=sua_senha
    DB_NAME=pix_db

## 3️⃣ Rode o backend

``` bash
npm run dev
```

📡 **Backend rodando em:**\
http://localhost:4000

------------------------------------------------------------------------

# 💻 **FRONTEND**

## 4️⃣ Instale as dependências

``` bash
cd front
npm install
```

## 5️⃣ Configure acesso ao backend

Arquivo `.env.local`:

    NEXT_PUBLIC_API_URL=http://localhost:4000

## 6️⃣ Rode o frontend

``` bash
npm run dev
```

🌐 **Frontend rodando em:**\
http://localhost:3000

------------------------------------------------------------------------

# 🧪 **Rodando os Testes (Cypress)**

## 7️⃣ Instale o Cypress

``` bash
npm install cypress --save-dev
```

## 8️⃣ Abra o Cypress

``` bash
npx cypress open
```

Selecione o teste:

    cypress/e2e/fluxo_pix.cy.ts

Ou rode no terminal:

``` bash
npx cypress run
```

------------------------------------------------------------------------

# 🔍 Fluxo Testado (E2E)

-   ✔ Login com usuário válido\
-   ✔ Iniciar transferência PIX\
-   ✔ Validar modal de confirmação\
-   ✔ Enviar PIX\
-   ✔ Conferir extrato com paginação\
-   ✔ Validar transação no histórico

Atende exatamente o PDF do professor.

------------------------------------------------------------------------

# 📦 Estrutura Geral do Projeto

    /back
      /src
        controllers
        services
        entities
        routes
        middlewares

    /front
      /app
      /components
      /contexts
      /hooks
      /services
      /utils

    cypress/

------------------------------------------------------------------------

# 🟧 **Obrigado por conferir o projeto!**

Feito com dedicação para demonstrar um sistema PIX realista, seguro e
escalável.
