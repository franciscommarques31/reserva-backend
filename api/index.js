require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://reserva-frontend.vercel.app'
  ],
  credentials: true
}));

/* MongoDB – compatível com Vercel */
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI)
      .then(m => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro na base de dados' });
  }
});

/* ROTAS */
app.use('/api/auth', require(process.cwd() + '/routes/auth'));
app.use('/api/business', require(process.cwd() + '/routes/business'));
app.use('/api/services', require(process.cwd() + '/routes/services'));
app.use('/api/reservations', require(process.cwd() + '/routes/reservations'));

/* LOCAL */
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Backend local a correr na porta ${PORT}`)
  );
}

module.exports = app;
