const express = require('express');
const router = express.Router();
const WaiterController = require('../controllers/WaiterController');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Buscar vendas por garçom
router.get('/sales', WaiterController.getSalesByWaiter);

// Ranking de garçons
router.get('/ranking', WaiterController.getWaitersRanking);

// Relatório individual
router.get('/:id/report', WaiterController.getWaiterReport);

module.exports = router;

