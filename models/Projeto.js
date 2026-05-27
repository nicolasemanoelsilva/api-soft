const mongoose = require("mongoose");

const membroSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  tipo: {
    type: String,
    enum: ["admin", "membro"],
    default: "membro"
  }
});

const projetoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descricao: String,
  membros: [membroSchema]
});

module.exports = mongoose.model("Projeto", projetoSchema);