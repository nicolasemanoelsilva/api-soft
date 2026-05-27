const Usuario = require("../models/Usuario");

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-senha");
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar usuários" });
  }
};

exports.criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });

    if (usuarioExiste) {
      return res.status(400).json({ erro: "E-mail já cadastrado" });
    }

    const usuario = await Usuario.create({
      nome,
      email,
      senha
    });

    res.status(201).json({
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar usuário" });
  }
};
exports.excluirUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json({ mensagem: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar usuário" });
  }
};