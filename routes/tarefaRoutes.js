const express = require("express");
const router = express.Router();

const Tarefa = require("../models/Tarefa");

router.post("/", async (req, res) => {
  try {
    const tarefa = new Tarefa(req.body);

    await tarefa.save();

    res.status(201).json(tarefa);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const tarefas = await Tarefa.find()
      .populate("usuario_id")
      .populate("lista_id");

    res.json(tarefas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const tarefa = await Tarefa.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(tarefa);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Tarefa.findByIdAndDelete(req.params.id);

    res.json({ mensagem: "Tarefa removida" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;