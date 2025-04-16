const { ValidarArticulo } = require("../helpers/validarArticulo");
const { ValidarImagen, EliminarImagen } = require("../helpers/validarImagen");
const fs = require("fs");
const path = require("path");
/** @type {import("mongoose").Model} */
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
const CrearArticulo = async (req, res) => {
  let parametros = req.body;

  // Validación de datos
  try {
    ValidarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      mensaje: error.message,
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
      mensaje: "Error interno del servidor: " + error.message,
    });
  }
};

/**
 * @swagger
 * /api/articulos:
 *   get:
 *     summary: Listar o filtrar artículos
 *     tags: [Artículos]
 *     description: Retorna todos los artículos o aquellos que coincidan con los filtros opcionales enviados por query string.
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: título del artículo
 *       - in: query
 *         name: contenido
 *         schema:
 *           type: string
 *         description: contenido del artículo
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date-time
 *         description: fecha
 *       - in: query
 *         name: imagen
 *         schema:
 *           type: string
 *         description: Nombre exacto de la imagen ("foto.jpg")
 *       - in: query
 *         name: cantidad
 *         schema:
 *           type: integer
 *         description: Límite máximo de artículos a retornar
 *     responses:
 *       200:
 *         description: Artículos encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 cantidad:
 *                   type: integer
 *                 articulos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Articulo'
 *       404:
 *         description: No se encontraron artículos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const FiltrarArticulos = async (req, res) => {
  try {
    const filtros = {};

    if (req.query.titulo) {
      filtros.titulo = { $regex: req.query.titulo, $options: "i" };
    }

    if (req.query.contenido) {
      filtros.contenido = { $regex: req.query.contenido, $options: "i" };
    }

    if (req.query.fecha) {
      filtros.fecha = req.query.fecha;
    }

    if (req.query.imagen) {
      filtros.imagen = req.query.imagen;
    }

    let query = Articulo.find(filtros).sort({ fecha: -1 });

    if (req.query.cantidad) {
      query = query.limit(parseInt(req.query.cantidad));
    }

    const articulos = await query.exec();

    if (!articulos || articulos.length === 0) {
      return res.status(404).json({
        status: "Error",
        mensaje: "No se han encontrado articulos que coincidan con los filtros",
      });
    }

    return res.status(200).json({
      status: "Success",
      cantidad: articulos.length,
      articulos,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      mensaje: "Error en el servidor: " + error.message,
    });
  }
};

/**
 * @swagger
 * /api/articulos/{id}:
 *   get:
 *     summary: Obtener un artículo por su ID
 *     tags: [Artículos]
 *     description: Retorna un único artículo específico de la base de datos usando su ID
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
      mensaje: error.message,
    });
  }
};

/**
 * @swagger
 * /api/articulos/imagen/{imagen}:
 *   get:
 *     summary: Obtener la imagen de un artículo por su nombre
 *     tags:
 *       - Artículos
 *     description: Devuelve la imagen asociada a un artículo.
 *     parameters:
 *       - in: path
 *         name: imagen
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nombre de la imagen (ejemplo: 'foto.jpg')"
 *     responses:
 *       200:
 *         description: Imagen encontrada y enviada exitosamente
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Imagen no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 mensaje:
 *                   type: string
 */
const ObtenerImagen = (req, res) => {
  let file = req.params.imagen;
  let ruta = "./public/images/articulos/" + file;
  // Verificar si el archivo existe
  fs.stat(ruta, (error) => {
    if (error) {
      return res.status(404).json({
        status: "Error",
        mensaje: "No se ha encontrado la imagen",
      });
    }
    // Si existe, enviar el archivo
    res.sendFile(path.resolve(ruta));
  });
};

/**
 * @swagger
 * /api/articulos/{id}:
 *   put:
 *     summary: Actualizar un artículo por su ID
 *     tags: [Artículos]
 *     description: Actualiza un artículo específico de la base de datos usando su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongo-id
 *           example: "507f1f77bcf86cd799439011"
 *         description: ID del artículo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Articulo'
 *           examples:
 *             articuloActualizado:
 *               value:
 *                 titulo: "Título actualizado"
 *                 contenido: "Contenido actualizado del artículo"
 *     responses:
 *       200:
 *         description: Artículo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 articuloActualizado:
 *                   $ref: '#/components/schemas/Articulo'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Artículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const ActualizarArticulo = async (req, res) => {
  let articuloId = req.params.id;
  let parametros = req.body;
  let file = req.file;
  console.log(parametros);
  // Validación de datos
  try {
    ValidarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      mensaje: "Error al Validar Articulo " + error.message,
    });
  }

  // Actualizar el artículo
  try {
    let articuloActualizado = await Articulo.findByIdAndUpdate(
      { _id: articuloId },
      {
        titulo: parametros.titulo,
        contenido: parametros.contenido,
        imagen: file.filename,
      },
      { new: false } // Cambiar a true si se desea el documento actualizado
    ).exec();

    if (!articuloActualizado) {
      return res.status(404).json({
        status: "Error",
        mensaje: "No se ha encontrado el articulo a actualizar",
      });
    }
    // Eliminar la imagen anterior si existe
    console.log(articuloActualizado.imagen);
    try {
      EliminarImagen(articuloActualizado.imagen);
    } catch (error) {
      return res.status(500).json({
        status: "Error",
        mensaje: "Error al eliminar la imagen: " + error.message,
      });
    }
    //OK
    return res.status(200).json({
      status: "Success",
      articuloActualizado: parametros.titulo,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      mensaje: error.message,
    });
  }
};

/**
 * @swagger
 * /api/articulos/imagen/{id}:
 *   put:
 *     summary: Actualizar la imagen a un artículo por su ID
 *     tags: [Artículos]
 *     description: Valida, actualiza y reemplaza la imagen de un artículo por su ID. También elimina la imagen anterior del servidor si existe.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del artículo al que se le asociará la imagen
 *         schema:
 *           type: string
 *           format: mongo-id
 *           example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen a subir
 *     responses:
 *       200:
 *         description: Imagen actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 articuloActualizado:
 *                   $ref: '#/components/schemas/Articulo'
 *       400:
 *         description: Validación fallida o archivo inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Artículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al actualizar o eliminar la imagen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
const ActualizarImagen = async (req, res) => {
  let file = req.file;
  let articuloId = req.params.id;
  // Validar la imagen
  try {
    ValidarImagen(file);
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      mensaje: error.message,
    });
  }
  let articulo = await Articulo.findById(articuloId).exec();
  if (!articulo) {
    return res.status(404).json({
      status: "Error",
      mensaje: "No se ha encontrado el articulo",
    });
  }
  // Actualizar el artículo
  try {
    let articuloActualizado = await Articulo.findByIdAndUpdate(
      { _id: articuloId },
      { imagen: file.filename },
      { new: true }
    ).exec();

    if (!articuloActualizado) {
      return res.status(404).json({
        status: "Error",
        mensaje: "No se ha encontrado el articulo a actualizar",
      });
    }

    // Eliminar la imagen anterior si existe
    try {
      EliminarImagen(articulo.imagen);
    } catch (error) {
      return res.status(500).json({
        status: "Error",
        mensaje: "Error al eliminar la iamgen: " + error.message,
      });
    }

    //OK
    return res.status(200).json({
      status: "Success",
      articuloActualizado,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      mensaje: error.message,
    });
  }
};

/**
 * @swagger
 * /api/articulos/{id}:
 *   delete:
 *     summary: Eliminar un artículo por su ID
 *     tags: [Artículos]
 *     description: Elimina un artículo específico de la base de datos usando su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: mongo-id
 *           example: "507f1f77bcf86cd799439011"
 *         description: ID del artículo a eliminar
 *     responses:
 *       200:
 *         description: Artículo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 articuloEliminado:
 *                   $ref: '#/components/schemas/Articulo'
 *             examples:
 *               respuestaExitosa:
 *                 value:
 *                   status: "Success"
 *                   articuloEliminadoId: "507f1f77bcf86cd799439011"
 
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
 *                   example: "No se ha encontrado el articulo a eliminar"
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
 *                 mensaje:
 *                   type: string
 *                   example: "Error al eliminar el artículo"
 */
const EliminarArticulo = async (req, res) => {
  try {
    let id = req.params.id;
    let articulo = await Articulo.findById(id).exec();
    if (!articulo) {
      return res.status(404).json({
        status: "Error",
        mensaje: "No se ha encontrado el articulo",
      });
    }

    let articuloEliminado = await Articulo.findOneAndDelete({ _id: id }).exec();
    if (!articuloEliminado) {
      return res.status(404).json({
        status: "Error",
        mensaje: "No se ha encontrado el articulo a eliminar",
      });
    }

    // Eliminar la imagen anterior si existe
    try {
      EliminarImagen(articulo.imagen);
    } catch (error) {
      return res.status(500).json({
        status: "Error",
        mensaje: "Error al eliminar la iamgen: " + error.message,
      });
    }

    //OK
    return res.status(200).json({
      status: "Success",
      articuloEliminado: articuloEliminado.titulo,
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      mensaje: error.message,
    });
  }
};

module.exports = {
  ActualizarArticulo,
  EliminarArticulo,
  ActualizarImagen,
  FiltrarArticulos,
  ObtenerArticulo,
  ObtenerImagen,
  CrearArticulo,
};
