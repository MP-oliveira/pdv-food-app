const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const TabsController = require('../controllers/TabsController');
const { authenticateToken } = require('../middleware/auth');

// Listar comandas
router.get('/', [
  authenticateToken,
  query('status').optional().isIn(['open', 'closed'])
], TabsController.index);

// Criar nova comanda
router.post('/', [
  authenticateToken,
  body('customer_name').notEmpty().withMessage('Nome do cliente é obrigatório'),
  body('customer_id').optional().isInt(),
  body('table_id').optional().isInt(),
  body('notes').optional()
], TabsController.create);

// Adicionar item à comanda
router.post('/:id/items', [
  authenticateToken,
  body('product_id').isInt().withMessage('ID do produto inválido'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantidade inválida'),
  body('notes').optional()
], TabsController.addItem);

// Transferir comanda
router.put('/:id/transfer', [
  authenticateToken,
  body('new_table_id').isInt().withMessage('ID da mesa inválido')
], TabsController.transfer);

// Juntar comandas
router.post('/merge', [
  authenticateToken,
  body('source_tab_id').isInt().withMessage('ID da comanda de origem inválido'),
  body('target_tab_id').isInt().withMessage('ID da comanda de destino inválido')
], TabsController.merge);

// Fechar comanda
router.put('/:id/close', [
  authenticateToken,
  body('service_fee_percentage').optional().isFloat({ min: 0, max: 100 }),
  body('tip_amount').optional().isFloat({ min: 0 }),
  body('discount_amount').optional().isFloat({ min: 0 })
], TabsController.close);

// Detalhes da comanda
router.get('/:id', authenticateToken, TabsController.show);

module.exports = router;

