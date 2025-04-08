const express = require("express");
const router = express.Router();
const ArticuloController = require("../controllers/ArticuloController");
/**
 * @swagger
 * tags:
 *   name: Artículos
 *   description: Endpoints para gestión de artículos
 */
router.post("/crear", ArticuloController.crear);
router.get("/articulos", ArticuloController.consultaArticulos);

module.exports = router;
