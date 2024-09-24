const Product = require('../models/Product');

// Obtener todos los productos
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
    try {
        // Validar que la solicitud contiene la información requerida
        if (!req.body.name || !req.body.price) {
            return res.status(400).json({
                status: 'error',
                message: 'Faltan campos obligatorios como nombre o precio.'
            });
        }

        // Crear un nuevo producto con los datos del cuerpo de la solicitud
        const newProduct = new Product(req.body);
        await newProduct.save();

        // Respuesta exitosa
        res.status(201).json({
            status: 'success',
            message: 'Producto creado exitosamente.',
            data: newProduct
        });

    } catch (error) {
        // Manejo de errores
        res.status(500).json({
            status: 'error',
            message: 'Error al crear el producto',
            error: error.message // Devuelve el mensaje de error para más contexto (en entornos de desarrollo)
        });
    }
};


module.exports = { getProduct, createProduct };