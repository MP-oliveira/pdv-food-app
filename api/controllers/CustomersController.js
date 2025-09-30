const { body, query, validationResult } = require('express-validator');
const { Customer, Order } = require('../models');
const { Op } = require('sequelize');

class CustomersController {
  /**
   * @desc Listar clientes
   * @access Private
   */
  static async index(req, res) {
    try {
      const { search, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      const where = {};

      if (search) {
        where.name = {
          [Op.iLike]: `%${search}%`
        };
      }

      const { count, rows: customers } = await Customer.findAndCountAll({
        where,
        order: [['name', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          customers,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(count / limit)
          }
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
   * @desc Criar cliente
   * @access Private
   */
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const customer = await Customer.create(req.body);
      res.status(201).json({
        success: true,
        data: customer
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Atualizar cliente
   * @access Private
   */
  static async update(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
      }

      await customer.update(req.body);
      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Obter cliente por ID
   * @access Private
   */
  static async show(req, res) {
    try {
      const customer = await Customer.findByPk(req.params.id, {
        include: [{
          model: Order,
          as: 'orders',
          attributes: ['id', 'order_number', 'status', 'total', 'created_at'],
          order: [['created_at', 'DESC']],
          limit: 10
        }]
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = CustomersController;
