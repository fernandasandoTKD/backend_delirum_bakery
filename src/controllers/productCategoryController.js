const ProductCategory = require('../models/ProductCategory');

// Obtener todas las categorías
const getAllCategories = async (req, res) => {
    try {
        const categories = await ProductCategory.find();
        res.json(categories);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Crear una nueva categoría
const createCategory = async (req, res) => {
    try {
        const newCategory = new ProductCategory(req.body);
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).send('Error creating category');
    }
};

module.exports = { getAllCategories, createCategory };