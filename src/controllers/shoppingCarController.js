const Cart = require('../models/SHoppingCart');
const Product = require('../models/Product');

// Obtener el carrito de un comprador específico
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ buyer: req.params.buyerId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
};

// Añadir un producto al carrito
exports.addToCart = async (req, res) => {
    const { buyerId, productId, quantity } = req.body;

    try {
        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Buscar si ya existe un carrito para el comprador
        let cart = await Cart.findOne({ buyer: buyerId });

        if (!cart) {
            // Si no existe, crear un nuevo carrito
            cart = new Cart({
                buyer: buyerId,
                items: [{ product: productId, quantity }]
            });
        } else {
            // Si existe, comprobar si el producto ya está en el carrito
            const existingProductIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (existingProductIndex > -1) {
                // Si el producto ya está en el carrito, actualizar la cantidad
                cart.items[existingProductIndex].quantity += quantity;
            } else {
                // Si no está en el carrito, agregar el producto
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json({ message: 'Producto añadido al carrito', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al añadir el producto al carrito', error });
    }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
    const { buyerId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ buyer: buyerId });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Filtrar el producto que se desea eliminar del carrito
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();
        res.status(200).json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto del carrito', error });
    }
};

// Vaciar el carrito
exports.clearCart = async (req, res) => {
    const { buyerId } = req.body;

    try {
        const cart = await Cart.findOne({ buyer: buyerId });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart.items = []; // Vaciar el carrito
        await cart.save();
        res.status(200).json({ message: 'Carrito vaciado', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al vaciar el carrito', error });
    }
};





