const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

router.get("/", usuarioController.listarUsuarios);
router.post("/", usuarioController.criarUsuario);
router.delete("/:id", usuarioController.excluirUsuario);
module.exports = router;