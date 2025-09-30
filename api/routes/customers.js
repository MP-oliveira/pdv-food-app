const express = require('express');
const { body, query, validationResult } = require('express-validator');
const CustomersController = require('../controllers/CustomersController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/customers - Listar clientes
router.get('/', [
  authenticateToken,
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], CustomersController.index);

// POST /api/customers - Criar cliente
router.post('/', [
  authenticateToken,
  body('name').trim().isLength({ min: 2 }),
  body('email').optional().isEmail(),
  body('phone').optional().isMobilePhone('pt-BR'),
  body('document').optional().isString(),
  body('document_type').optional().isIn(['cpf', 'cnpj'])
], CustomersController.create);

// PUT /api/customers/:id - Atualizar cliente
router.put('/:id', [
  authenticateToken,
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail(),
  body('phone').optional().isMobilePhone('pt-BR'),
  body('document').optional().isString(),
  body('document_type').optional().isIn(['cpf', 'cnpj'])
], CustomersController.update);

module.exports = router;
