const express = require('express');

const Business = require('../models/Business');
const auth = require('../middleware/auth');

const router = express.Router();

/* ======================================================
   CRIAR EMPRESA
====================================================== */
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Apenas owners' });
  }

  const {
    name,
    location,
    phone,
    locations,
    petTypes,
    notes
  } = req.body;

  const business = await Business.create({
    name,
    owner: req.user._id,
    location,
    phone,
    email: req.user.email,
    locations: locations || [],
    petTypes: petTypes || [],
    notes: notes || ''
  });

  req.user.businessId = business._id;
  await req.user.save();

  res.json(business);
});

/* ======================================================
   LISTAR EMPRESAS
====================================================== */
router.get('/', async (req, res) => {
  const businesses = await Business
    .find()
    .populate('services');

  res.json(businesses);
});

/* ======================================================
   EXPORT
====================================================== */
module.exports = router;