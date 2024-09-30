const express = require('express');
const { getCart, addToCart, removeFromCart, clearCart  } = require('../controllers/shoppingCarController');
const  verifyToken = require('../middlewares/auth');

const router = express.Router();

router.get('/mycart', getCart);
router.get('/usermycart',verifyToken, getCart);
router.post('/add', addToCart);
router.post('/useradd', verifyToken, addToCart);
router.post('/userremove',verifyToken, removeFromCart);
router.post('/remove', removeFromCart);
router.post('/userclear',verifyToken, clearCart);
router.post('/clear', clearCart);

module.exports = router;