const { body, validationResult } = require('express-validator');
const { Category, Product } = require('../models');

class CategoriesController {
  /**
   * @desc Listar categorias
   * @access Private
   */
  static async index(req, res) {
    try {
      const categories = await Category.findAll({
        include: [{
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'price', 'is_available'],
          where: { is_available: true },
          required: false
        }],
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Criar categoria
   * @access Private (Admin)
   */
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const category = await Category.create(req.body);
      res.status(201).json({
        success: true,
        data: category
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Atualizar categoria
   * @access Private (Admin)
   */
  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoria não encontrada'
        });
      }

      await category.update(req.body);
      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Deletar categoria
   * @access Private (Admin)
   */
  static async destroy(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoria não encontrada'
        });
      }

      await category.destroy();
      res.json({
        success: true,
        message: 'Categoria deletada com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = CategoriesController;
