const { WaitingQueue, Table, User } = require('../models');
const { Op } = require('sequelize');

// Adicionar à fila
const addToQueue = async (req, res) => {
  try {
    const { customer_name, customer_phone, party_size, priority, notes } = req.body;
    const created_by_user_id = req.user.id;

    // Gerar número da senha (próximo disponível do dia)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastQueue = await WaitingQueue.findOne({
      where: {
        created_at: { [Op.gte]: today }
      },
      order: [['queue_number', 'DESC']]
    });

    const queue_number = lastQueue ? lastQueue.queue_number + 1 : 1;

    // Calcular tempo estimado (exemplo: 15 min * pessoas na fila)
    const waitingCount = await WaitingQueue.count({
      where: { status: 'waiting' }
    });
    const estimated_wait_time = (waitingCount + 1) * 15;

    const queueEntry = await WaitingQueue.create({
      customer_name,
      customer_phone,
      party_size,
      priority: priority || 'normal',
      notes,
      queue_number,
      estimated_wait_time,
      created_by_user_id,
      status: 'waiting'
    });

    res.json({
      success: true,
      data: queueEntry
    });

  } catch (error) {
    console.error('Erro ao adicionar à fila:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Listar fila
const getQueue = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    } else {
      // Por padrão, apenas aguardando e chamados
      where.status = { [Op.in]: ['waiting', 'called'] };
    }

    const queue = await WaitingQueue.findAll({
      where,
      include: [
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'number', 'name']
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name']
        }
      ],
      order: [
        ['priority', 'DESC'], // VIP primeiro
        ['created_at', 'ASC']  // Mais antigo primeiro
      ]
    });

    res.json({
      success: true,
      data: queue
    });

  } catch (error) {
    console.error('Erro ao buscar fila:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Chamar cliente
const callCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const queueEntry = await WaitingQueue.findByPk(id);
    
    if (!queueEntry) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado na fila'
      });
    }

    await queueEntry.update({
      status: 'called',
      called_at: new Date()
    });

    res.json({
      success: true,
      data: queueEntry
    });

  } catch (error) {
    console.error('Erro ao chamar cliente:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Sentar cliente (alocar mesa)
const seatCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { table_id } = req.body;

    const queueEntry = await WaitingQueue.findByPk(id);
    
    if (!queueEntry) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado na fila'
      });
    }

    await queueEntry.update({
      status: 'seated',
      table_id,
      seated_at: new Date()
    });

    // Marcar mesa como ocupada
    if (table_id) {
      await Table.update(
        { is_available: false },
        { where: { id: table_id } }
      );
    }

    res.json({
      success: true,
      data: queueEntry
    });

  } catch (error) {
    console.error('Erro ao sentar cliente:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Cancelar/remover da fila
const removeFromQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const queueEntry = await WaitingQueue.findByPk(id);
    
    if (!queueEntry) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado na fila'
      });
    }

    const status = reason === 'no_show' ? 'no_show' : 'cancelled';

    await queueEntry.update({
      status,
      notes: queueEntry.notes ? `${queueEntry.notes}\n${reason}` : reason
    });

    res.json({
      success: true,
      data: queueEntry
    });

  } catch (error) {
    console.error('Erro ao remover da fila:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  addToQueue,
  getQueue,
  callCustomer,
  seatCustomer,
  removeFromQueue
};

