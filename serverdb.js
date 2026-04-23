const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Usuario = require("./models/Usuario");
const Tarefa = require("./models/Tarefa");
const Projeto = require("./models/Projeto");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API de tarefas funcionando");
});



app.post("/register", async (req, res) => {
  try {
    const { login, senha, email } = req.body;

    const usuarioExistente = await Usuario.findOne({
      $or: [{ login }, { email }]
    });

    if (usuarioExistente) {
      return res.status(400).json({ erro: "Login ou email já cadastrado" });
    }

    const usuario = new Usuario({ login, senha, email });
    await usuario.save();

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      usuario
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { login, senha } = req.body;

    const usuario = await Usuario.findOne({ login, senha });

    if (!usuario) {
      return res.status(401).json({ erro: "Login ou senha inválidos" });
    }

    res.json({
      mensagem: "Login realizado com sucesso",
      usuario
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});




app.post("/tarefas", async (req, res) => {
  try {
    const { titulo, descricao, data_inicio, data_prazo, status, usuario_id } = req.body;

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const tarefa = new Tarefa({
      titulo,
      descricao,
      data_inicio,
      data_prazo,
      status,
      usuario_id
    });

    await tarefa.save();

    res.status(201).json({
      mensagem: "Tarefa criada com sucesso",
      tarefa
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.get("/tarefas", async (req, res) => {
  try {
    const tarefas = await Tarefa.find().populate("usuario_id");
    res.json(tarefas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// buscar tarefa por id
app.get("/tarefas/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id).populate("usuario_id");

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json(tarefa);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.put("/tarefas/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json({
      mensagem: "Tarefa atualizada com sucesso",
      tarefa
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// deletar tarefa
app.delete("/tarefas/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findByIdAndDelete(req.params.id);

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json({ mensagem: "Tarefa removida com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.post("/projetos", async (req, res) => {
  try {
    const { titulo, usuario_id, tarefas } = req.body;

    const usuario = await Usuario.findById(usuario_id);
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const projeto = new Projeto({
      titulo,
      usuario_id,
      tarefas: tarefas || []
    });

    await projeto.save();

    res.status(201).json({
      mensagem: "Projeto criado com sucesso",
      projeto
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.get("/projetos", async (req, res) => {
  try {
    const projetos = await Projeto.find()
      .populate("usuario_id")
      .populate("tarefas");

    res.json(projetos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// buscar projeto por id
app.get("/projetos/:id", async (req, res) => {
  try {
    const projeto = await Projeto.findById(req.params.id)
      .populate("usuario_id")
      .populate("tarefas");

    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    res.json(projeto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.put("/projetos/:id/adicionar-tarefa", async (req, res) => {
  try {
    const { tarefa_id } = req.body;

    const projeto = await Projeto.findById(req.params.id);
    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    const tarefa = await Tarefa.findById(tarefa_id);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    projeto.tarefas.push(tarefa_id);
    await projeto.save();

    res.json({
      mensagem: "Tarefa adicionada ao projeto com sucesso",
      projeto
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});


app.delete("/projetos/:id", async (req, res) => {
  try {
    const projeto = await Projeto.findByIdAndDelete(req.params.id);

    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    res.json({ mensagem: "Projeto removido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando em http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar no MongoDB:", err.message);
  });