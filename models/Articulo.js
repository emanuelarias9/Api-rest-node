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
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         titulo:
 *           type: string
 *           description: Título del artículo
 *           minLength: 5
 *           example: Cómo aprender Node.js
 *         contenido:
 *           type: string
 *           description: Contenido del artículo
 *           example: Este artículo explica cómo empezar con Node.js...
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del artículo
 *           example: 2025-04-09T12:34:56.789Z
 *         imagen:
 *           type: string
 *           description: Nombre del archivo de imagen del artículo
 *           default: default.png
 *           example: articulo1.png
 */
const ArticuloSchema = new Schema({
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  imagen: { type: String, default: "default.png" },
});

module.exports = model("Articulo", ArticuloSchema, "articulo");
