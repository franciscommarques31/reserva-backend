const express = require('express');

const Reservation = require('../models/Reservation');
const Service = require('../models/Service');
const Business = require('../models/Business');
const auth = require('../middleware/auth');

const router = express.Router();

/* ======================================================
   CRIAR RESERVA (CLIENTE)
====================================================== */
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ error: 'Apenas clientes podem reservar' });
  }

  const {
    serviceId,
    date,
    customerName,
    customerEmail,
    notes
  } = req.body;

  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({ error: 'Serviço não encontrado' });
  }

  const business = await Business.findById(service.business);

  const reservation = await Reservation.create({
    service: service._id,
    business: business._id,
    client: req.user._id,
    customerName,
    customerEmail,
    date,
    notes
  });

  res.json(reservation);
});

/* ======================================================
   LISTAR RESERVAS DO CLIENTE
====================================================== */
router.get('/my', auth, async (req, res) => {
  const reservations = await Reservation
    .find({ client: req.user._id })
    .populate('service', 'name duration price')
    .populate('business', 'name');

  res.json(reservations);
});

/* ======================================================
   LISTAR RESERVAS DO OWNER
====================================================== */
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Apenas owners' });
  }

  const businesses = await Business
    .find({ owner: req.user._id })
    .select('_id');

  const businessIds = businesses.map(b => b._id);

  const reservations = await Reservation
    .find({ business: { $in: businessIds } })
    .populate('service', 'name duration price')
    .populate('client', 'name email');

  res.json(reservations);
});

/* ======================================================
   ALTERAR STATUS DA RESERVA (OWNER)
====================================================== */
router.put('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  const reservation = await Reservation
    .findById(id)
    .populate('business');

  if (!reservation) {
    return res.status(404).json({ error: 'Reserva não encontrada' });
  }

  if (reservation.business.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  reservation.status = status;
  await reservation.save();

  res.json(reservation);
});

/* ======================================================
   MODIFICAR / CANCELAR RESERVA (CLIENTE)
====================================================== */
router.put('/:id', auth, async (req, res) => {
  const { date, notes } = req.body;
  const { id } = req.params;

  const reservation = await Reservation.findById(id);
  if (!reservation) {
    return res.status(404).json({ error: 'Reserva não encontrada' });
  }

  if (reservation.client.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  if (reservation.status !== 'pending') {
    return res.status(400).json({
      error: 'Só reservas pendentes podem ser modificadas'
    });
  }

  if (date) reservation.date = date;
  if (notes) reservation.notes = notes;

  await reservation.save();

  res.json(reservation);
});

/* ======================================================
   EXPORT
====================================================== */
module.exports = router;