# 📘 API Blog - Node.js, Express y MongoDB

API RESTful para la gestión de artículos de un blog, desarrollada con **Node.js**, **Express.js** y **MongoDB**. Permite operaciones CRUD completas, búsqueda avanzada y gestión de imágenes, todo documentado con Swagger/OpenAPI.

---

## 🚀 Tecnologías

- **Node.js** & **Express.js** – Backend REST
- **MongoDB** & **Mongoose** – Base de datos NoSQL
- **Swagger UI** – Documentación interactiva
- **Multer** – Subida y gestión de imágenes
- **Validator** – Validación de entradas
- **CORS** – Habilitación de peticiones cross-origin

---

## 📚 Documentación Swagger

Disponible en: 
```
 [(https://api-blog-b0fd.onrender.com/api-docs/)](https://api-blog-b0fd.onrender.com/api-docs/)
 ```
Incluye descripción de:
- Rutas y métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`)
- Esquemas de entrada y salida
- Validaciones
- Códigos de error

---

## 📦 Endpoints principales

| Método | Ruta                              | Descripción                              |
|--------|-----------------------------------|------------------------------------------|
| POST   | `/api/articulos`                  | Crear un artículo                        |
| GET    | `/api/articulos`                  | Listar o filtrar artículos               |
| GET    | `/api/articulos/:id`              | Obtener artículo por ID                  |
| GET    | `/api/articulos/imagen/:imagen`   | Obtener imagen del artículo              |
| PUT    | `/api/articulos/:id`              | Actualizar artículo y su imagen          |
| PUT    | `/api/articulos/imagen/:id`       | Actualizar solo la imagen                |
| DELETE | `/api/articulos/:id`              | Eliminar artículo e imagen asociada      |

---
> Desarrollado por Emanuel Arias💻 (emanuelarias9@gmail.com)
