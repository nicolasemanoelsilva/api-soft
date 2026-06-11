const Tarefa = require("../models/Tarefa");
const Projeto = require("../models/Projeto");

async function verificarParticipacao(projetoId, usuarioId) {
  return Projeto.findOne({
    _id: projetoId,
    "membros.usuario": usuarioId,
  });
}

exports.listarTarefasPorProjeto = async (req, res) => {
  try {
    const { projetoId } = req.params;

    const projeto = await verificarParticipacao(projetoId, req.usuarioId);

    if (!projeto) {
      return res.status(403).json({
        erro: "Você não participa deste projeto",
      });
    }

    const tarefas = await Tarefa.find({
      projeto: projetoId,
    }).sort({ createdAt: 1 });

    return res.json(tarefas);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao listar tarefas",
    });
  }
};

exports.criarTarefa = async (req, res) => {
  try {
    const { projetoId } = req.params;
    const { titulo, descricao, pontos, dataInicio, dataPrazo, status } =
      req.body;

    const projeto = await verificarParticipacao(projetoId, req.usuarioId);

    if (!projeto) {
      return res.status(403).json({
        erro: "Você não participa deste projeto",
      });
    }

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({
        erro: "Informe o título da tarefa",
      });
    }

    const tarefa = await Tarefa.create({
      titulo: titulo.trim(),
      descricao: descricao || "",
      pontos: Number(pontos) || 0,
      dataInicio: dataInicio || "",
      dataPrazo: dataPrazo || "",
      status: status || "Backlog",
      projeto: projetoId,
    });

    return res.status(201).json(tarefa);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao criar tarefa",
    });
  }
};

exports.atualizarTarefa = async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id);

    if (!tarefa) {
      return res.status(404).json({
        erro: "Tarefa não encontrada",
      });
    }

    const projeto = await verificarParticipacao(
      tarefa.projeto,
      req.usuarioId,
    );

    if (!projeto) {
      return res.status(403).json({
        erro: "Você não participa deste projeto",
      });
    }

    const camposPermitidos = [
      "titulo",
      "descricao",
      "pontos",
      "dataInicio",
      "dataPrazo",
      "status",
    ];

    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        tarefa[campo] = req.body[campo];
      }
    });

    await tarefa.save();

    return res.json(tarefa);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao atualizar tarefa",
    });
  }
};

exports.excluirTarefa = async (req, res) => {
  try {
    const tarefa = await Tarefa.findById(req.params.id);

    if (!tarefa) {
      return res.status(404).json({
        erro: "Tarefa não encontrada",
      });
    }

    const projeto = await verificarParticipacao(
      tarefa.projeto,
      req.usuarioId,
    );

    if (!projeto) {
      return res.status(403).json({
        erro: "Você não participa deste projeto",
      });
    }

    await tarefa.deleteOne();

    return res.json({
      mensagem: "Tarefa excluída com sucesso",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao excluir tarefa",
    });
  }
};