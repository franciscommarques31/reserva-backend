// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Business = require('../models/Business');

const router = express.Router();

/* =========================
   REGISTO
========================= */
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      surname,
      email,
      password,
      role,
      phone,
      companyName,
      companyLocation
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já registado' });
    }

    if (role === 'owner' && (!companyName || !companyLocation)) {
      return res.status(400).json({
        error: 'Nome e localização da empresa são obrigatórios para owners'
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      surname,
      email,
      password: hash,
      role,
      phone
    });

    let business = null;

    if (role === 'owner') {
      business = await Business.create({
        name: companyName,
        owner: user._id,
        location: companyLocation,
        email: user.email,
        locations: [],
        petTypes: [],
        notes: ''
      });

      user.businessId = business._id;
      await user.save();
    }

    res.json({ user, business });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erro ao registar utilizador' });
  }
});

/* =========================
   LOGIN
========================= */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        businessId: user.businessId || null
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no login' });
  }
});

module.exports = router;
