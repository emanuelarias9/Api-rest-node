const express = require("express");
const router = express.Router();
const ArticuloController = require("../controllers/ArticuloController");
/**
 * @swagger
 * tags:
 *   name: Artículos
 *   description: Endpoints para gestión de artículos
 */
router.post("/crear", ArticuloController.crearArticulo);
router.get("/articulos", ArticuloController.consultaArticulos);
router.get("/articulo/:id", ArticuloController.ObtenerArticulo);

module.exports = router;
