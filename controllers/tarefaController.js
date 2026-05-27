const Tarefa = require("../models/Tarefa");

exports.listarTarefas = async (req, res) => {
  try {
    const tarefas = await Tarefa.find().populate("projeto");
    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar tarefas" });
  }
};

exports.listarTarefasPorProjeto = async (req, res) => {
  try {
    const tarefas = await Tarefa.find({
      projeto: req.params.projetoId
    });

    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar tarefas do projeto" });
  }
};

exports.criarTarefa = async (req, res) => {
  try {
    const { titulo, descricao, status, projetoId } = req.body;

    const tarefa = await Tarefa.create({
      titulo,
      descricao,
      status: status || "backlog",
      projeto: projetoId
    });

    res.status(201).json(tarefa);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar tarefa" });
  }
};

exports.atualizarTarefa = async (req, res) => {
  try {
    const tarefa = await Tarefa.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json(tarefa);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
};

exports.excluirTarefa = async (req, res) => {
  try {
    const tarefa = await Tarefa.findByIdAndDelete(req.params.id);

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json({ mensagem: "Tarefa excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir tarefa" });
  }
};