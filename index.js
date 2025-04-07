const { conexion } = require("./database/conexion");
const express = require("express");
const cors = require("cors");

console.log("alexa t");

conexion();

//Crear servidor node
const app = express();
const port = 3900;

//Configurar cors
app.use(cors());

//convertir body a objeto js
app.use(express.json());

//Crear rutas

//Crear servidor y escuchar rutas
app.listen(port, () => {
  console.log("servidor corriendo en el puerto " + port);
});
