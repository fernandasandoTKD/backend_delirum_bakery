const User = require('../models/user');
const  bcrypt =require('bcrypt');

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    try {

        const passHast = await bcrypt.hash(password, 10)
        const { username, email, password, role } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear el nuevo usuario
        const newUser = new User({
            username,
            email,
            password: passHast,
            role
        });

        // Guardar el usuario en la base de datos
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
};

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
    console.log("gatito");
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
};

// Actualizar un usuario por ID
exports.updateUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Buscar y actualizar el usuario
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, password, role },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
};

// Eliminar un usuario por ID
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
};


/* Users profile */
exports.profile = async (req, res) => {
    try {
        // Obtener el ID del usuario desde los parámetros de la URL
        const userId = req.params.id;
        console.log(userId)
        console.log(req.userId)

        // Verificar si el ID del usuario autenticado está disponible
        if (!req.userId ) {
            return res.status(401).send({
                status: "success",
                message: "Usuario no autenticado"
            });
        }

        // Buscar al usuario en la BD y excluimos los datos que no queremos mostrar
        const userProfile = await User.findById(userId).select('-password -role -email -__v');
        console.log(userProfile)
        // Verificar si el usuario no existe
        if (!userProfile) {
            return res.status(404).send({
                status: "success",
                message: "Usuario no encontrado"
            });
        }

        // Información del seguimiento
        /* const followInfo = await followThisUser(req.user.userId, userId); */

        // Devolver la información del perfil del usuario
        return res.status(200).json({
            status: "success",
            user: userProfile,
           
        });

    } catch (error) {
        console.log("Error al obtener el perfil del usuario:", error)
        return res.status(500).send({
            status: "error",
            message: "Error al obtener el perfil del usuario"
        });
    }
}