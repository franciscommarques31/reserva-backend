const mongoose = require('mongoose');

/* ======================================================
   BUSINESS SCHEMA
====================================================== */
const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Nome da empresa / pessoa owner
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  location: {
    type: String // Localidade
  },

  phone: {
    type: String // Telemóvel
  },

  email: {
    type: String // Email da empresa (do user)
  },

  locations: [
    String // Locais onde pode trabalhar
  ],

  petTypes: [
    String // Tipos de pets: 'Cão', 'Gato'
  ],

  notes: {
    type: String // Observações
  },

  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    }
  ]
});

/* ======================================================
   EXPORT
====================================================== */
module.exports = mongoose.model('Business', BusinessSchema);