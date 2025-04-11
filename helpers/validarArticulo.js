const validator = require("validator");

const validarArticulo = (parametros) => {
  let validarTitulo =
    !validator.isEmpty(parametros.titulo) &&
    validator.isLength(parametros.titulo, { min: 5, max: undefined });
  let validarContenido =
    !validator.isEmpty(parametros.contenido) &&
    validator.isLength(parametros.contenido, { min: 5, max: undefined });

  if (!validarTitulo || !validarContenido) {
    throw new Error(
      "Titulo y contenido son obligatorios y deben tener al menos 5 caracteres"
    );
  }
};
module.exports = { validarArticulo };
