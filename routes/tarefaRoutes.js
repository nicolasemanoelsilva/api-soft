const express = require("express");

const tarefaController = require("../controllers/tarefaController");
const { autenticar } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(autenticar);

router.get(
  "/projeto/:projetoId",
  tarefaController.listarTarefasPorProjeto,
);

router.post(
  "/projeto/:projetoId",
  tarefaController.criarTarefa,
);

router.put("/:id", tarefaController.atualizarTarefa);

router.delete("/:id", tarefaController.excluirTarefa);

module.exports = router;