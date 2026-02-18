const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, default: 60 },        // duração em minutos
  price: { type: Number, required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true }
});

module.exports = mongoose.model('Service', ServiceSchema);
