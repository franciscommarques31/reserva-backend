const express = require('express');
const Service = require('../models/Service');
const Business = require('../models/Business');
const auth = require('../middleware/auth');

const router = express.Router();

/* =========================
   CRIAR SERVIÇO (OWNER)
========================= */
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'Apenas owners' });
    }

    const business = await Business.findById(req.user.businessId);
    if (!business) {
      return res.status(400).json({ error: 'Negócio não encontrado' });
    }

    const {
      name,
      serviceType,
      walkType,
      duration,
      basePrice,
      priceByPetSize,
      acceptedPetSizes,
      serviceArea
    } = req.body;

    const service = await Service.create({
      name,
      serviceType,
      walkType,
      duration,
      basePrice,
      priceByPetSize,
      acceptedPetSizes,
      serviceArea,
      business: business._id
    });

    business.services.push(service._id);
    await business.save();

    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erro ao criar serviço' });
  }
});

/* =========================
   LISTAR SERVIÇOS
========================= */
router.get('/', async (req, res) => {
  const services = await Service.find().populate('business');
  res.json(services);
});

module.exports = router;