# DOMINK API

API desenvolvida para o sistema **DOMINK**, uma aplicação de gerenciamento de projetos e tarefas em estilo Kanban.

O objetivo da API é permitir que usuários possam se cadastrar, fazer login, criar projetos, adicionar membros e gerenciar tarefas dentro de cada projeto.

## Tecnologias utilizadas

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* JSON Web Token
* bcryptjs
* dotenv
* cors
* Jest
* Supertest
* Autocannon

## Funcionalidades

* Cadastro de usuários
* Login com autenticação JWT
* Criptografia de senha com bcrypt
* Criação de projetos
* Listagem de projetos do usuário autenticado
* Adição de membros em projetos
* Controle de tipo de membro por projeto
* Criação de tarefas dentro de projetos
* Listagem de tarefas
* Edição de tarefas
* Movimentação de tarefas entre colunas do Kanban
* Exclusão de tarefas
* Exclusão de projetos
* Testes funcionais
* Teste de performance

## Regras principais do sistema

* O usuário precisa estar autenticado para acessar projetos e tarefas.
* O token JWT deve ser enviado no header das requisições protegidas.
* O criador do projeto é cadastrado automaticamente como administrador do projeto.
* Um usuário pode ser administrador em um projeto e membro comum em outro.
* O tipo de usuário é vinculado ao projeto, não à conta.
* Apenas administradores podem excluir projetos.
* Apenas administradores podem excluir tarefas.
* As tarefas seguem o fluxo Kanban.

Status possíveis das tarefas:

```txt
Backlog
To-Do
Doing
Done
```

Tipos possíveis de membros no projeto:

```txt
admin
membro
```

## Estrutura do projeto

```txt
API-SOFT/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── projetoController.js
│   ├── tarefaController.js
│   └── usuarioController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   ├── Projeto.js
│   ├── Tarefa.js
│   └── Usuario.js
├── routes/
│   ├── authRoutes.js
│   ├── projetoRoutes.js
│   ├── tarefaRoutes.js
│   └── usuarioRoutes.js
├── tests/
│   ├── funcional/
│   │   └── domink.test.js
│   └── performance/
│       └── performance.js
├── .env
├── .env.test
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Instalação

Clone o repositório:

```bash
git clone https://github.com/nicolasemanoelsilva/api-soft.git
```

Entre na pasta do projeto:

```bash
cd api-soft
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MONGO_URI=sua_string_de_conexao_do_mongodb
JWT_SECRET=sua_chave_secreta
```

Também existe um arquivo `.env.test`, utilizado para rodar os testes em um ambiente separado.

Exemplo:

```env
PORT=3000
MONGO_URI=sua_string_de_conexao_do_mongodb_de_teste
JWT_SECRET=sua_chave_secreta_de_teste
```

## Executando a API

Para iniciar o servidor:

```bash
npm start
```

Caso exista script de desenvolvimento com Nodemon:

```bash
npm run dev
```

A API será executada em:

```txt
http://localhost:3000
```

## Arquivos principais

### `server.js`

Arquivo responsável por iniciar o servidor da API.

### `app.js`

Arquivo responsável por configurar o Express, middlewares e rotas principais da aplicação.

### `config/db.js`

Arquivo responsável pela conexão com o banco de dados MongoDB.

### `middlewares/authMiddleware.js`

Middleware utilizado para proteger rotas privadas. Ele verifica o token JWT enviado no header da requisição.

## Autenticação

As rotas protegidas precisam receber o token JWT no header:

```txt
Authorization: Bearer SEU_TOKEN
```

Exemplo:

```txt
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

## Rotas de autenticação

### Registrar usuário

```http
POST /auth/registrar
```

Exemplo de body:

```json
{
  "nome": "Jubileu",
  "email": "jubileu@email.com",
  "senha": "123456"
}
```

Resposta esperada:

```json
{
  "_id": "id_do_usuario",
  "nome": "Jubileu",
  "email": "jubileu@email.com"
}
```

### Login

```http
POST /auth/login
```

Exemplo de body:

```json
{
  "email": "jubileu@email.com",
  "senha": "123456"
}
```

Resposta esperada:

```json
{
  "token": "token_jwt",
  "usuario": {
    "_id": "id_do_usuario",
    "nome": "Jubileu",
    "email": "jubileu@email.com"
  }
}
```

## Rotas de usuários

As rotas de usuários ficam no arquivo:

```txt
routes/usuarioRoutes.js
```

Elas são controladas por:

```txt
controllers/usuarioController.js
```

Essas rotas são usadas para operações relacionadas aos usuários cadastrados no sistema.

## Rotas de projetos

### Listar projetos do usuário

```http
GET /projetos
```

Header obrigatório:

```txt
Authorization: Bearer SEU_TOKEN
```

### Criar projeto

```http
POST /projetos
```

Header obrigatório:

```txt
Authorization: Bearer SEU_TOKEN
```

Exemplo de body:

```json
{
  "titulo": "Projeto DOMINK",
  "descricao": "Projeto de gerenciamento de tarefas"
}
```

Ao criar um projeto, o usuário autenticado é adicionado automaticamente como administrador.

### Adicionar membro ao projeto

```http
POST /projetos/:id/membros
```

Header obrigatório:

```txt
Authorization: Bearer SEU_TOKEN
```

Exemplo de body:

```json
{
  "email": "membro@email.com",
  "tipo": "membro"
}
```

Tipos possíveis:

```txt
admin
membro
```

### Excluir projeto

```http
DELETE /projetos/:id
```

Header obrigatório:

```txt
Authorization: Bearer SEU_TOKEN
```

Apenas administradores do projeto podem excluir o projeto.

## Rotas de tarefas

### Listar tarefas de um projeto

```http
GET /tarefas/projeto/:projetoId
```

Header obrigatório:

```txt
Authorization: Bearer SEU_TOKEN
```

### Criar tarefa em um projeto

```http
POST /tarefas/projeto/:projetoId
```

Header obrigatório:

```txt
Authorization: Bearer SEU_TOKEN
```

Exemplo de body:

```json
{
  "titulo": "Criar tela de login",
  "descricao": "Desenvolver a tela de login do sistema",
  "pontos": 5,
  "dataInicio": "2026-06-20",
  "dataPrazo": "2026-06-25",
  "status": "Backlog"
}
```

### Editar tarefa

```http
PUT /tarefas/:id
```

Header obrigatório:

```txt
Authorization: Bearer SEU_TOKEN
```

Exemplo de body para editar descrição:

```json
{
  "descricao": "Descrição atualizada da tarefa"
}
```

Exemplo de body para mover tarefa:

```json
{
  "status": "Doing"
}
```

### Excluir tarefa

```http
DELETE /tarefas/:id
```

Header obrigatório:

```txt
Authorization: Bearer SEU_TOKEN
```

Apenas administradores do projeto podem excluir tarefas.

## Banco de dados

O banco utilizado é o **MongoDB Atlas**.

Principais coleções:

```txt
usuarios
projetos
tarefas
```

### Usuário

Armazena os dados de acesso do usuário.

Campos principais:

```txt
nome
email
senha
```

A senha é armazenada criptografada com bcrypt.

### Projeto

Armazena os projetos criados pelos usuários.

Campos principais:

```txt
titulo
descricao
membros
```

Cada projeto possui uma lista de membros.

Cada membro possui:

```txt
usuario
tipo
```

O campo `tipo` define se o usuário é administrador ou membro comum naquele projeto.

### Tarefa

Armazena as tarefas pertencentes aos projetos.

Campos principais:

```txt
titulo
descricao
pontos
dataInicio
dataPrazo
status
projeto
```

O campo `projeto` liga a tarefa ao projeto correspondente.

## Testes funcionais

Os testes funcionais ficam em:

```txt
tests/funcional/domink.test.js
```

Eles utilizam:

* Jest
* Supertest
* dotenv-cli

Os testes simulam o fluxo principal da API:

* Cadastro de usuário administrador
* Cadastro de usuário membro
* Login
* Teste de senha incorreta
* Criação de projeto
* Adição de membro ao projeto
* Criação de tarefa
* Listagem de tarefas
* Edição de tarefa
* Movimentação da tarefa no Kanban
* Exclusão de tarefa

Para executar os testes:

```bash
npm test
```

Os testes utilizam o ambiente configurado no arquivo:

```txt
.env.test
```

## Teste de performance

O teste de performance fica em:

```txt
tests/performance/performance.js
```

Ele utiliza o Autocannon para simular múltiplas requisições à API.

Exemplo de execução:

```bash
node tests/performance/performance.js
```

Também é possível executar manualmente com:

```bash
npx autocannon -c 10 -d 10 http://localhost:3000/auth/login
```

Esse teste simula múltiplas conexões acessando uma rota da API por determinado período.

## Segurança

A API utiliza:

* Hash de senha com bcryptjs
* Token JWT para autenticação
* Middleware de autenticação em rotas protegidas
* Controle de permissão por projeto

## Observações

Este projeto foi desenvolvido com finalidade acadêmica.