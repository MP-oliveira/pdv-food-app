const { body, query, validationResult } = require('express-validator');
const { Product, Category, Stock } = require('../models');
const { Op } = require('sequelize');

class ProductsController {
  /**
   * @desc Listar produtos com filtros
   * @access Private
   */
  static async index(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        category_id,
        available,
        search,
        page = 1,
        limit = 20
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      if (category_id) where.category_id = category_id;
      if (available !== undefined) where.is_available = available === 'true';
      if (search) {
        where.name = {
          [Op.iLike]: `%${search}%`
        };
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where,
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'color']
          },
          {
            model: Stock,
            as: 'stock',
            attributes: ['current_quantity', 'min_quantity', 'unit']
          }
        ],
        order: [['sort_order', 'ASC'], ['name', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          products,
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
   * @desc Obter produto por ID
   * @access Private
   */
  static async show(req, res) {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [
          {
            model: Category,
            as: 'category'
          },
          {
            model: Stock,
            as: 'stock'
          }
        ]
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Criar novo produto
   * @access Private (Admin)
   */
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const productData = req.body;
      const product = await Product.create(productData);

      // Criar registro de estoque se não for produto digital
      if (!productData.is_digital) {
        await Stock.create({
          product_id: product.id,
          current_quantity: 0,
          min_quantity: 0,
          unit: 'unidade'
        });
      }

      const productWithRelations = await Product.findByPk(product.id, {
        include: [
          {
            model: Category,
            as: 'category'
          },
          {
            model: Stock,
            as: 'stock'
          }
        ]
      });

      res.status(201).json({
        success: true,
        data: productWithRelations
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Atualizar produto
   * @access Private (Admin)
   */
  static async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
      }

      await product.update(req.body);

      const updatedProduct = await Product.findByPk(product.id, {
        include: [
          {
            model: Category,
            as: 'category'
          },
          {
            model: Stock,
            as: 'stock'
          }
        ]
      });

      res.json({
        success: true,
        data: updatedProduct
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Deletar produto
   * @access Private (Admin)
   */
  static async destroy(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
      }

      await product.destroy();

      res.json({
        success: true,
        message: 'Produto deletado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Obter estoque do produto
   * @access Private
   */
  static async getStock(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
      }

      if (product.is_digital) {
        return res.status(400).json({
          success: false,
          error: 'Produtos digitais não possuem estoque'
        });
      }

      const stock = await Stock.findOne({ where: { product_id: product.id } });
      if (!stock) {
        return res.status(404).json({
          success: false,
          error: 'Registro de estoque não encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          product: {
            id: product.id,
            name: product.name
          },
          stock
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
   * @desc Atualizar estoque do produto
   * @access Private (Admin, Cozinha)
   */
  static async updateStock(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
      }

      if (product.is_digital) {
        return res.status(400).json({
          success: false,
          error: 'Produtos digitais não possuem estoque'
        });
      }

      const stock = await Stock.findOne({ where: { product_id: product.id } });
      if (!stock) {
        return res.status(404).json({
          success: false,
          error: 'Registro de estoque não encontrado'
        });
      }

      await stock.update({
        ...req.body,
        last_updated: new Date()
      });

      res.json({
        success: true,
        data: stock
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = ProductsController;
