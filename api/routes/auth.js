const express = require('express');
const { body, validationResult } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Fazer login
 * @access Public
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], AuthController.login);

/**
 * @route POST /api/auth/register
 * @desc Registrar novo usuário (apenas admin)
 * @access Private (Admin)
 */
router.post('/register', [
  authenticateToken,
  requireAdmin,
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'garcom', 'caixa', 'cozinha'])
], AuthController.register);

/**
 * @route POST /api/auth/logout
 * @desc Fazer logout
 * @access Private
 */
router.post('/logout', authenticateToken, AuthController.logout);

/**
 * @route GET /api/auth/me
 * @desc Obter dados do usuário logado
 * @access Private
 */
router.get('/me', authenticateToken, AuthController.getProfile);

/**
 * @route PUT /api/auth/profile
 * @desc Atualizar perfil do usuário
 * @access Private
 */
router.put('/profile', [
  authenticateToken,
  body('name').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone('pt-BR')
], AuthController.updateProfile);

/**
 * @route POST /api/auth/change-password
 * @desc Alterar senha
 * @access Private
 */
router.post('/change-password', [
  authenticateToken,
  body('currentPassword').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 6 })
], AuthController.changePassword);

/**
 * @route POST /api/auth/forgot-password
 * @desc Solicitar reset de senha
 * @access Public
 */
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], AuthController.forgotPassword);

module.exports = router;
