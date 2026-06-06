const jwt = require("jsonwebtoken");

exports.autenticar = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        erro: "Token não informado",
      });
    }

    const partes = authorization.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
      return res.status(401).json({
        erro: "Token inválido",
      });
    }

    const token = partes[1];

    const dadosToken = jwt.verify(token, process.env.JWT_SECRET);

    req.usuarioId = dadosToken.id;

    next();
  } catch (error) {
    return res.status(401).json({
      erro: "Token inválido ou expirado",
    });
  }
};