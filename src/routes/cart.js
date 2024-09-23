const express = require('express');
const { getCart, addToCart } = require('../controllers/shoppingCarController');
const { authenticate } = require('../middleware/Autenticación');

const router = express.Router();

router.get('/mycart', authenticate, getCart);
router.post('/add/:id', authenticate, addToCart);

module.exports = router;