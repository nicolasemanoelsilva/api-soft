const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../../app");

const Usuario = require("../../models/Usuario");
const Projeto = require("../../models/Projeto");
const Tarefa = require("../../models/Tarefa");

describe("Testes funcionais automatizados - DOMINK", () => {
  let tokenAdmin;
  let tokenMembro;
  let projetoId;
  let tarefaId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    await Usuario.deleteMany({});
    await Projeto.deleteMany({});
    await Tarefa.deleteMany({});
  });

  afterAll(async () => {
    await Usuario.deleteMany({});
    await Projeto.deleteMany({});
    await Tarefa.deleteMany({});

    await mongoose.connection.close();
  });

  test("Deve registrar um usuário administrador", async () => {
    const resposta = await request(app)
      .post("/auth/registrar")
      .send({
        nome: "Admin Teste",
        email: "admin@teste.com",
        senha: "123456",
      });

    expect(resposta.statusCode).toBe(201);
    expect(resposta.body.usuario).toBeDefined();
    expect(resposta.body.usuario.email).toBe("admin@teste.com");
  });

  test("Deve registrar um usuário membro", async () => {
    const resposta = await request(app)
      .post("/auth/registrar")
      .send({
        nome: "Membro Teste",
        email: "membro@teste.com",
        senha: "123456",
      });

    expect(resposta.statusCode).toBe(201);
    expect(resposta.body.usuario).toBeDefined();
    expect(resposta.body.usuario.email).toBe("membro@teste.com");
  });

  test("Deve fazer login do administrador", async () => {
    const resposta = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@teste.com",
        senha: "123456",
      });

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.token).toBeDefined();

    tokenAdmin = resposta.body.token;
  });

  test("Deve fazer login do membro", async () => {
    const resposta = await request(app)
      .post("/auth/login")
      .send({
        email: "membro@teste.com",
        senha: "123456",
      });

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.token).toBeDefined();

    tokenMembro = resposta.body.token;
  });

  test("Deve impedir login com senha errada", async () => {
    const resposta = await request(app)
      .post("/auth/login")
      .send({
        email: "admin@teste.com",
        senha: "senhaerrada",
      });

    expect(resposta.statusCode).toBe(401);
    expect(resposta.body.erro).toBeDefined();
  });

  test("Deve criar projeto e tornar criador administrador", async () => {
    const resposta = await request(app)
      .post("/projetos")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        titulo: "Projeto Teste Automatizado",
        descricao: "Projeto criado durante teste funcional",
      });

    expect(resposta.statusCode).toBe(201);
    expect(resposta.body._id).toBeDefined();
    expect(resposta.body.titulo).toBe("Projeto Teste Automatizado");
    expect(resposta.body.membros).toHaveLength(1);
    expect(resposta.body.membros[0].tipo).toBe("admin");

    projetoId = resposta.body._id;
  });

  test("Deve adicionar membro ao projeto", async () => {
    const resposta = await request(app)
      .post(`/projetos/${projetoId}/membros`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        email: "membro@teste.com",
        tipo: "membro",
      });

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.membros).toHaveLength(2);
  });

  test("Membro deve visualizar projeto em que foi adicionado", async () => {
    const resposta = await request(app)
      .get("/projetos")
      .set("Authorization", `Bearer ${tokenMembro}`);

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.length).toBeGreaterThan(0);
    expect(resposta.body[0]._id).toBe(projetoId);
  });

  test("Deve criar tarefa dentro do projeto", async () => {
    const resposta = await request(app)
      .post(`/tarefas/projeto/${projetoId}`)
      .set("Authorization", `Bearer ${tokenMembro}`)
      .send({
        titulo: "Criar teste automatizado",
        descricao: "Validar fluxo de tarefa",
        pontos: 5,
        dataInicio: "01/06/2026",
        dataPrazo: "05/06/2026",
        status: "Backlog",
      });

    expect(resposta.statusCode).toBe(201);
    expect(resposta.body._id).toBeDefined();
    expect(resposta.body.titulo).toBe("Criar teste automatizado");
    expect(resposta.body.status).toBe("Backlog");

    tarefaId = resposta.body._id;
  });

  test("Deve listar tarefas do projeto", async () => {
    const resposta = await request(app)
      .get(`/tarefas/projeto/${projetoId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body).toHaveLength(1);
    expect(resposta.body[0]._id).toBe(tarefaId);
  });

  test("Deve mover tarefa para Doing", async () => {
    const resposta = await request(app)
      .put(`/tarefas/${tarefaId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        status: "Doing",
      });

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.status).toBe("Doing");
  });

  test("Deve concluir tarefa", async () => {
    const resposta = await request(app)
      .put(`/tarefas/${tarefaId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({
        status: "Done",
      });

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.status).toBe("Done");
  });

  test("Deve excluir tarefa", async () => {
    const resposta = await request(app)
      .delete(`/tarefas/${tarefaId}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body.mensagem).toBeDefined();
  });
});