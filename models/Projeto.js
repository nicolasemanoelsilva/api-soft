const mongoose = require("mongoose");

const ProjetoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  tarefas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tarefa"
    }
  ]
});

module.exports = mongoose.model("Projeto", ProjetoSchema);