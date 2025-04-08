const validator = require("validator");
const Articulo = require("../models/Articulo");

const prueba = (req, res) => {
  return res.status(200).json({
    mensaje: "Soy una accion de prueba en mi controlador de articulos",
  });
};

const curso = (req, res) => {
  console.log("se ha ejecutado el endpoint");
  return res.status(200).json({
    curso: "React",
    autor: "test",
  });
};

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

module.exports = {
  prueba,
  curso,
  crear,
};
