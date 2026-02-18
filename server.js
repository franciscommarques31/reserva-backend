require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ⬅️ importar cors

const app = express();
app.use(express.json());

// ⬅️ permitir requests do frontend
app.use(cors({
  origin: 'http://localhost:5173', // a porta onde corre o React
  credentials: true,               // se for usar cookies
}));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB ligado'))
  .catch(err => console.error(err));

// rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/business', require('./routes/business'));
app.use('/api/services', require('./routes/services'));
app.use('/api/reservations', require('./routes/reservations'));

app.listen(5000, () => console.log('Servidor a correr na porta 5000'));
