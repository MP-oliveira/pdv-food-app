const { Tab, TabItem, Product, Customer, Table, User } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

class TabsController {
  // Listar comandas abertas
  static async index(req, res) {
    try {
      const { status = 'open' } = req.query;

      const tabs = await Tab.findAll({
        where: { status },
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'name', 'phone']
          },
          {
            model: Table,
            as: 'table',
            attributes: ['id', 'number', 'name']
          },
          {
            model: User,
            as: 'openedBy',
            attributes: ['id', 'name']
          },
          {
            model: TabItem,
            as: 'items',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price']
            }]
          }
        ],
        order: [['opened_at', 'DESC']]
      });

      res.json({
        success: true,
        data: tabs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Abrir nova comanda
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { customer_name, customer_id, table_id, notes } = req.body;

      // Gerar número da comanda
      const tabNumber = `TAB-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      const tab = await Tab.create({
        tab_number: tabNumber,
        customer_name,
        customer_id,
        table_id,
        opened_by_user_id: req.user.id,
        notes,
        status: 'open'
      });

      const tabWithRelations = await Tab.findByPk(tab.id, {
        include: [
          { model: Customer, as: 'customer' },
          { model: Table, as: 'table' },
          { model: User, as: 'openedBy' },
          { model: TabItem, as: 'items' }
        ]
      });

      res.json({
        success: true,
        data: tabWithRelations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Adicionar item à comanda
  static async addItem(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { product_id, quantity, notes } = req.body;

      const tab = await Tab.findByPk(id);
      if (!tab || tab.status === 'closed') {
        return res.status(400).json({
          success: false,
          error: 'Comanda não encontrada ou já fechada'
        });
      }

      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
      }

      const totalPrice = parseFloat(product.price) * quantity;

      const item = await TabItem.create({
        tab_id: id,
        product_id,
        quantity,
        unit_price: product.price,
        total_price: totalPrice,
        notes,
        added_by_user_id: req.user.id
      });

      // Atualizar totais da comanda
      await tab.update({
        subtotal: parseFloat(tab.subtotal) + totalPrice,
        total: parseFloat(tab.subtotal) + totalPrice + parseFloat(tab.service_fee) + parseFloat(tab.tip) - parseFloat(tab.discount)
      });

      res.json({
        success: true,
        data: item
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Transferir comanda para outra mesa
  static async transfer(req, res) {
    try {
      const { id } = req.params;
      const { new_table_id } = req.body;

      const tab = await Tab.findByPk(id);
      if (!tab || tab.status === 'closed') {
        return res.status(400).json({
          success: false,
          error: 'Comanda não encontrada ou já fechada'
        });
      }

      await tab.update({ table_id: new_table_id });

      const updatedTab = await Tab.findByPk(id, {
        include: [
          { model: Table, as: 'table' }
        ]
      });

      res.json({
        success: true,
        data: updatedTab
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Juntar comandas
  static async merge(req, res) {
    try {
      const { source_tab_id, target_tab_id } = req.body;

      const sourceTab = await Tab.findByPk(source_tab_id, {
        include: [{ model: TabItem, as: 'items' }]
      });
      
      const targetTab = await Tab.findByPk(target_tab_id);

      if (!sourceTab || !targetTab) {
        return res.status(404).json({
          success: false,
          error: 'Uma ou ambas as comandas não foram encontradas'
        });
      }

      if (sourceTab.status === 'closed' || targetTab.status === 'closed') {
        return res.status(400).json({
          success: false,
          error: 'Não é possível juntar comandas fechadas'
        });
      }

      // Transferir itens
      for (const item of sourceTab.items) {
        await item.update({ tab_id: target_tab_id });
      }

      // Atualizar totais
      await targetTab.update({
        subtotal: parseFloat(targetTab.subtotal) + parseFloat(sourceTab.subtotal),
        total: parseFloat(targetTab.total) + parseFloat(sourceTab.total)
      });

      // Fechar comanda de origem
      await sourceTab.update({ status: 'closed', closed_at: new Date(), closed_by_user_id: req.user.id });

      res.json({
        success: true,
        data: targetTab
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Fechar comanda
  static async close(req, res) {
    try {
      const { id } = req.params;
      const { service_fee_percentage = 10, tip_amount = 0, discount_amount = 0 } = req.body;

      const tab = await Tab.findByPk(id, {
        include: [{ model: TabItem, as: 'items' }]
      });

      if (!tab || tab.status === 'closed') {
        return res.status(400).json({
          success: false,
          error: 'Comanda não encontrada ou já fechada'
        });
      }

      const serviceFee = (parseFloat(tab.subtotal) * service_fee_percentage) / 100;
      const total = parseFloat(tab.subtotal) + serviceFee + parseFloat(tip_amount) - parseFloat(discount_amount);

      await tab.update({
        service_fee: serviceFee,
        tip: tip_amount,
        discount: discount_amount,
        total,
        status: 'closed',
        closed_at: new Date(),
        closed_by_user_id: req.user.id
      });

      res.json({
        success: true,
        data: tab
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Detalhes da comanda
  static async show(req, res) {
    try {
      const { id } = req.params;

      const tab = await Tab.findByPk(id, {
        include: [
          { model: Customer, as: 'customer' },
          { model: Table, as: 'table' },
          { model: User, as: 'openedBy' },
          { model: User, as: 'closedBy' },
          {
            model: TabItem,
            as: 'items',
            include: [
              { model: Product, as: 'product' },
              { model: User, as: 'addedBy' }
            ]
          }
        ]
      });

      if (!tab) {
        return res.status(404).json({
          success: false,
          error: 'Comanda não encontrada'
        });
      }

      res.json({
        success: true,
        data: tab
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = TabsController;

