const Product = require('../models/Product'); // Asegúrate de que la ruta sea correcta

// Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category'); // Asumiendo que hay una relación con categorías
        res.json(products);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).send('Error creating product');
    }
};

// Exportar las funciones
module.exports = { getAllProducts, createProduct };