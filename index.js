const { conexion } = require("./database/conexion");
const express = require("express");
const cors = require("cors");

conexion();

//Crear servidor node
const app = express();
const port = 3900;

//Configurar cors
app.use(cors());

//convertir body a objeto js
app.use(express.json()); //recibiendo datos con content-type app/json
app.use(express.urlencoded({ extended: true })); //recibiendo datos form-urlencoded

//RUTAS
const articuloRuta = require("./rutas/ArticuloRuta");

app.use("/api", articuloRuta);

//Crear servidor y escuchar rutas
app.listen(port, () => {
  console.log("servidor corriendo en el puerto " + port);
});
