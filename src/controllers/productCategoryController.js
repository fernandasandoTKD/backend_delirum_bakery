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
    const { name } = req.body; // Desestructurar el nombre de la categoría

    try {
        // Transformar el nombre a minúsculas para evitar duplicados insensibles a mayúsculas
        // const lowerCaseName = name.toLowerCase();

        // Verificar si la categoría ya existe (insensible a mayúsculas)
        const existingCategory = await ProductCategory.findOne({ name: lowerCaseName });
        if (existingCategory) {
            return res.status(400).send('Error: La categoría ya existe'); // Mensaje de error si la categoría existe
        }

        // Crear y guardar la nueva categoría
        const newCategory = new ProductCategory({ ...req.body, name: lowerCaseName });
        await newCategory.save();
        res.status(201).json(newCategory); // Respuesta exitosa
    } catch (error) {
        console.error(error); // Log del error para depuración
        res.status(500).send('Error creating category'); // Error genérico
    }
};

module.exports = { getAllCategories, createCategory };