const express = require('express');
const { getAllCategories, createCategory, editCategory, deleteCategory  } = require('../controllers/productCategoryController');

const router = express.Router();

router.get('/menu', getAllCategories);
router.post('/new', createCategory);
router.put('/edit/:id', editCategory);
router.delete('/delete/:id', deleteCategory);

module.exports = router;