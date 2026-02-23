const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  /* =========================
     BÁSICO
  ========================= */
  name: {
    type: String,
    required: true
  },

  serviceType: {
    type: String,
    enum: ['passeio', 'hotel'],
    required: true
  },

  walkType: {
    type: String,
    enum: ['individual', 'grupo'],
    default: 'individual'
  },

  duration: {
    type: Number,
    required: true // minutos
  },

  /* =========================
     PREÇOS
  ========================= */
  basePrice: {
    type: Number,
    required: true
  },

  priceByPetSize: {
    pequeno: { type: Number, default: 0 },
    medio: { type: Number, default: 0 },
    grande: { type: Number, default: 0 }
  },

  /* =========================
     DETALHES
  ========================= */
  acceptedPetSizes: {
    type: [String],
    enum: ['pequeno', 'medio', 'grande'],
    required: true
  },

  serviceArea: {
    type: String,
    required: true
  },

  /* =========================
     RELAÇÕES
  ========================= */
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },

  /* =========================
     FUTURO
  ========================= */
  images: [String],
  availableSlots: [String]
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);