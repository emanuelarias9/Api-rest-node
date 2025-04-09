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
 * /api/articulos:
 *   post:
 *     summary: Crear un nuevo artículo
 *     tags: [Artículos]
 *     description: Crea un nuevo artículo con validación de datos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Articulo'
 *           examples:
 *             articuloEjemplo:
 *               value:
 *                 titulo: "Mi primer artículo"
 *                 contenido: "Contenido de ejemplo para el artículo"
 *     responses:
 *       200:
 *         description: Artículo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Articulo'
 *             examples:
 *               respuestaExitosa:
 *                 value:
 *                   status: "Success"
 *                   articulo:
 *                     titulo: "Mi primer artículo"
 *                     contenido: "Contenido de ejemplo para el artículo"
 *                     fecha: "2023-05-20T12:00:00.000Z"
 *                     imagen: "default.png"
 *                     _id: "507f1f77bcf86cd799439011"
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 mensaje:
 *                   type: string
 *                 error:
 *                   type: string
 *             examples:
 *               datosInválidos:
 *                 value:
 *                   status: "Error"
 *                   mensaje: "Faltan datos o son inválidos"
 *               errorGuardado:
 *                 value:
 *                   status: "Error"
 *                   mensaje: "Error al guardar el artículo"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 mensaje:
 *                   type: string
 *                 error:
 *                   type: string
 *             examples:
 *               errorServidor:
 *                 value:
 *                   status: "Error"
 *                   mensaje: "Error interno del servidor"
 *                   error: "Mensaje de error detallado"
 */
const crearArticulo = async (req, res) => {
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

    //OK
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
 *     summary: Obtener el listado de artículos
 *     tags: [Artículos]
 *     description: Retorna un listado de artículos ordenados por fecha descendente, con opción de límite
 *     parameters:
 *       - in: query
 *         name: cantidad
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Cantidad máxima de artículos a retornar
 *     responses:
 *       200:
 *         description: Listado de artículos exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 cantidad:
 *                   type: integer
 *                   description: Número de artículos retornados
 *                   example: 5
 *                 articulos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Articulo'
 *             examples:
 *               respuestaCompleta:
 *                 value:
 *                   status: "Success"
 *                   cantidad: 2
 *                   articulos:
 *                     - titulo: "Artículo 1"
 *                       contenido: "Contenido 1"
 *                       fecha: "2023-05-20T12:00:00.000Z"
 *                       imagen: "default.png"
 *                     - titulo: "Artículo 2"
 *                       contenido: "Contenido 2"
 *                       fecha: "2023-05-19T12:00:00.000Z"
 *                       imagen: "imagen2.jpg"
 *               respuestaConCantidad:
 *                 value:
 *                   status: "Success"
 *                   cantidad: 1
 *                   articulos:
 *                     - titulo: "Últimas noticias"
 *                       contenido: "Contenido de noticias"
 *                       fecha: "2023-05-21T10:30:00.000Z"
 *                       imagen: "noticias.png"
 *       404:
 *         description: No se encontraron artículos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Error"
 *                 mensaje:
 *                   type: string
 *                   example: "No se han encontrado articulos"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Error"
 *                 error:
 *                   type: string
 *                   example: "Mensaje de error detallado"
 */
const consultaArticulos = async (req, res) => {
  try {
    let cantidad = req.query.cantidad;
    let query = {};
    if (cantidad) {
      query = Articulo.find({}).sort({ fecha: -1 }).limit(parseInt(cantidad));
    } else {
      query = Articulo.find({}).sort({ fecha: -1 });
    }

    let articulos = await query.exec();

    if (!articulos) {
      return res.status(404).json({
        status: "Error",
        mensaje: "No se han encontrado articulos",
        error: error.message,
      });
    }

    //OK
    return res.status(200).json({
      status: "Success",
      cantidad: articulos.length,
      articulos,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      error: error.message,
    });
  }
};
/**
 * @swagger
 * /api/articulo/{id}:
 *   get:
 *     summary: Obtener un artículo específico por ID
 *     tags: [Artículos]
 *     description: Retorna un único artículo basado en su ID de MongoDB
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongo-id
 *           example: "507f1f77bcf86cd799439011"
 *         description: ID único del artículo en formato MongoDB
 *     responses:
 *       200:
 *         description: Artículo encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Articulo'
 *       404:
 *         description: Artículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Error"
 *                 mensaje:
 *                   type: string
 *                   example: "No se ha encontrado el articulo"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Error"
 *                 error:
 *                   type: string
 *                   example: "Mensaje de error detallado"
 */
const ObtenerArticulo = async (req, res) => {
  try {
    let id = req.params.id;
    let articulo = await Articulo.findById(id).exec();
    if (!articulo) {
      return res.status(404).json({
        status: "Error",
        mensaje: "No se ha encontrado el articulo",
        error: error.message,
      });
    }

    //OK
    return res.status(200).json({
      status: "Success",
      articulo,
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
  ObtenerArticulo,
  crearArticulo,
};
