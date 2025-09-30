const express = require('express');
const { body, validationResult } = require('express-validator');
const { Invoice, Order } = require('../models');
const { authenticateToken, canProcessPayments } = require('../middleware/auth');

const router = express.Router();

// POST /api/invoices - Gerar nota fiscal
router.post('/', [
  authenticateToken,
  canProcessPayments,
  body('order_id').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { order_id } = req.body;

    const order = await Order.findByPk(order_id, {
      include: ['customer', 'items']
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      });
    }

    const invoiceNumber = `NF-${Date.now()}`;

    const invoice = await Invoice.create({
      order_id,
      invoice_number: invoiceNumber,
      customer_id: order.customer_id,
      subtotal: order.subtotal,
      tax_amount: order.tax_amount,
      total: order.total,
      status: 'issued',
      issued_at: new Date()
    });

    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
