const fs = require("fs");

const ValidarImagen = (file) => {
  if (!file) {
    throw new Error("No se ha subido la imagen");
  }

  let nombreArchivo = file.originalname;
  let extension = nombreArchivo.split(".").pop();
  let extensionesValidas = ["png", "jpg", "jpeg", "gif"];

  if (!extensionesValidas.includes(extension)) {
    fs.unlinkSync(file.path);
    throw new Error(
      "Formato de imagen no válido, formatos permitidos: " +
        extensionesValidas.join(", ")
    );
  }
};

const EliminarImagen = (imagen) => {
  let ruta = "./public/images/articulos/" + imagen;
  if (fs.existsSync(ruta) && imagen !== "default.png") {
    fs.unlinkSync(ruta);
  }
};
module.exports = { ValidarImagen, EliminarImagen };
