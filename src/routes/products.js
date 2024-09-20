const express = require('express');
const { getProduct, createProduct } = require('../controllers/productController.js');

const router = express.Router();

router.get('/product/:id', getProduct);
router.post('/newproduct', createProduct);

module.exports = router;