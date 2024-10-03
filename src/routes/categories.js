const express = require('express');
const { getAllCategories, createCategory, editCategory, deleteCategory, onlyCategoreries  } = require('../controllers/productCategoryController');

const router = express.Router();

router.get('/menu', getAllCategories);
router.post('/new', createCategory);
router.put('/edit/:id', editCategory);
router.delete('/delete/:id', deleteCategory);
router.get('/categories', onlyCategoreries );

module.exports = router;