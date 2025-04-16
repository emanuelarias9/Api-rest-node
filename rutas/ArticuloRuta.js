const express = require("express");
const multer = require("multer");
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/articulos/");
  },
  filename: function (req, file, cb) {
    cb(null, "articulo-" + Date.now() + "-" + file.originalname);
  },
});
const uploads = multer({ storage: storage });
const ArticuloController = require("../controllers/ArticuloController");
/**
 * @swagger
 * tags:
 *   name: Artículos
 *   description: Endpoints para gestión de artículos
 */
router.post("/articulos", ArticuloController.CrearArticulo);
router.get("/articulos", ArticuloController.FiltrarArticulos);
router.get("/articulos/:id", ArticuloController.ObtenerArticulo);
router.get("/articulos/imagen/:imagen", ArticuloController.ObtenerImagen);
router.put(
  "/articulos/:id",
  [uploads.single("file")],
  ArticuloController.ActualizarArticulo
);
router.put(
  "/articulos/imagen/:id",
  [uploads.single("file")],
  ArticuloController.ActualizarImagen
);
router.delete("/articulos/:id", ArticuloController.EliminarArticulo);
module.exports = router;
