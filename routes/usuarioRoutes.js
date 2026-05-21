const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");

router.post("/", async (req, res) => {
  try {
    const usuario = new Usuario(req.body);

    await usuario.save();

    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find();

    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);

    res.json({ mensagem: "Usuário removido" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;