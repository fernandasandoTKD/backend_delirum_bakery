const Cart = require('../models/ShoppingCart');
const Product = require('../models/Product');

// Obtener el carrito de un comprador específico
exports.getCart = async (req, res) => {
    try {
        const buyerId = req.user?.id || null; // Comprueba si hay un usuario autenticado
        let cart;

        if (buyerId) {
            // Si hay un usuario autenticado, busca el carrito del comprador
            cart = await Cart.findOne({ buyer: buyerId }).populate('items.product');
        } else {
            // Si no hay usuario autenticado, intenta encontrar un carrito sin propietario
            cart = await Cart.findOne({ sessionId: req.sessionID }).populate('items.product');
        }

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
    const { productId, quantity } = req.body;
    const buyerId = req.user?.id || null; // Comprueba si hay un usuario autenticado

    try {
        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Buscar si ya existe un carrito para el comprador o un carrito sin propietario
        let cart;

        if (buyerId) {
            // Usuario autenticado
            cart = await Cart.findOne({ buyer: buyerId });
        } else {
            // Usuario invitado
            cart = await Cart.findOne({ sessionId: req.sessionID });
        }

        if (!cart) {
            // Si no existe carrito, crearlo
            cart = new Cart({
                buyer: buyerId || null,
                sessionId: req.sessionID, // Asociar carrito a una sesión si es usuario no autenticado
                items: [{ product: Id, quantity }]
            });
        } else {
            // Si existe carrito, actualizar o agregar el producto
            const existingProductIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (existingProductIndex > -1) {
                cart.items[existingProductIndex].quantity += quantity;
            } else {
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
    const { productId } = req.body;
    const buyerId = req.user?.id || null; // Verifica si hay un usuario autenticado

    try {
        // Buscar el carrito según el estado del usuario
        let cart;
        if (buyerId) {
            cart = await Cart.findOne({ buyer: buyerId });
        } else {
            cart = await Cart.findOne({ sessionId: req.sessionID });
        }

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
    const buyerId = req.user?.id || null; // Verifica si hay un usuario autenticado

    try {
        // Buscar el carrito del usuario o invitado
        let cart;
        if (buyerId) {
            cart = await Cart.findOne({ buyer: buyerId });
        } else {
            cart = await Cart.findOne({ sessionId: req.sessionID });
        }

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Vaciar el carrito
        cart.items = [];
        await cart.save();

        res.status(200).json({ message: 'Carrito vaciado', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al vaciar el carrito', error });
    }
};
