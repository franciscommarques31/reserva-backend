const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },       // Primeiro nome
  surname: { type: String, required: true },    // Apelido
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'client'], required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  phone: { type: String },                      // Telefone
  stripeCustomerId: { type: String }            // Para pagamento futuro
});

module.exports = mongoose.model('User', UserSchema);