const express = require('express');
const { getCart, addToCart } = require('../controllers/shoppingCarController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.get('/mycart/:id', getCart);
router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/clear', clearCart);

module.exports = router;