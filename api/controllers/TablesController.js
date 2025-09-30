const { body, validationResult } = require('express-validator');
const { Table, Order } = require('../models');

class TablesController {
  /**
   * @desc Listar mesas
   * @access Private
   */
  static async index(req, res) {
    try {
      const tables = await Table.findAll({
        include: [{
          model: Order,
          as: 'orders',
          where: { status: ['pending', 'confirmed', 'preparing'] },
          required: false,
          attributes: ['id', 'order_number', 'status', 'total']
        }],
        order: [['number', 'ASC']]
      });

      res.json({
        success: true,
        data: tables
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Criar mesa
   * @access Private (Admin)
   */
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const table = await Table.create(req.body);
      res.status(201).json({
        success: true,
        data: table
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Atualizar mesa
   * @access Private (Admin)
   */
  static async update(req, res) {
    try {
      const table = await Table.findByPk(req.params.id);
      if (!table) {
        return res.status(404).json({
          success: false,
          error: 'Mesa não encontrada'
        });
      }

      await table.update(req.body);
      res.json({
        success: true,
        data: table
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Obter mesa por ID
   * @access Private
   */
  static async show(req, res) {
    try {
      const table = await Table.findByPk(req.params.id, {
        include: [{
          model: Order,
          as: 'orders',
          attributes: ['id', 'order_number', 'status', 'total', 'created_at'],
          order: [['created_at', 'DESC']]
        }]
      });

      if (!table) {
        return res.status(404).json({
          success: false,
          error: 'Mesa não encontrada'
        });
      }

      res.json({
        success: true,
        data: table
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = TablesController;
