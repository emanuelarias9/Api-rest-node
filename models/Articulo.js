const { Schema, model } = require("mongoose");

const ArticuloSchema = Schema({
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  imagen: { type: String, default: "default.png" },
});

module.exports = model("Articulo", ArticuloSchema, "articulo");
