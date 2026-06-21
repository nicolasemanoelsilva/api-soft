const express = require("express");

const projetoController = require("../controllers/projetoController");
const { autenticar } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(autenticar);

router.get("/", projetoController.listarMeusProjetos);
router.post("/", projetoController.criarProjeto);
router.get("/:id", projetoController.buscarProjetoPorId);
router.post("/:id/membros", projetoController.adicionarMembro);
router.delete("/:id", projetoController.excluirProjeto);

module.exports = router;