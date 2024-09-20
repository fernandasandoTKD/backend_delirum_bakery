const express = require('express');
const { getProducts, createProduct } = require('../controllers/productController');

const router = express.Router();

router.get('/product/:id', getProducts);
router.post('/newproduct', createProduct);

module.exports = router;