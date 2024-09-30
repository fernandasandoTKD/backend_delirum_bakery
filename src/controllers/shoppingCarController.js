const ShoppingCart = require('../models/ShoppingCart'); // Asegúrate de que el modelo esté bien importado
const Product = require('../models/Product');

// Obtener el carrito 
exports.getCart = async (req, res) => {
    try {
        const userId = req.userId || null; // Comprueba si hay un usuario autenticado
        let cart;

        if (userId) {
            // Si hay un usuario autenticado, busca el carrito del comprador
            cart = await ShoppingCart.findOne({ userId }).populate('products.productId');
        } else {
            // Aquí puedes implementar la lógica para buscar un carrito sin propietario
            cart = await ShoppingCart.findOne({ /* lógica para carrito no autenticado */ }).populate('products.productId');
        }

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
    }
};

// Añadir un producto al carrito
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        // Comprobar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Si el usuario está autenticado
        if (req.userId) {
            const buyerId = req.userId;

            // Buscar el carrito del usuario
            let cart = await ShoppingCart.findOne({ userId: buyerId });

            if (!cart) {
                // Crear un nuevo carrito si no existe
                cart = new ShoppingCart({
                    userId: buyerId,
                    products: [{ productId, quantity }]
                });
            } else {
                // Añadir o actualizar el producto en el carrito existente
                const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);

                if (existingProductIndex > -1) {
                    // El producto ya existe, actualizar la cantidad
                    cart.products[existingProductIndex].quantity += quantity;
                } else {
                    // Añadir nuevo producto al carrito
                    cart.products.push({ productId, quantity });
                }
            }

            // Guardar el carrito
            await cart.save();
            return res.status(200).json({ message: 'Producto añadido al carrito', cart });
        }

        // Si el usuario NO está autenticado
        // Manejo del carrito en una cookie
        let cartCookie = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

        const existingProductIndex = cartCookie.findIndex(item => item.product === productId);
        
        if (existingProductIndex > -1) {
            // El producto ya existe en la cookie, actualizar la cantidad
            cartCookie[existingProductIndex].quantity += quantity;
        } else {
            // Añadir nuevo producto a la cookie
            cartCookie.push({ product: productId, quantity });
        }

        // Actualizar la cookie con el carrito actualizado
        res.cookie('cart', JSON.stringify(cartCookie), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // Cookie válida por 7 días

        return res.status(200).json({ message: 'Producto añadido al carrito (no autenticado)', cart: cartCookie });
        
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        return res.status(500).json({ message: 'Error al añadir el producto al carrito', error: error.message });
    }
};


// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.userId || null; // Cambiar de req.user?.id a req.userId

    try {
        let cart;
        if (userId) {
            // Buscar el carrito para el usuario autenticado
            cart = await ShoppingCart.findOne({ userId });
        } else {
            // Buscar el carrito para el usuario no autenticado usando cookies
            const cartCookie = req.cookies.cart ? JSON.parse(req.cookies.cart) : null;
            if (cartCookie) {
                // Aquí puedes construir un carrito basado en la cookie
                cart = { products: cartCookie };
            }
        }

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Eliminar el producto del carrito
        cart.products = cart.products.filter(item => item.productId.toString() !== productId);

        // Guardar el carrito si es un usuario autenticado
        if (userId) {
            await cart.save();
        } else {
            // Actualizar la cookie con el carrito modificado
            res.cookie('cart', JSON.stringify(cart.products), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        }
        
        res.status(200).json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto del carrito', error });
    }
};


// Vaciar el carrito
exports.clearCart = async (req, res) => {
    const userId = req.userId || null; // Cambiar de req.user?.id a req.userId

    try {
        let cart;
        if (userId) {
            // Buscar el carrito para el usuario autenticado
            cart = await ShoppingCart.findOne({ userId });
        } else {
            // Buscar el carrito para el usuario no autenticado usando cookies
            const cartCookie = req.cookies.cart ? JSON.parse(req.cookies.cart) : null;
            if (cartCookie) {
                cart = { products: cartCookie };
            }
        }

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Vaciar el carrito
        cart.products = [];

        // Guardar el carrito si es un usuario autenticado
        if (userId) {
            await cart.save();
        } else {
            // Actualizar la cookie para vaciar el carrito
            res.cookie('cart', JSON.stringify([]), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        }

        res.status(200).json({ message: 'Carrito vaciado', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al vaciar el carrito', error });
    }
};
