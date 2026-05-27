const mongoose = require("mongoose");

const tarefaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descricao: String,
  status: {
    type: String,
    enum: ["backlog", "todo", "doing", "complete"],
    default: "backlog"
  },
  projeto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projeto",
    required: true
  }
});

module.exports = mongoose.model("Tarefa", tarefaSchema);