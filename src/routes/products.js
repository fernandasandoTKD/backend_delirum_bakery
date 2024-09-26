const express = require('express');
const { getProduct, createProduct, listProducts,updateProduct, deleteProduct } = require('../controllers/productController.js');

const router = express.Router();

router.get('/product/:id', getProduct);
router.get('/products', listProducts);
router.post('/newproduct', createProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

module.exports = router;