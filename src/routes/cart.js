const express = require('express');
const { getCart, addToCart, removeFromCart,clearCart } = require('../controllers/shoppingCarController');
// const { authenticate } = require('../middleware/Autenticación');

const router = express.Router();

router.get('/mycart/:id', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/clear', clearCart);

module.exports = router;