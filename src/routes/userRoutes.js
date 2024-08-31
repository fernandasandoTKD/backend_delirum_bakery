const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para crear un nuevo usuario
router.post('/users', userController.createUser);

// Ruta para obtener todos los usuarios
router.get('/users', userController.getUsers);

// Ruta para obtener un usuario por ID
router.get('/users/:id', userController.getUserById);

// Ruta para actualizar un usuario por ID
router.put('/users/:id', userController.updateUser);

// Ruta para eliminar un usuario por ID
router.delete('/users/:id', userController.deleteUser);

module.exports = router;