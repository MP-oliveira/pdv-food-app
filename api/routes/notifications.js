const express = require('express');
const { body, validationResult } = require('express-validator');
const { Notification } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/notifications - Listar notificações do usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        user_id: req.user.id
      },
      order: [['created_at', 'DESC']],
      limit: 50
    });

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/notifications/:id/read - Marcar como lida
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notificação não encontrada'
      });
    }

    await notification.update({
      is_read: true,
      read_at: new Date()
    });

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
