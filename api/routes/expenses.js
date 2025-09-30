const express = require('express');
const { body, validationResult } = require('express-validator');
const { Expense } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/expenses - Listar despesas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      order: [['expense_date', 'DESC']]
    });

    res.json({
      success: true,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/expenses - Criar despesa
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('description').trim().isLength({ min: 2 }),
  body('amount').isFloat({ min: 0.01 }),
  body('category').isIn(['ingredients', 'utilities', 'rent', 'salaries', 'marketing', 'equipment', 'other']),
  body('payment_method').isIn(['cash', 'credit_card', 'debit_card', 'pix', 'transfer'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expense = await Expense.create({
      ...req.body,
      user_id: req.user.id
    });

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
