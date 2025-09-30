const { query, validationResult } = require('express-validator');
const { Order, Payment, Expense, Product, OrderItem } = require('../models');
const { Op } = require('sequelize');

class ReportsController {
  /**
   * @desc Relatório diário
   * @access Private
   */
  static async getDailyReport(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const date = req.query.date ? new Date(req.query.date) : new Date();
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      // Vendas do dia
      const orders = await Order.findAll({
        where: {
          created_at: {
            [Op.between]: [startDate, endDate]
          },
          status: ['delivered', 'ready']
        },
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });

      // Despesas do dia
      const expenses = await Expense.findAll({
        where: {
          expense_date: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      // Cálculos
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      const profit = totalRevenue - totalExpenses;
      const totalOrders = orders.length;

      // Produtos mais vendidos
      const productSales = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          const productName = item.product.name;
          if (!productSales[productName]) {
            productSales[productName] = { quantity: 0, revenue: 0 };
          }
          productSales[productName].quantity += item.quantity;
          productSales[productName].revenue += parseFloat(item.total_price);
        });
      });

      const topProducts = Object.entries(productSales)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      res.json({
        success: true,
        data: {
          date: date.toISOString().split('T')[0],
          summary: {
            totalRevenue,
            totalExpenses,
            profit,
            totalOrders,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
          },
          topProducts,
          orders: orders.length,
          expenses: expenses.length
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
   * @desc Relatório de vendas por período
   * @access Private
   */
  static async getSalesReport(req, res) {
    try {
      const { start_date, end_date, group_by = 'day' } = req.query;
      
      if (!start_date || !end_date) {
        return res.status(400).json({
          success: false,
          error: 'start_date e end_date são obrigatórios'
        });
      }

      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      endDate.setHours(23, 59, 59, 999);

      const orders = await Order.findAll({
        where: {
          created_at: {
            [Op.between]: [startDate, endDate]
          },
          status: ['delivered', 'ready']
        },
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product'
          }]
        }]
      });

      // Agrupar por período
      const salesByPeriod = {};
      orders.forEach(order => {
        let periodKey;
        if (group_by === 'day') {
          periodKey = order.created_at.toISOString().split('T')[0];
        } else if (group_by === 'hour') {
          periodKey = order.created_at.toISOString().split('T')[1].split(':')[0];
        } else {
          periodKey = order.created_at.toISOString().split('T')[0];
        }

        if (!salesByPeriod[periodKey]) {
          salesByPeriod[periodKey] = {
            totalRevenue: 0,
            totalOrders: 0,
            averageOrderValue: 0
          };
        }

        salesByPeriod[periodKey].totalRevenue += parseFloat(order.total);
        salesByPeriod[periodKey].totalOrders += 1;
      });

      // Calcular média por período
      Object.keys(salesByPeriod).forEach(period => {
        const data = salesByPeriod[period];
        data.averageOrderValue = data.totalOrders > 0 ? data.totalRevenue / data.totalOrders : 0;
      });

      res.json({
        success: true,
        data: {
          period: { start_date, end_date, group_by },
          salesByPeriod,
          totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total), 0),
          totalOrders: orders.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = ReportsController;
