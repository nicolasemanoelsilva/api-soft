const express = require("express");
const router = express.Router();

const Quadro = require("../models/Quadro");

router.post("/", async (req, res) => {
  try {
    const quadro = new Quadro(req.body);

    await quadro.save();

    res.status(201).json(quadro);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const quadros = await Quadro.find().populate("usuario_id");

    res.json(quadros);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const quadro = await Quadro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(quadro);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Quadro.findByIdAndDelete(req.params.id);

    res.json({ mensagem: "Quadro removido" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;