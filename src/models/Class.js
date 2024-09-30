const mongoose = require('mongoose');


const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
});

// Exportamos el modelo
module.exports = mongoose.model('Class', ClassSchema);
