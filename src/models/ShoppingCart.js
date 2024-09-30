const mongoose = require('mongoose');

const shoppingCartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
    }],
}, { timestamps: true });

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);