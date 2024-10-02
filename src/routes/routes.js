const express = require('express');
const router = express.Router();

// Importar los controladores de rutas
const authRoutes = require('./authRoutes');
const usersRoutes =require('./userRoutes')
const postRoutes = require('./postRoutes');
const authorRoutes = require ('./authorRoutes');
const classRoutes = require('./classRoutes');
const categories = require('./categories');
const products = require('./products');
const cart = require('./cart');


// Definir las rutas para la API
router.use('/auth', authRoutes);     
router.use('/users', usersRoutes);
router.use('/author', authorRoutes);
router.use('/post', postRoutes);
router.use('/categories', categories);
router.use('/products', products);
router.use('/cart', cart);
router.use('/classRoutes', classRoutes);



module.exports = router;
