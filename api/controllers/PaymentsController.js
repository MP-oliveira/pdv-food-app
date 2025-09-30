const { body, validationResult } = require('express-validator');
const { Payment, Order } = require('../models');

class PaymentsController {
  /**
   * @desc Processar pagamento
   * @access Private
   */
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { order_id, payment_method, amount } = req.body;

      const order = await Order.findByPk(order_id);
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      const payment = await Payment.create({
        order_id,
        payment_method,
        amount,
        status: 'completed',
        processed_by: req.user.id,
        processed_at: new Date()
      });

      res.status(201).json({
        success: true,
        data: payment
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Listar pagamentos
   * @access Private
   */
  static async index(req, res) {
    try {
      const { order_id, payment_method, status, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      const where = {};

      if (order_id) where.order_id = order_id;
      if (payment_method) where.payment_method = payment_method;
      if (status) where.status = status;

      const { count, rows: payments } = await Payment.findAndCountAll({
        where,
        include: [{
          model: Order,
          as: 'order',
          attributes: ['id', 'order_number', 'total']
        }],
        order: [['processed_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          payments,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Obter pagamento por ID
   * @access Private
   */
  static async show(req, res) {
    try {
      const payment = await Payment.findByPk(req.params.id, {
        include: [{
          model: Order,
          as: 'order',
          attributes: ['id', 'order_number', 'total', 'customer_id']
        }]
      });

      if (!payment) {
        return res.status(404).json({
          success: false,
          error: 'Pagamento não encontrado'
        });
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = PaymentsController;
