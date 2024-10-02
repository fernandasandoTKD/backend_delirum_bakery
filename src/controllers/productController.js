const Product = require('../models/Product');

// Obtener un producto por ID
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

        // Convertir el nombre del producto a minúsculas para la búsqueda
        const normalizedProductName = req.body.name.toLowerCase();

        // Verificar si el producto ya existe
        const productExists = await Product.findOne({ name: normalizedProductName });

        if (productExists) {
            return res.status(400).json({
                status: 'error',
                message: 'Ya existe un producto con ese nombre.'
            });
        }

        // Crear un nuevo producto con los datos del cuerpo de la solicitud
        const newProduct = new Product({
            ...req.body,
            name: normalizedProductName // Almacenar el nombre en minúsculas
        });
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

// Listar productos paginados o por categoría
const listProducts = async (req, res) => {
    const { categoryId } = req.query; // Obtener el categoryId desde la consulta si existe

    try {
        // Crear un objeto de filtros
        const filters = {};
        if (categoryId) {
            filters.category = categoryId; // Filtrar por categoría si se proporciona
        }

        // Obtener productos aplicando los filtros (sin paginación)
        const products = await Product.find(filters).populate('category');

        // Contar total de productos filtrados
        const totalProducts = await Product.countDocuments(filters);

        res.json({
            status: 'success',
            total: totalProducts,
            data: products // Enviar los productos sin paginación
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};


// Editar un producto
const updateProduct = async (req, res) => {
    try {
        // Verificar si el producto existe
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Actualizar los campos del producto
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true } // Devuelve el producto actualizado
        );

        res.json({
            status: 'success',
            message: 'Producto actualizado exitosamente.',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el producto',
            error: error.message
        });
    }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
    try {
        // Verificar si el producto existe
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Eliminar el producto
        await Product.findByIdAndDelete(req.params.id);

        res.json({
            status: 'success',
            message: 'Producto eliminado exitosamente.'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el producto',
            error: error.message
        });
    }
};


module.exports = { getProduct, createProduct, listProducts, updateProduct, deleteProduct };
