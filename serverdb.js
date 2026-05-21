const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const usuarioRoutes = require("./routes/usuarioRoutes");
const quadroRoutes = require("./routes/quadroRoutes");
const listaRoutes = require("./routes/listaRoutes");
const tarefaRoutes = require("./routes/tarefaRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.use("/usuarios", usuarioRoutes);
app.use("/quadros", quadroRoutes);
app.use("/listas", listaRoutes);
app.use("/tarefas", tarefaRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado");

    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Servidor rodando em http://localhost:${process.env.PORT || 3000}`
      );
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar no MongoDB:", err.message);
  });