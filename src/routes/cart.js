const express = require('express');
const router = express.Router();
const cardController =require('../controllers/shoppingCarController');


router.get('/mycart/:id', cardController.getCart);
router.post('/add', cardController.addToCart);
router.post('/remove', cardController.removeFromCart);
router.post('/clear', cardController.clearCart);

module.exports = router;