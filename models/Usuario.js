const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("Usuario", UsuarioSchema);