/* Importación de express y BD */
const express = require('express');
const cors = require ('cors');
const mongoose = require('mongoose');

/* Importación de libería para leer archivos .env */
require('dotenv').config();

const port = process.env.PORT || 3900;

/* Importación de rutas */
const userRoutes = require('./src/routes/userRoutes');
const blogRoutes = require('./src/routes/blogRoutes');

/* Sinónimo para llamar a express */
const app = express();

/* Uso de rutas  */
app.use(express.json());
app.use("/api", userRoutes)
app.use("/api_blog", blogRoutes)


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
