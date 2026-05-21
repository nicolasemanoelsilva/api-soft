// models/Quadro.js
const mongoose = require("mongoose");

const QuadroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  }
});

module.exports = mongoose.model("Quadro", QuadroSchema);