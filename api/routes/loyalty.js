const express = require('express');
const router = express.Router();
const LoyaltyController = require('../controllers/LoyaltyController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// Buscar programa do cliente
router.get('/customer/:customer_id', LoyaltyController.getOrCreateLoyaltyProgram);

// Adicionar pontos
router.post('/add-points', LoyaltyController.addPoints);

// Resgatar pontos
router.post('/redeem-points', LoyaltyController.redeemPoints);

// Resgatar cashback
router.post('/redeem-cashback', LoyaltyController.redeemCashback);

// Histórico de transações
router.get('/customer/:customer_id/transactions', LoyaltyController.getTransactions);

// Ranking de clientes
router.get('/ranking', LoyaltyController.getCustomersRanking);

module.exports = router;

