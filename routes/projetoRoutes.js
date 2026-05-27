const express = require("express");
const router = express.Router();

const projetoController = require("../controllers/projetoController");

router.get("/", projetoController.listarProjetos);
router.post("/", projetoController.criarProjeto);
router.get("/:id", projetoController.buscarProjetoPorId);
router.put("/:id", projetoController.atualizarProjeto);
router.post("/:id/membros", projetoController.adicionarMembro);
router.delete("/:id", projetoController.excluirProjeto);

module.exports = router;