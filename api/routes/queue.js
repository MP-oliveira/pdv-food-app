const express = require('express');
const router = express.Router();
const QueueController = require('../controllers/QueueController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// Adicionar à fila
router.post('/', QueueController.addToQueue);

// Listar fila
router.get('/', QueueController.getQueue);

// Chamar cliente
router.patch('/:id/call', QueueController.callCustomer);

// Sentar cliente
router.patch('/:id/seat', QueueController.seatCustomer);

// Remover da fila
router.patch('/:id/remove', QueueController.removeFromQueue);

module.exports = router;

