const express = require('express');
const { body, query, validationResult } = require('express-validator');
const OrdersController = require('../controllers/OrdersController');
const { authenticateToken, canManageOrders } = require('../middleware/auth');

const router = express.Router();

// GET /api/orders - Listar pedidos
router.get('/', [
  authenticateToken,
  canManageOrders,
  query('status').optional().isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']),
  query('order_type').optional().isIn(['dine_in', 'takeaway', 'delivery']),
  query('date').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], OrdersController.index);

// POST /api/orders - Criar pedido
router.post('/', [
  authenticateToken,
  canManageOrders,
  body('items').isArray({ min: 1 }),
  body('items.*.product_id').isInt(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.notes').optional().isString(),
  body('customer_id').optional().isInt(),
  body('table_id').optional().isInt(),
  body('order_type').isIn(['dine_in', 'takeaway', 'delivery']),
  body('notes').optional().isString(),
  body('delivery_address').optional().isObject()
], OrdersController.create);

// PUT /api/orders/:id/status - Atualizar status do pedido
router.put('/:id/status', [
  authenticateToken,
  canManageOrders,
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
], OrdersController.updateStatus);

// GET /api/orders/kitchen - Pedidos para cozinha
router.get('/kitchen', authenticateToken, OrdersController.getKitchenOrders);

module.exports = router;
