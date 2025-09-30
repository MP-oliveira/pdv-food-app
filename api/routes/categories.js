const express = require('express');
const { body, validationResult } = require('express-validator');
const CategoriesController = require('../controllers/CategoriesController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories - Listar categorias
router.get('/', authenticateToken, CategoriesController.index);

// POST /api/categories - Criar categoria
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name').trim().isLength({ min: 2 }),
  body('description').optional().isString(),
  body('color').optional().isHexColor(),
  body('sort_order').optional().isInt({ min: 0 })
], CategoriesController.create);

// PUT /api/categories/:id - Atualizar categoria
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('name').optional().trim().isLength({ min: 2 }),
  body('description').optional().isString(),
  body('color').optional().isHexColor(),
  body('sort_order').optional().isInt({ min: 0 }),
  body('is_active').optional().isBoolean()
], CategoriesController.update);

// DELETE /api/categories/:id - Deletar categoria
router.delete('/:id', [authenticateToken, requireAdmin], CategoriesController.destroy);

module.exports = router;
