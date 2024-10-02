const ProductCategory = require('../models/ProductCategory');

// Listar productos paginados o filtrados por categoría
const getAllCategories = async (req, res) => {
    const { page = 1, limit = 10, categoryId } = req.query; // Obtener página, límite y categoryId desde la consulta
    console.log(req);
    try {
        // Crear un filtro si se proporciona un categoryId
        const filter = categoryId ? { category: categoryId } : {};

        // Buscar los productos con paginación y filtrado
        const products = await Product.find(filter)
            .populate('category')
            .skip((pageNum - 1) * limitNum) // Saltar productos de las páginas anteriores
            .limit(limitNum); // Limitar a la cantidad deseada

        // Contar total de productos para la paginación
        const totalProducts = await Product.countDocuments(filter);

        // Enviar la respuesta con los productos
        res.json({
            status: 'success',
            total: totalProducts,
            page: pageNum,
            limit: limitNum,
            data: products
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            message: 'Error al obtener productos',
            error: error.message
        });
    }
};

module.exports = { getAllCategories };

// Crear una nueva categoría
const createCategory = async (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).send('Error: El campo "name" es obligatorio');
    }

    try {
        const lowerCaseName = name.toLowerCase();

        const existingCategory = await ProductCategory.findOne({ name: lowerCaseName });
        if (existingCategory) {
            return res.status(400).send('Error: La categoría ya existe');
        }

        const newCategory = new ProductCategory({ ...req.body, name: lowerCaseName });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating category');
    }
};



// Editar una categoría
const editCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).send('Error: Los campos "name" y "description" son obligatorios');
    }

    try {
        const lowerCaseName = name.toLowerCase();

        const existingCategory = await ProductCategory.findById(id);
        if (!existingCategory) {
            return res.status(404).send('Error: Categoría no encontrada');
        }

        const categoryWithSameName = await ProductCategory.findOne({ name: lowerCaseName });
        if (categoryWithSameName && categoryWithSameName._id.toString() !== id) {
            return res.status(400).send('Error: El nombre de la categoría ya está en uso');
        }

        existingCategory.name = lowerCaseName;
        existingCategory.description = description;
        await existingCategory.save();

        res.status(200).json(existingCategory);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error editing category');
    }
};


// Eliminar una categoría
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        // Intentar encontrar y eliminar la categoría
        const category = await ProductCategory.findByIdAndDelete(id);
        // Si no se encuentra la categoría, devolver un error
        if (!category) {
            return res.status(404).send('Error: Categoría no encontrada');
        }

        res.status(200).send('Categoría eliminada correctamente');
    } catch (error) {
        console.error(`Error deleting category with ID ${id}:`, error);
        res.status(500).send('Error deleting category');
    }
};

//Solo categorias

const onlyCategoreries = async (req, res) => {
    try {
        const categories = await ProductCategory.find(); // Obtener todas las categorías de la base de datos
        res.status(200).json({
            status: 'success',
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};



module.exports = { getAllCategories, createCategory, editCategory, deleteCategory, onlyCategoreries};