const { body, query, validationResult } = require('express-validator');
const { Order, OrderItem, Product, Customer, Table, User, Stock } = require('../models');
const { Op } = require('sequelize');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

class OrdersController {
  /**
   * @desc Listar pedidos
   * @access Private
   */
  static async index(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        status,
        order_type,
        date,
        page = 1,
        limit = 20
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      if (status) where.status = status;
      if (order_type) where.order_type = order_type;
      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        where.created_at = {
          [Op.between]: [startDate, endDate]
        };
      }

      const { count, rows: orders } = await Order.findAndCountAll({
        where,
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
            as: 'user',
            attributes: ['id', 'name']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price']
            }]
          }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          orders,
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
   * @desc Criar pedido
   * @access Private
   */
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { items, customer_id, table_id, order_type, notes, delivery_address } = req.body;

      // Validar produtos e estoque
      const productIds = items.map(item => item.product_id);
      const products = await Product.findAll({
        where: { id: productIds },
        include: [{ model: Stock, as: 'stock' }]
      });

      if (products.length !== productIds.length) {
        return res.status(400).json({
          success: false,
          error: 'Alguns produtos não foram encontrados'
        });
      }

      // Verificar estoque
      for (const item of items) {
        const product = products.find(p => p.id === item.product_id);
        if (!product.is_digital && product.stock && product.stock.current_quantity < item.quantity) {
          return res.status(400).json({
            success: false,
            error: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock.current_quantity}`
          });
        }
      }

      // Gerar número do pedido
      const orderNumber = `PED-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Calcular totais
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = products.find(p => p.id === item.product_id);
        const totalPrice = product.price * item.quantity;
        subtotal += totalPrice;

        orderItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: product.price,
          total_price: totalPrice,
          notes: item.notes
        });
      }

      const serviceFee = order_type === 'delivery' ? subtotal * 0.1 : 0; // 10% taxa de entrega
      const total = subtotal + serviceFee;

      // Criar pedido
      const order = await Order.create({
        order_number: orderNumber,
        customer_id,
        table_id,
        user_id: req.user.id,
        order_type,
        subtotal,
        service_fee: serviceFee,
        total,
        notes,
        delivery_address,
        status: 'pending'
      });

      // Criar itens do pedido
      for (const itemData of orderItems) {
        await OrderItem.create({
          ...itemData,
          order_id: order.id
        });
      }

      // Atualizar estoque
      for (const item of items) {
        const product = products.find(p => p.id === item.product_id);
        if (!product.is_digital && product.stock) {
          await product.stock.update({
            current_quantity: product.stock.current_quantity - item.quantity,
            last_updated: new Date()
          });
        }
      }

      // Enviar notificação realtime para cozinha
      await supabase
        .channel('kitchen-orders')
        .send({
          type: 'broadcast',
          event: 'new-order',
          payload: {
            order_id: order.id,
            order_number: order.order_number,
            items: orderItems,
            order_type,
            table_id,
            created_at: order.created_at
          }
        });

      // Buscar pedido completo
      const completeOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: Customer,
            as: 'customer'
          },
          {
            model: Table,
            as: 'table'
          },
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: Product,
              as: 'product'
            }]
          }
        ]
      });

      res.status(201).json({
        success: true,
        data: completeOrder
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Atualizar status do pedido
   * @access Private
   */
  static async updateStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = await Order.findByPk(req.params.id, {
        include: [{ model: OrderItem, as: 'items' }]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      const { status } = req.body;
      const updateData = { status };

      // Atualizar timestamps específicos
      if (status === 'confirmed') updateData.confirmed_at = new Date();
      if (status === 'preparing') updateData.prepared_at = new Date();
      if (status === 'delivered') updateData.delivered_at = new Date();

      await order.update(updateData);

      // Enviar notificação realtime
      await supabase
        .channel('kitchen-orders')
        .send({
          type: 'broadcast',
          event: 'order-status-updated',
          payload: {
            order_id: order.id,
            order_number: order.order_number,
            status,
            updated_at: order.updated_at
          }
        });

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Obter pedidos para cozinha
   * @access Private
   */
  static async getKitchenOrders(req, res) {
    try {
      const orders = await Order.findAll({
        where: {
          status: ['pending', 'confirmed', 'preparing']
        },
        include: [
          {
            model: Table,
            as: 'table',
            attributes: ['id', 'number', 'name']
          },
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'preparation_time']
            }]
          }
        ],
        order: [['created_at', 'ASC']]
      });

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * @desc Obter pedido por ID
   * @access Private
   */
  static async show(req, res) {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [
          {
            model: Customer,
            as: 'customer'
          },
          {
            model: Table,
            as: 'table'
          },
          {
            model: User,
            as: 'user'
          },
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: Product,
              as: 'product'
            }]
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = OrdersController;
