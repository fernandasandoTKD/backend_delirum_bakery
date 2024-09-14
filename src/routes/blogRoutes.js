const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');


// Ruta para obtener todos los usuarios
router.get('/blogs', blogController.getBlogs);



module.exports = router;