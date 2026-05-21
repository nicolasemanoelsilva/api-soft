const express = require("express");
const router = express.Router();

const Lista = require("../models/Lista");

router.post("/", async (req, res) => {
  try {
    const lista = new Lista(req.body);

    await lista.save();

    res.status(201).json(lista);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const listas = await Lista.find().populate("quadro_id");

    res.json(listas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const lista = await Lista.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Lista.findByIdAndDelete(req.params.id);

    res.json({ mensagem: "Lista removida" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;