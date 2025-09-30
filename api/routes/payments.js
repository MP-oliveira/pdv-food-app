const express = require('express');
const { body, validationResult } = require('express-validator');
const PaymentsController = require('../controllers/PaymentsController');
const { authenticateToken, canProcessPayments } = require('../middleware/auth');

const router = express.Router();

// POST /api/payments - Processar pagamento
router.post('/', [
  authenticateToken,
  canProcessPayments,
  body('order_id').isInt(),
  body('payment_method').isIn(['cash', 'credit_card', 'debit_card', 'pix', 'voucher']),
  body('amount').isFloat({ min: 0.01 })
], PaymentsController.create);

module.exports = router;
