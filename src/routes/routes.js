const express = require('express');
const router = express.Router();

// Importar los controladores de rutas
const authRoutes = require('./authRoutes');
const usersRoutes =require('./userRoutes')
const categories =require('./categories');
const products =require('./products');
const cart =require('./cart');


// Definir las rutas para la API
router.use('/auth', authRoutes);     
router.use('/users', usersRoutes); 
router.use('/products', products);
router.use('/cart', cart);    
router.use('/categories',categories)  


module.exports = router;
