/* Importación de express, mongoose, y cors */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Importa cors
const upload = require ('express-fileupload')


/* Importación de rutas */
const userRoutes = require('./src/routes/userRoutes');
const authorRoutes = require( './src/routes/authorRoutes');
const postRoutes = require ('./src/routes/postRoutes');
const routes = require('./src/routes/routes');
const productCategoryRoutes = require('./src/routes/categories');
const productRoutes = require('./src/routes/products');
const shoppingCarRoutes = require('./src/routes/cart');


require('dotenv').config();
//const {notFound, errorHandler} =require ('./middleware/errorMiddleware')
/* Sinónimo para llamar a express */
const app = express();
// Middleware para manejar cookies
app.use(cookieParser());  // Usar cookie-parser


app.use(upload());
/* Importación de librería para leer archivos .env */
const port = process.env.PORT || 3900;

/* Configuración de CORS */
app.use(cors({
    origin: '*', // Puedes especificar un dominio en lugar de * para mayor seguridad
    methods: ['GET', 'POST', 'PUT', 'PATCH' , 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/* Uso de rutas y middlewares */
app.use(express.json());
app.use('/api', routes);
app.use('/uploads', express.static(__dirname + '/uploads'));

//app.use (notFound)
//app.use (errorHandler)
/* Importación de librería para leer archivos .env */


app.use(express.urlencoded({ extended: true }));
app.use(express.json({extended: true}));
app.use(cors({credentials:true, origin: "http://localhost:3900" }));
/* Habilitar puesto de escucha */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
console.log(process.env.MONGO_URI)
/* Conexión a MongoDB */
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error.message);
    });