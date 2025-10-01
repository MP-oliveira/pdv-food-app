const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/ReservationController');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Criar reserva
router.post('/', ReservationController.createReservation);

// Listar reservas
router.get('/', ReservationController.getReservations);

// Confirmar reserva
router.patch('/:id/confirm', ReservationController.confirmReservation);

// Cancelar reserva
router.patch('/:id/cancel', ReservationController.cancelReservation);

// Marcar como no-show
router.patch('/:id/no-show', ReservationController.markNoShow);

// Marcar como completada
router.patch('/:id/complete', ReservationController.completeReservation);

module.exports = router;

