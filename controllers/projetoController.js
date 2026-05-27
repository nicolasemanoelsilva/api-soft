const Projeto = require("../models/Projeto");
const Tarefa = require("../models/Tarefa");

exports.listarProjetos = async (req, res) => {
  try {
    const projetos = await Projeto.find()
      .populate("membros.usuario", "nome email");

    res.json(projetos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar projetos" });
  }
};

exports.criarProjeto = async (req, res) => {
  try {
    const { titulo, descricao, usuarioId } = req.body;

    const projeto = await Projeto.create({
      titulo,
      descricao,
      membros: [
        {
          usuario: usuarioId,
          tipo: "admin"
        }
      ]
    });

    res.status(201).json(projeto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar projeto" });
  }
};

exports.buscarProjetoPorId = async (req, res) => {
  try {
    const projeto = await Projeto.findById(req.params.id)
      .populate("membros.usuario", "nome email");

    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    res.json(projeto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar projeto" });
  }
};

exports.atualizarProjeto = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;

    const projeto = await Projeto.findByIdAndUpdate(
      req.params.id,
      { titulo, descricao },
      { new: true }
    );

    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    res.json(projeto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar projeto" });
  }
};

exports.adicionarMembro = async (req, res) => {
  try {
    const { usuarioId, tipo } = req.body;

    const projeto = await Projeto.findById(req.params.id);

    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    const jaExiste = projeto.membros.find(
      (membro) => membro.usuario.toString() === usuarioId
    );

    if (jaExiste) {
      return res.status(400).json({ erro: "Usuário já está no projeto" });
    }

    projeto.membros.push({
      usuario: usuarioId,
      tipo: tipo || "membro"
    });

    await projeto.save();

    res.json(projeto);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao adicionar membro" });
  }
};

exports.excluirProjeto = async (req, res) => {
  try {
    const { usuarioId } = req.body;

    const projeto = await Projeto.findById(req.params.id);

    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrado" });
    }

    const membro = projeto.membros.find(
      (m) => m.usuario.toString() === usuarioId
    );

    if (!membro || membro.tipo !== "admin") {
      return res.status(403).json({
        erro: "Apenas administradores podem excluir este projeto"
      });
    }

    await Tarefa.deleteMany({ projeto: req.params.id });
    await Projeto.findByIdAndDelete(req.params.id);

    res.json({ mensagem: "Projeto excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir projeto" });
  }
};