const express = require('express');
const Service = require('../models/Service');
const Business = require('../models/Business');
const auth = require('../middleware/auth');

const router = express.Router();

// Criar serviço
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Apenas owners' });

  const business = await Business.findById(req.user.businessId);
  if (!business) return res.status(400).json({ error: 'Negócio não encontrado' });

  const service = await Service.create({
    name: req.body.name,
    duration: req.body.duration || 60,
    price: req.body.price,
    business: business._id
  });

  business.services.push(service._id);
  await business.save();

  res.json(service);
});

// Listar serviços
router.get('/', async (req, res) => {
  const services = await Service.find().populate('business');
  res.json(services);
});

// Apagar serviço
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Apenas owners' });

  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ error: 'Serviço não encontrado' });

  const business = await Business.findById(service.business);
  if (business.owner.toString() !== req.user._id.toString())
    return res.status(403).json({ error: 'Acesso negado' });

  await Service.findByIdAndDelete(req.params.id);

  business.services = business.services.filter(sid => sid.toString() !== req.params.id);
  await business.save();

  res.json({ message: 'Serviço apagado com sucesso' });
});

module.exports = router;
