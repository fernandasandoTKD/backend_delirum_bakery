/* Importación de express y BD */
const express = require('express');
const cors = require ('cors');
const mongoose = require('mongoose');
const upload = require ('express-fileupload')
/* Importación de libería para leer archivos .env */
require('dotenv').config();

const port = process.env.PORT || 3900;

/* Importación de rutas */
const userRoutes = require('./src/routes/userRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const authorRoutes = require ('./src/routes/authorRoutes');
const {notFound, errorHandler} =require ('./middleware/errorMiddleware')

/* Sinónimo para llamar a express */
const app = express();

/* Uso de rutas  */
app.use(express.json());
app.use("/api", userRoutes)
app.use("/api/blog", blogRoutes)
app.use("/api/author", authorRoutes)

app.use(upload())
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use (notFound)
app.use (errorHandler)


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
