const { LoyaltyProgram, LoyaltyTransaction, Customer } = require('../models');

// Configuração do programa (pode ser movido para settings)
const LOYALTY_CONFIG = {
  points_per_real: 1, // 1 ponto a cada R$ 1,00
  cashback_percentage: 0.02, // 2% de cashback
  levels: {
    bronze: { min_spent: 0, multiplier: 1 },
    silver: { min_spent: 500, multiplier: 1.2 },
    gold: { min_spent: 2000, multiplier: 1.5 },
    platinum: { min_spent: 5000, multiplier: 2 }
  }
};

// Criar ou buscar programa de fidelidade do cliente
const getOrCreateLoyaltyProgram = async (req, res) => {
  try {
    const { customer_id } = req.params;

    let program = await LoyaltyProgram.findOne({
      where: { customer_id },
      include: [{
        model: Customer,
        as: 'customer'
      }]
    });

    if (!program) {
      program = await LoyaltyProgram.create({
        customer_id,
        total_points: 0,
        available_points: 0,
        used_points: 0,
        level: 'bronze',
        total_spent: 0,
        visits_count: 0,
        cashback_balance: 0
      });

      program = await LoyaltyProgram.findByPk(program.id, {
        include: [{ model: Customer, as: 'customer' }]
      });
    }

    res.json({
      success: true,
      data: program
    });

  } catch (error) {
    console.error('Erro ao buscar programa:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Adicionar pontos (ao finalizar compra)
const addPoints = async (req, res) => {
  try {
    const { customer_id, amount, order_id, description } = req.body;
    const user_id = req.user.id;

    let program = await LoyaltyProgram.findOne({ where: { customer_id } });

    if (!program) {
      program = await LoyaltyProgram.create({
        customer_id,
        total_points: 0,
        available_points: 0,
        level: 'bronze'
      });
    }

    // Calcular pontos baseado no valor e multiplicador do nível
    const levelMultiplier = LOYALTY_CONFIG.levels[program.level].multiplier;
    const basePoints = Math.floor(amount * LOYALTY_CONFIG.points_per_real);
    const points = Math.floor(basePoints * levelMultiplier);

    // Calcular cashback
    const cashback = amount * LOYALTY_CONFIG.cashback_percentage;

    // Criar transação
    await LoyaltyTransaction.create({
      loyalty_program_id: program.id,
      type: 'earn',
      points,
      amount: cashback,
      description: description || `Compra de R$ ${amount.toFixed(2)}`,
      reference_type: 'order',
      reference_id: order_id,
      user_id,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 ano
    });

    // Atualizar programa
    const newTotalSpent = parseFloat(program.total_spent) + parseFloat(amount);
    const newLevel = calculateLevel(newTotalSpent);

    await program.update({
      total_points: program.total_points + points,
      available_points: program.available_points + points,
      total_spent: newTotalSpent,
      visits_count: program.visits_count + 1,
      cashback_balance: parseFloat(program.cashback_balance) + cashback,
      level: newLevel
    });

    res.json({
      success: true,
      data: {
        points_earned: points,
        cashback_earned: cashback,
        new_level: newLevel,
        program
      }
    });

  } catch (error) {
    console.error('Erro ao adicionar pontos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Resgatar pontos
const redeemPoints = async (req, res) => {
  try {
    const { customer_id, points, description } = req.body;
    const user_id = req.user.id;

    const program = await LoyaltyProgram.findOne({ where: { customer_id } });

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não possui programa de fidelidade'
      });
    }

    if (program.available_points < points) {
      return res.status(400).json({
        success: false,
        error: 'Pontos insuficientes'
      });
    }

    // Criar transação de resgate
    await LoyaltyTransaction.create({
      loyalty_program_id: program.id,
      type: 'redeem',
      points: -points,
      description: description || `Resgate de ${points} pontos`,
      user_id
    });

    // Atualizar programa
    await program.update({
      available_points: program.available_points - points,
      used_points: program.used_points + points
    });

    res.json({
      success: true,
      data: {
        points_redeemed: points,
        remaining_points: program.available_points - points
      }
    });

  } catch (error) {
    console.error('Erro ao resgatar pontos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Resgatar cashback
const redeemCashback = async (req, res) => {
  try {
    const { customer_id, amount } = req.body;

    const program = await LoyaltyProgram.findOne({ where: { customer_id } });

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não possui programa de fidelidade'
      });
    }

    if (parseFloat(program.cashback_balance) < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        error: 'Cashback insuficiente'
      });
    }

    // Atualizar saldo
    await program.update({
      cashback_balance: parseFloat(program.cashback_balance) - parseFloat(amount)
    });

    res.json({
      success: true,
      data: {
        cashback_redeemed: amount,
        remaining_cashback: parseFloat(program.cashback_balance) - parseFloat(amount)
      }
    });

  } catch (error) {
    console.error('Erro ao resgatar cashback:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Histórico de transações
const getTransactions = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const program = await LoyaltyProgram.findOne({ where: { customer_id } });

    if (!program) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não possui programa de fidelidade'
      });
    }

    const transactions = await LoyaltyTransaction.findAll({
      where: { loyalty_program_id: program.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    res.json({
      success: true,
      data: transactions
    });

  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Calcular nível baseado no gasto total
const calculateLevel = (totalSpent) => {
  const spent = parseFloat(totalSpent);
  
  if (spent >= LOYALTY_CONFIG.levels.platinum.min_spent) return 'platinum';
  if (spent >= LOYALTY_CONFIG.levels.gold.min_spent) return 'gold';
  if (spent >= LOYALTY_CONFIG.levels.silver.min_spent) return 'silver';
  return 'bronze';
};

// Ranking de clientes
const getCustomersRanking = async (req, res) => {
  try {
    const ranking = await LoyaltyProgram.findAll({
      include: [{
        model: Customer,
        as: 'customer',
        attributes: ['id', 'name', 'phone']
      }],
      order: [['total_points', 'DESC']],
      limit: 50
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

module.exports = {
  getOrCreateLoyaltyProgram,
  addPoints,
  redeemPoints,
  redeemCashback,
  getTransactions,
  getCustomersRanking,
  LOYALTY_CONFIG
};

