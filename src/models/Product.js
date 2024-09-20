const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: int,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory',
        required: true,
    },
    stock: {
        type: int,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);