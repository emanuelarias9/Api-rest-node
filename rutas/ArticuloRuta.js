const express = require("express");
const router = express.Router();
const ArticuloController = require("../controllers/ArticuloController");

router.post("/crear", ArticuloController.crear);
router.get("/articulos", ArticuloController.consultaArticulos);

module.exports = router;
