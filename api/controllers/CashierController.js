const { Cashier, CashierTransaction, User } = require('../models');
const { validationResult } = require('express-validator');

class CashierController {
  // Verificar status do caixa atual
  static async getStatus(req, res) {
    try {
      const openCashier = await Cashier.findOne({
        where: { status: 'open' },
        include: [
          {
            model: User,
            as: 'openedBy',
            attributes: ['id', 'name', 'email']
          },
          {
            model: CashierTransaction,
            as: 'transactions',
            order: [['created_at', 'DESC']]
          }
        ],
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          status: openCashier ? 'open' : 'closed',
          cashier: openCashier
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Abrir caixa
  static async open(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      // Verificar se já existe caixa aberto
      const existingCashier = await Cashier.findOne({
        where: { status: 'open' }
      });

      if (existingCashier) {
        return res.status(400).json({
          success: false,
          error: 'Já existe um caixa aberto'
        });
      }

      const { initial_amount } = req.body;

      const cashier = await Cashier.create({
        opened_by_user_id: req.user.id,
        opened_at: new Date(),
        initial_amount: parseFloat(initial_amount),
        current_amount: parseFloat(initial_amount),
        status: 'open'
      });

      // Criar transação de abertura
      await CashierTransaction.create({
        cashier_id: cashier.id,
        type: 'opening',
        amount: parseFloat(initial_amount),
        description: 'Abertura de caixa',
        user_id: req.user.id
      });

      const cashierWithRelations = await Cashier.findByPk(cashier.id, {
        include: [
          {
            model: User,
            as: 'openedBy',
            attributes: ['id', 'name', 'email']
          },
          {
            model: CashierTransaction,
            as: 'transactions'
          }
        ]
      });

      res.json({
        success: true,
        data: cashierWithRelations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Adicionar transação (sangria ou reforço)
  static async addTransaction(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const openCashier = await Cashier.findOne({
        where: { status: 'open' }
      });

      if (!openCashier) {
        return res.status(400).json({
          success: false,
          error: 'Não há caixa aberto'
        });
      }

      const { type, amount, description } = req.body;

      // Criar transação
      const transaction = await CashierTransaction.create({
        cashier_id: openCashier.id,
        type,
        amount: parseFloat(amount),
        description,
        user_id: req.user.id
      });

      // Atualizar saldo do caixa
      let newAmount = openCashier.current_amount;
      if (type === 'withdrawal') {
        newAmount -= parseFloat(amount);
      } else if (type === 'deposit') {
        newAmount += parseFloat(amount);
      }

      await openCashier.update({ current_amount: newAmount });

      res.json({
        success: true,
        data: {
          transaction,
          currentAmount: newAmount
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Fechar caixa
  static async close(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const openCashier = await Cashier.findOne({
        where: { status: 'open' },
        include: [{
          model: CashierTransaction,
          as: 'transactions'
        }]
      });

      if (!openCashier) {
        return res.status(400).json({
          success: false,
          error: 'Não há caixa aberto'
        });
      }

      const { final_amount, notes } = req.body;

      // Calcular valores esperados
      const transactions = openCashier.transactions;
      const sales = transactions.filter(t => t.type === 'sale' && t.payment_method === 'money')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const withdrawals = transactions.filter(t => t.type === 'withdrawal')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const deposits = transactions.filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expected_amount = parseFloat(openCashier.initial_amount) + sales - withdrawals + deposits;
      const difference = parseFloat(final_amount) - expected_amount;

      // Criar transação de fechamento
      await CashierTransaction.create({
        cashier_id: openCashier.id,
        type: 'closing',
        amount: parseFloat(final_amount),
        description: `Fechamento de caixa - ${difference >= 0 ? 'Sobra' : 'Falta'}: R$ ${Math.abs(difference).toFixed(2)}`,
        user_id: req.user.id
      });

      // Fechar caixa
      await openCashier.update({
        closed_by_user_id: req.user.id,
        closed_at: new Date(),
        final_amount: parseFloat(final_amount),
        expected_amount,
        difference,
        notes,
        status: 'closed'
      });

      res.json({
        success: true,
        data: {
          cashier: openCashier,
          summary: {
            initial: parseFloat(openCashier.initial_amount),
            sales,
            withdrawals,
            deposits,
            expected: expected_amount,
            final: parseFloat(final_amount),
            difference
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

  // Listar histórico de caixas
  static async getHistory(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Cashier.findAndCountAll({
        where: { status: 'closed' },
        include: [
          {
            model: User,
            as: 'openedBy',
            attributes: ['id', 'name', 'email']
          },
          {
            model: User,
            as: 'closedBy',
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['closed_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          cashiers: rows,
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

  // Obter transações do caixa atual
  static async getTransactions(req, res) {
    try {
      const openCashier = await Cashier.findOne({
        where: { status: 'open' }
      });

      if (!openCashier) {
        return res.status(404).json({
          success: false,
          error: 'Não há caixa aberto'
        });
      }

      const transactions = await CashierTransaction.findAll({
        where: { cashier_id: openCashier.id },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }],
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = CashierController;
