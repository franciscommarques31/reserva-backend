require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

/* ======================
   MIDDLEWARES
====================== */
app.use(express.json());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://reserva-frontend-topaz.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Preflight (OBRIGATÓRIO)
app.options('*', cors());

/* ======================
   MONGODB (Vercel safe)
====================== */
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then(m => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

/* ======================
   ROTAS
====================== */
app.use('/api/auth', require('../routes/auth'));
app.use('/api/business', require('../routes/business'));
app.use('/api/services', require('../routes/services'));
app.use('/api/reservations', require('../routes/reservations'));

/* ======================
   ROOT (evita Cannot GET /)
====================== */
app.get('/', (req, res) => {
  res.json({ status: 'Backend API running on Vercel' });
});

module.exports = app;
