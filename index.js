/* Importación de express, mongoose, y cors */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa cors
const upload = require ('express-fileupload')
const port = process.env.PORT || 3900;

/* Importación de rutas */
const userRoutes = require('./src/routes/userRoutes');
const routes = require('./src/routes/routes');
//const {notFound, errorHandler} =require ('./middleware/errorMiddleware')
/* Sinónimo para llamar a express */
const app = express();

/* Configuración de CORS */
app.use(cors({
    origin: '*', // Puedes especificar un dominio en lugar de * para mayor seguridad
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/* Uso de rutas y middlewares */
app.use(express.json());
app.use('/api', routes);
app.use(upload())
app.use('/uploads', express.static(__dirname + '/uploads'))
//app.use (notFound)
//app.use (errorHandler)
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