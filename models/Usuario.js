// models/Usuario.js
const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  tipo_usuario: {
    type: String,
    enum: ["CLIENTE", "ADMINISTRADOR"],
    default: "CLIENTE"
  }
});

module.exports = mongoose.model("Usuario", UsuarioSchema);