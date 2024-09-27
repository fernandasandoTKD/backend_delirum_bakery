const express = require('express');
const router = express.Router();

// Importar los controladores de rutas
const authRoutes = require('./authRoutes');
const usersRoutes =require('./userRoutes')
const postRoutes = require('./postRoutes');
const authorRoutes = require ('./authorRoutes');
//const {notFound, errorHandler} =require ('./middleware/errorMiddleware')
/* const categories =require('./categories');
const products =require('./products');
const cart =require('./cart'); */

// Importar el middleware de autenticación
/* const authMiddleware = require('../middleware/auth'); */

// Definir las rutas para la API
router.use('/auth', authRoutes);     
router.use('/users', usersRoutes);
router.use('/blogpost', postRoutes);
router.use('/author', authorRoutes);

/* router.use('/categories', categories);
router.use('/products', products);
router.use('/cart', cart);  */        


module.exports = router;
