const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const projetoRoutes = require("./routes/projetoRoutes");
const tarefaRoutes = require("./routes/tarefaRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/projetos", projetoRoutes);
app.use("/tarefas", tarefaRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Servidor rodando em http://localhost:${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar no MongoDB:", err.message);
  });