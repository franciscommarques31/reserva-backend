const mongoose = require('mongoose');

/* ======================================================
   RESERVATION SCHEMA
====================================================== */
const ReservationSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },

  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },

  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  customerName: {
    type: String,
    required: true
  },

  customerEmail: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },

  notes: {
    type: String
  }
});

/* ======================================================
   EXPORT
====================================================== */
module.exports = mongoose.model('Reservation', ReservationSchema);