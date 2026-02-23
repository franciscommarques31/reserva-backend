require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

/* ======================================================
   CORS MANUAL (LOCAL + VERCEL)
====================================================== */
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'https://reserva-frontend-topaz.vercel.app'
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

/* ======================================================
   MIDDLEWARES GLOBAIS
====================================================== */
app.use(express.json());

/* ======================================================
   MONGODB (SERVERLESS SAFE)
====================================================== */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null
  };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then(mongoose => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

/* ======================================================
   ROTAS
====================================================== */
app.use('/api/auth', require('../routes/auth'));
app.use('/api/business', require('../routes/business'));
app.use('/api/services', require('../routes/services'));
app.use('/api/reservations', require('../routes/reservations'));

/* ======================================================
   ROOT (APENAS TESTE)
====================================================== */
app.get('/', (req, res) => {
  res.json({ status: 'Backend API running' });
});

/* ======================================================
   EXPORT PARA VERCEL
====================================================== */
module.exports = app;