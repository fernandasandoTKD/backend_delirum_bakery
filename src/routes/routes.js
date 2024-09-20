const express = require('express');
const router = express.Router();

// Importar los controladores de rutas
const authRoutes = require('./authRoutes');
const usersRoutes =require('./userRoutes')

// Importar el middleware de autenticación
/* const authMiddleware = require('../middleware/auth'); */

// Definir las rutas para la API
router.use('/auth', authRoutes);     
router.use('/users', usersRoutes);          // Rutas de autenticación


module.exports = router;
