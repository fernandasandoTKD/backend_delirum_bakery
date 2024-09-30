/* Importación de express, mongoose, y cors */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Importa cors
const port = process.env.PORT || 3900;

/* Importación de rutas */
const userRoutes = require('./src/routes/userRoutes');
const routes = require('./src/routes/routes');
const productCategoryRoutes = require('./src/routes/categories');
const productRoutes = require('./src/routes/products');
const shoppingCarRoutes = require('./src/routes/cart');

/* Sinónimo para llamar a express */
const app = express();
// Middleware para manejar cookies
app.use(cookieParser());  // Usar cookie-parser


/* Configuración de CORS */
app.use(cors({
    origin: '*', // Puedes especificar un dominio en lugar de * para mayor seguridad
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/* Uso de rutas y middlewares */
app.use(express.json());
app.use('/api', routes);

/* Importación de librería para leer archivos .env */
require('dotenv').config();

/* Habilitar puesto de escucha */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/* Conexión a MongoDB */
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error.message);
    });