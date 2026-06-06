const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projetoRoutes = require("./routes/projetoRoutes");
const tarefaRoutes = require("./routes/tarefaRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API DOMINK funcionando" });
});

app.use("/auth", authRoutes);
app.use("/projetos", projetoRoutes);
app.use("/tarefas", tarefaRoutes);
app.use("/usuarios", usuarioRoutes);

module.exports = app;