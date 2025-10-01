const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const CashierController = require('../controllers/CashierController');
const { authenticateToken } = require('../middleware/auth');

// Verificar status do caixa
router.get('/status', 
  authenticateToken,
  CashierController.getStatus
);

// Abrir caixa
router.post('/open', [
  authenticateToken,
  body('initial_amount').isFloat({ min: 0 }).withMessage('Valor inicial inválido')
], CashierController.open);

// Adicionar transação (sangria/reforço)
router.post('/transaction', [
  authenticateToken,
  body('type').isIn(['withdrawal', 'deposit']).withMessage('Tipo inválido'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valor inválido'),
  body('description').notEmpty().withMessage('Descrição é obrigatória')
], CashierController.addTransaction);

// Fechar caixa
router.post('/close', [
  authenticateToken,
  body('final_amount').isFloat({ min: 0 }).withMessage('Valor final inválido'),
  body('notes').optional()
], CashierController.close);

// Histórico de caixas
router.get('/history', [
  authenticateToken,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], CashierController.getHistory);

// Transações do caixa atual
router.get('/transactions',
  authenticateToken,
  CashierController.getTransactions
);

module.exports = router;
