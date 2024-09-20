const ShoppingCart = require('../models/ShoppingCart'); // Asegúrate de que la ruta sea correcta

// Obtener el carrito de compras del usuario
const getCart = async (req, res) => {
    try {
        const cart = await ShoppingCart.findOne({ userId: req.user.id }).populate('products');
        res.json(cart);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Agregar un producto al carrito
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await ShoppingCart.findOneAndUpdate(
            { userId: req.user.id },
            { $addToSet: { products: { productId, quantity } } },
            { new: true, upsert: true }
        );
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).send('Error adding to cart');
    }
};

// Exportar las funciones
module.exports = { getCart, addToCart };