const { body, validationResult } = require('express-validator');
const AuthService = require('../services/authService');

class AuthController {
  /**
   * @desc Fazer login
   * @access Public
   */
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Registrar novo usuário (apenas admin)
   * @access Private (Admin)
   */
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role, phone } = req.body;
      const user = await AuthService.createUser({
        name,
        email,
        password,
        role,
        phone
      });

      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Fazer logout
   * @access Private
   */
  static async logout(req, res) {
    try {
      const result = await AuthService.logout(req.user.supabase_id);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Obter dados do usuário logado
   * @access Private
   */
  static async getProfile(req, res) {
    try {
      res.json({
        success: true,
        data: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          phone: req.user.phone,
          avatar_url: req.user.avatar_url,
          last_login: req.user.last_login
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
   * @desc Atualizar perfil do usuário
   * @access Private
   */
  static async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, phone } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;

      await req.user.update(updateData);

      res.json({
        success: true,
        data: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          phone: req.user.phone,
          avatar_url: req.user.avatar_url
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Alterar senha
   * @access Private
   */
  static async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { newPassword } = req.body;
      const result = await AuthService.updatePassword(req.user.supabase_id, newPassword);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Solicitar reset de senha
   * @access Public
   */
  static async forgotPassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;
      const result = await AuthService.resetPassword(email);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
