const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ensureAuth = require ('../middlewares/auth')

// Ruta para crear un nuevo usuario
router.post('/', userController.createUser);

// Ruta para obtener todos los usuarios
router.get('/', userController.getUsers);

// Ruta para obtener un usuario por ID
router.get('/:id', userController.getUserById);

// Ruta para actualizar un usuario por ID
router.put('/:id', ensureAuth, userController.updateUser);

// Ruta para eliminar un usuario por ID
router.delete('/:id', userController.deleteUser);

/* Ruta de perfil */
router.get('/profile/:id', ensureAuth, userController.profile);

module.exports = router;