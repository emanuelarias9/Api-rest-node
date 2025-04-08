const { Schema, model } = require("mongoose");
/**
 * @swagger
 * components:
 *   schemas:
 *     Articulo:
 *       type: object
 *       required:
 *         - titulo
 *         - contenido
 *       properties:
 *         titulo:
 *           type: string
 *           minLength: 5
 *         contenido:
 *           type: string
 *         fecha:
 *           type: string
 *           format: date-time
 *         imagen:
 *           type: string
 *           default: "default.png"
 */
const ArticuloSchema = Schema({
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  imagen: { type: String, default: "default.png" },
});

module.exports = model("Articulo", ArticuloSchema, "articulo");
