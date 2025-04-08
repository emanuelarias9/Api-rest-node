const validator = require("validator");
const Articulo = require("../models/Articulo");

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
