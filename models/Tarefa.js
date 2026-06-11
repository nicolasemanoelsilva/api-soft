const mongoose = require("mongoose");

const tarefaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },

    descricao: {
      type: String,
      default: "",
    },

    pontos: {
      type: Number,
      default: 0,
    },

    dataInicio: {
      type: String,
      default: "",
    },

    dataPrazo: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Backlog", "To-Do", "Doing", "Done"],
      default: "Backlog",
    },

    projeto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projeto",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Tarefa", tarefaSchema);