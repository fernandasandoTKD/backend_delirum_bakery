const Class = require('../models/Class'); 

// Obtener todas las clases
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clases' });
  }
};

// Crear una nueva clase
const createClass = async (req, res) => {
  const { name, description, date, time, duration, instructor } = req.body;

  // Validar que todos los campos requeridos estén presentes
  if (!name || !description || !date || !time || !duration || !instructor) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }


  const parsedDate = new Date(date); // Convierte la cadena de fecha en un objeto Date

  // Verificar si la fecha es válida
  if (isNaN(parsedDate.getTime())) { // Comprueba si la fecha es válida
    return res.status(400).json({ message: 'Fecha inválida.' });
  }

  const newClass = new Class({
    name,
    description,
    date: parsedDate,
    time,
    duration,
    instructor,
  });

  try {
    const savedClass = await newClass.save();
    res.status(201).json(savedClass); // Respuesta exitosa
  } catch (error) {
    res.status(400).json({ message: 'Error al crear clase', error });
  }
};

// Actualizar una clase
const updateClass = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedClass = await Class.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedClass) {
      return res.status(404).json({ message: 'Clase no encontrada.' });
    }
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar clase', error });
  }
};

// Eliminar una clase
const deleteClass = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass) {
      return res.status(404).json({ message: 'Clase no encontrada.' });
    }
    res.status(204).json(); // Respuesta exitosa, sin contenido
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar clase', error });
  }
};

// Exportar las funciones del controlador
module.exports = {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
};
