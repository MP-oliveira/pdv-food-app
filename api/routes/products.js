const express = require('express');
const { body, query, validationResult } = require('express-validator');
const ProductsController = require('../controllers/ProductsController');
const { authenticateToken, requireAdmin, canManageOrders } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/products
 * @desc Listar produtos com filtros
 * @access Private
 */
router.get('/', [
  authenticateToken,
  query('category_id').optional().isInt(),
  query('available').optional().isBoolean(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], ProductsController.index);

/**
 * @route GET /api/products/:id
 * @desc Obter produto por ID
 * @access Private
 */
router.get('/:id', authenticateToken, ProductsController.show);

/**
 * @route POST /api/products
 * @desc Criar novo produto
 * @access Private (Admin)
 */
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name').trim().isLength({ min: 2 }),
  body('description').optional().isString(),
  body('price').isFloat({ min: 0 }),
  body('cost_price').optional().isFloat({ min: 0 }),
  body('category_id').isInt(),
  body('preparation_time').optional().isInt({ min: 0 }),
  body('is_available').optional().isBoolean(),
  body('is_digital').optional().isBoolean(),
  body('sort_order').optional().isInt({ min: 0 })
], ProductsController.create);

/**
 * @route PUT /api/products/:id
 * @desc Atualizar produto
 * @access Private (Admin)
 */
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('name').optional().trim().isLength({ min: 2 }),
  body('description').optional().isString(),
  body('price').optional().isFloat({ min: 0 }),
  body('cost_price').optional().isFloat({ min: 0 }),
  body('category_id').optional().isInt(),
  body('preparation_time').optional().isInt({ min: 0 }),
  body('is_available').optional().isBoolean(),
  body('is_digital').optional().isBoolean(),
  body('sort_order').optional().isInt({ min: 0 })
], ProductsController.update);

/**
 * @route DELETE /api/products/:id
 * @desc Deletar produto
 * @access Private (Admin)
 */
router.delete('/:id', [authenticateToken, requireAdmin], ProductsController.destroy);

/**
 * @route GET /api/products/:id/stock
 * @desc Obter estoque do produto
 * @access Private
 */
router.get('/:id/stock', authenticateToken, ProductsController.getStock);

/**
 * @route PUT /api/products/:id/stock
 * @desc Atualizar estoque do produto
 * @access Private (Admin, Cozinha)
 */
router.put('/:id/stock', [
  authenticateToken,
  canManageOrders,
  body('current_quantity').isInt({ min: 0 }),
  body('min_quantity').optional().isInt({ min: 0 }),
  body('max_quantity').optional().isInt({ min: 0 }),
  body('unit').optional().isString()
], ProductsController.updateStock);

module.exports = router;
