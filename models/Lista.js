// models/Lista.js
const mongoose = require("mongoose");

const ListaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  quadro_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quadro",
    required: true
  }
});

module.exports = mongoose.model("Lista", ListaSchema);