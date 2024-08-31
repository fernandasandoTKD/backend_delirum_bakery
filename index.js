/* Importación de express y BD */
const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 3200;

/* Sinónimo para llamar a express */
const app = express();

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
