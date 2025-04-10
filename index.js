const { conexion } = require("./database/conexion");
const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

conexion();

// Crear servidor node
const app = express();
const port = 3900;

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Blog",
      version: "1.0.0",
      description:
        "Documentación para la Api Rest de mi Blog creada con NodeJS, expressJS y mongoose",
    },
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: ["./rutas/*.js", "./controllers/*.js"],
};

const specs = swaggerJsdoc(swaggerOptions);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rutas de la API
const articuloRuta = require("./rutas/ArticuloRuta");
app.use("/api", articuloRuta);

// Iniciar servidor y escuchar rutas
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
  console.log(`Documentación disponible en http://localhost:${port}/api-docs`);
});
