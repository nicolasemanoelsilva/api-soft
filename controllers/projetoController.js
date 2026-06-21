const Projeto = require("../models/Projeto");
const Usuario = require("../models/Usuario");
const Tarefa = require("../models/Tarefa");

// Criar projeto: usuário logado vira admin automaticamente
exports.criarProjeto = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({
        erro: "Informe o título do projeto",
      });
    }

    const projeto = await Projeto.create({
      titulo: titulo.trim(),
      descricao: descricao || "",
      membros: [
        {
          usuario: req.usuarioId,
          tipo: "admin",
        },
      ],
    });

    const projetoCriado = await Projeto.findById(projeto._id).populate(
      "membros.usuario",
      "nome email",
    );

    return res.status(201).json(projetoCriado);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao criar projeto",
    });
  }
};

// Listar apenas projetos dos quais o usuário logado participa
exports.listarMeusProjetos = async (req, res) => {
  try {
    const projetos = await Projeto.find({
      "membros.usuario": req.usuarioId,
    }).populate("membros.usuario", "nome email");

    return res.json(projetos);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao listar projetos",
    });
  }
};
// excluir projeto: somente admin do projeto pode excluir, e ao excluir o projeto, todas as tarefas relacionadas a ele também devem ser excluídas
exports.excluirProjeto = async (req, res) => {
  try {
    const projeto = await Projeto.findById(req.params.id);

    if (!projeto) {
      return res.status(404).json({
        erro: "Projeto não encontrado",
      });
    }

    const usuarioNoProjeto = projeto.membros.find(
      (membro) => membro.usuario.toString() === req.usuarioId
    );

    if (!usuarioNoProjeto || usuarioNoProjeto.tipo !== "admin") {
      return res.status(403).json({
        erro: "Apenas administradores podem excluir projetos",
      });
    }

    await Tarefa.deleteMany({
      projeto: projeto._id,
    });

    await projeto.deleteOne();

    return res.json({
      mensagem: "Projeto excluído com sucesso",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao excluir projeto",
    });
  }
};

// Buscar um projeto específico somente se usuário participar dele
exports.buscarProjetoPorId = async (req, res) => {
  try {
    const projeto = await Projeto.findOne({
      _id: req.params.id,
      "membros.usuario": req.usuarioId,
    }).populate("membros.usuario", "nome email");

    if (!projeto) {
      return res.status(404).json({
        erro: "Projeto não encontrado ou acesso negado",
      });
    }

    return res.json(projeto);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao buscar projeto",
    });
  }
};

// Adicionar membro por email: somente admin do projeto pode fazer isso
exports.adicionarMembro = async (req, res) => {
  try {
    const { email, tipo } = req.body;

    if (!email) {
      return res.status(400).json({
        erro: "Informe o email do usuário",
      });
    }

    const projeto = await Projeto.findById(req.params.id);

    if (!projeto) {
      return res.status(404).json({
        erro: "Projeto não encontrado",
      });
    }

    const usuarioLogadoNoProjeto = projeto.membros.find(
      (membro) => membro.usuario.toString() === req.usuarioId,
    );

    if (
      !usuarioLogadoNoProjeto ||
      usuarioLogadoNoProjeto.tipo !== "admin"
    ) {
      return res.status(403).json({
        erro: "Apenas administradores podem adicionar membros",
      });
    }

    const usuarioConvidado = await Usuario.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!usuarioConvidado) {
      return res.status(404).json({
        erro: "Usuário não encontrado. Ele precisa criar uma conta primeiro.",
      });
    }

    const usuarioJaParticipa = projeto.membros.some(
      (membro) =>
        membro.usuario.toString() === usuarioConvidado._id.toString(),
    );

    if (usuarioJaParticipa) {
      return res.status(400).json({
        erro: "Este usuário já participa do projeto",
      });
    }

    projeto.membros.push({
      usuario: usuarioConvidado._id,
      tipo: tipo === "admin" ? "admin" : "membro",
    });

    await projeto.save();

    const projetoAtualizado = await Projeto.findById(projeto._id).populate(
      "membros.usuario",
      "nome email",
    );

    return res.json(projetoAtualizado);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao adicionar membro",
    });
  }
};