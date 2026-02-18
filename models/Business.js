const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: { type: String, required: true },          // Nome da empresa/pessoa
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String },                      // Localidade
  phone: { type: String },                         // Telemóvel
  email: { type: String },                         // Email da empresa (do user)
  locations: [String],                             // Locais onde pode trabalhar
  petTypes: [String],                              // Tipos de pets: 'Cão', 'Gato'
  notes: String,                                   // Observações
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }]
});

module.exports = mongoose.model('Business', BusinessSchema);
