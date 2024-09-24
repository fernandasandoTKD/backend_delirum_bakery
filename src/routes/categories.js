const express = require('express');
const { getAllCategories, createCategory } = require('../controllers/productCategoryController');

const router = express.Router();

router.get('/menu', getAllCategories);
router.post('/new', createCategory);

module.exports = router;