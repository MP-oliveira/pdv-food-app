const express = require('express');
const { body, validationResult } = require('express-validator');
const TablesController = require('../controllers/TablesController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/tables - Listar mesas
router.get('/', authenticateToken, TablesController.index);

// POST /api/tables - Criar mesa
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('number').isInt({ min: 1 }),
  body('name').optional().isString(),
  body('capacity').isInt({ min: 1 }),
  body('location').optional().isString()
], TablesController.create);

// PUT /api/tables/:id - Atualizar mesa
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('number').optional().isInt({ min: 1 }),
  body('name').optional().isString(),
  body('capacity').optional().isInt({ min: 1 }),
  body('location').optional().isString(),
  body('is_available').optional().isBoolean(),
  body('is_active').optional().isBoolean()
], TablesController.update);

module.exports = router;
