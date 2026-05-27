const express = require("express");
const router = express.Router();

const tarefaController = require("../controllers/tarefaController");

router.get("/", tarefaController.listarTarefas);
router.get("/projeto/:projetoId", tarefaController.listarTarefasPorProjeto);
router.post("/", tarefaController.criarTarefa);
router.put("/:id", tarefaController.atualizarTarefa);
router.delete("/:id", tarefaController.excluirTarefa);

module.exports = router;