const express = require("express");
const router = express.Router();
const ArticuloController = require("../controllers/ArticuloController");
/**
 * @swagger
 * tags:
 *   name: Artículos
 *   description: Endpoints para gestión de artículos
 */
router.post("/articulo", ArticuloController.CrearArticulo);
router.get("/articulos", ArticuloController.ConsultaArticulos);
router.get("/articulo/:id", ArticuloController.ObtenerArticulo);
router.delete("/articulo/:id", ArticuloController.EliminarArticulo);
router.put("/articulo/:id", ArticuloController.ActualizarArticulo);

module.exports = router;
