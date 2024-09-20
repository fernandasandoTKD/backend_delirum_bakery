const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para autenticar el token
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }

        // Almacenar la información del usuario en la solicitud
        req.user = await User.findById(decoded.id).select('-password'); // Excluir la contraseña
        next();
    });
};

module.exports = { authenticate };