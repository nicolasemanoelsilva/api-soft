const mongoose = require("mongoose");

const TarefaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String
  },
  data_inicio: {
    type: Date,
    default: Date.now
  },
  data_prazo: {
    type: Date
  },
  status: {
    type: String,
    enum: ["backlog", "todo", "doing", "complete"],
    default: "backlog"
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  }
});

module.exports = mongoose.model("Tarefa", TarefaSchema);