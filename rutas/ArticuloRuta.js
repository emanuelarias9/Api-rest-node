const express = require("express");
const router = express.Router();
const ArticuloController = require("../controllers/ArticuloController");

router.get("/rutaDePrueba", ArticuloController.prueba);
router.get("/curso", ArticuloController.curso);

router.post("/crear", ArticuloController.crear);

module.exports = router;
