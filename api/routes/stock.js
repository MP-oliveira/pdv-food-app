const express = require('express');
const router = express.Router();
const StockController = require('../controllers/StockController');
const { authenticateToken } = require('../middleware/auth');

// Registrar movimentação manual
router.post('/movement', authenticateToken, StockController.recordMovement);

// Baixar estoque de um pedido
router.post('/decrease-from-order', authenticateToken, StockController.decreaseStockFromOrder);

// Devolver estoque ao cancelar pedido
router.post('/return-from-order', authenticateToken, StockController.returnStockFromOrder);

// Verificar disponibilidade de estoque
router.post('/check-availability', authenticateToken, StockController.checkStockAvailability);

// Buscar histórico de movimentações
router.get('/movements', authenticateToken, StockController.getMovements);

// Produtos com estoque baixo
router.get('/low-stock', authenticateToken, StockController.getLowStockProducts);

// Ajustar estoque (inventário)
router.post('/adjust', authenticateToken, StockController.adjustStock);

module.exports = router;

