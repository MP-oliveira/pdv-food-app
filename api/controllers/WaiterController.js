const { Order, OrderItem, User, Payment } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Buscar vendas por garçom
const getSalesByWaiter = async (req, res) => {
  try {
    const { waiter_id, date_from, date_to, status } = req.query;

    const where = {};
    
    if (waiter_id) where.waiter_id = waiter_id;
    if (status) where.status = status;
    
    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) where.created_at[Op.lte] = new Date(date_to);
    }

    const orders = await Order.findAll({
      where,
      include: [
        {
          model: User,
          as: 'waiter',
          attributes: ['id', 'name', 'email']
        },
        {
          model: OrderItem,
          as: 'items'
        },
        {
          model: Payment,
          as: 'payment'
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Calcular totais
    const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
    const totalOrders = orders.length;
    const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

    res.json({
      success: true,
      data: {
        orders,
        summary: {
          total_sales: totalSales,
          total_orders: totalOrders,
          average_ticket: avgTicket
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar vendas por garçom:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Ranking de garçons
const getWaitersRanking = async (req, res) => {
  try {
    const { date_from, date_to, period = 'month' } = req.query;

    let dateFilter = {};
    
    if (date_from && date_to) {
      dateFilter = {
        created_at: {
          [Op.between]: [new Date(date_from), new Date(date_to)]
        }
      };
    } else {
      // Por padrão, mês atual
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
      dateFilter = {
        created_at: {
          [Op.between]: [firstDay, lastDay]
        }
      };
    }

    const ranking = await User.findAll({
      where: {
        role: { [Op.in]: ['garcom', 'admin'] }
      },
      attributes: [
        'id',
        'name',
        'email',
        [sequelize.fn('COUNT', sequelize.col('orders.id')), 'total_orders'],
        [sequelize.fn('SUM', sequelize.col('orders.total')), 'total_sales'],
        [sequelize.fn('AVG', sequelize.col('orders.total')), 'avg_ticket']
      ],
      include: [{
        model: Order,
        as: 'orders',
        attributes: [],
        where: dateFilter,
        required: false
      }],
      group: ['User.id'],
      order: [[sequelize.literal('total_sales'), 'DESC']],
      raw: true
    });

    res.json({
      success: true,
      data: ranking
    });

  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Relatório individual do garçom
const getWaiterReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { date_from, date_to } = req.query;

    const waiter = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'role']
    });

    if (!waiter) {
      return res.status(404).json({
        success: false,
        error: 'Garçom não encontrado'
      });
    }

    let dateFilter = {};
    if (date_from && date_to) {
      dateFilter = {
        created_at: {
          [Op.between]: [new Date(date_from), new Date(date_to)]
        }
      };
    }

    const orders = await Order.findAll({
      where: {
        waiter_id: id,
        ...dateFilter
      },
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      order: [['created_at', 'DESC']]
    });

    // Estatísticas
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    // Vendas por dia
    const salesByDay = orders.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString('pt-BR');
      if (!acc[date]) {
        acc[date] = { count: 0, total: 0 };
      }
      acc[date].count++;
      acc[date].total += parseFloat(order.total || 0);
      return acc;
    }, {});

    // Comissão (exemplo: 5% sobre vendas)
    const commissionRate = 0.05;
    const commission = totalSales * commissionRate;

    res.json({
      success: true,
      data: {
        waiter,
        summary: {
          total_orders: totalOrders,
          total_sales: totalSales,
          average_ticket: avgTicket,
          commission: commission,
          commission_rate: commissionRate
        },
        sales_by_day: salesByDay,
        orders
      }
    });

  } catch (error) {
    console.error('Erro ao buscar relatório do garçom:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getSalesByWaiter,
  getWaitersRanking,
  getWaiterReport
};

