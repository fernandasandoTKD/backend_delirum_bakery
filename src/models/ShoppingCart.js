const mongoose = require('mongoose');

const shoppingCartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Asegúrate de que el modelo de usuario esté definido
        required: true,
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: int,
            required: true,
            default: 1,
        },
    }],
}, { timestamps: true });

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);