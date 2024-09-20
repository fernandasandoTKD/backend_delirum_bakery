/* Importación de express y BD */
const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 3900;

/* Importación de rutas */
const userRoutes = require('./src/routes/userRoutes');
const routes = require('./src/routes/routes');

/* Sinónimo para llamar a express */
const app = express();

/* Uso de rutas  */
app.use(express.json());
app.use("/api", userRoutes)
// Rutas
app.use('/api', routes);app.use('/api/categories', productCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', shoppingCarRoutes);

/* Importación de libería para leer archivos .env */
require('dotenv').config();

/* Habilitar puesto de escucha */
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Conectado a MongoDB');
})
.catch((error) => {
    console.error('Error al conectar a MongoDB:', error.message);
});
