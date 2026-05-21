// models/Tarefa.js
const mongoose = require("mongoose");

const TarefaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String },
  status: {
    type: String,
    enum: ["BACKLOG", "TODO", "DOING", "DONE"],
    default: "BACKLOG"
  },
  data_criacao: {
    type: Date,
    default: Date.now
  },
  responsavel: { type: String },
  lista_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lista",
    required: true
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  }
});

module.exports = mongoose.model("Tarefa", TarefaSchema);