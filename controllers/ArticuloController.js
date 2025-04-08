const validator = require("validator");
const Articulo = require("../models/Articulo");
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
 *           example: "Título de ejemplo"
 *         contenido:
 *           type: string
 *           example: "Contenido del artículo"
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00Z"
 *         imagen:
 *           type: string
 *           example: "default.png"
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "Error"
 *         mensaje:
 *           type: string
 *           example: "Mensaje de error"
 */

/**
 * @swagger
 * /api/crear:
 *   post:
 *     summary: Crear un nuevo artículo
 *     tags: [Artículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Articulo'
 *     responses:
 *       200:
 *         description: Artículo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Articulo'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 */
const crear = async (req, res) => {
  let parametros = req.body;

  // Validación de datos
  try {
    let validarTitulo =
      !validator.isEmpty(parametros.titulo) &&
      validator.isLength(parametros.titulo, { min: 5, max: undefined });
    let validarContenido = !validator.isEmpty(parametros.contenido);

    if (!validarTitulo || !validarContenido) {
      throw new Error("Datos inválidos");
    }
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      mensaje: "Faltan datos o son inválidos",
      error: error.message,
    });
  }

  try {
    const articulo = new Articulo(parametros);
    const articuloGuardado = await articulo.save();

    if (!articuloGuardado) {
      return res.status(400).json({
        status: "Error",
        mensaje: "Error al guardar el artículo",
      });
    }

    return res.status(200).json({
      status: "Success",
      articulo: articuloGuardado,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};
/**
 * @swagger
 * /api/articulos:
 *   get:
 *     summary: Listar todos los artículos
 *     tags: [Artículos]
 *     responses:
 *       200:
 *         description: Lista de artículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Articulo'
 *       404:
 *         description: No se encontraron artículos
 *       500:
 *         description: Error interno del servidor
 */
const consultaArticulos = async (req, res) => {
  try {
    let articulos = await Articulo.find({}).exec();
    if (!articulos) {
      return res.status(404).json({
        status: "Error",
        mensaje: "No se han encontrado articulos",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: "Success",
      articulos,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error.message,
    });
  }
};

module.exports = {
  consultaArticulos,
  crear,
};
