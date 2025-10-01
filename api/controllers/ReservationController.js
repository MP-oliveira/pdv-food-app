const { Reservation, Customer, Table, User } = require('../models');
const { Op } = require('sequelize');

// Criar reserva
const createReservation = async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      table_id,
      reservation_date,
      reservation_time,
      guests_count,
      notes
    } = req.body;

    const created_by_user_id = req.user.id;

    // Verificar se mesa já está reservada nesse horário
    if (table_id) {
      const existingReservation = await Reservation.findOne({
        where: {
          table_id,
          reservation_date,
          reservation_time,
          status: { [Op.in]: ['pending', 'confirmed'] }
        }
      });

      if (existingReservation) {
        return res.status(400).json({
          success: false,
          error: 'Mesa já reservada para este horário'
        });
      }
    }

    const reservation = await Reservation.create({
      customer_name,
      customer_phone,
      customer_email,
      table_id,
      reservation_date,
      reservation_time,
      guests_count: guests_count || 2,
      notes,
      created_by_user_id,
      status: 'pending'
    });

    res.json({
      success: true,
      data: reservation
    });

  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Listar reservas
const getReservations = async (req, res) => {
  try {
    const { date, status, table_id } = req.query;

    const where = {};
    
    if (date) where.reservation_date = date;
    if (status) where.status = status;
    if (table_id) where.table_id = table_id;

    const reservations = await Reservation.findAll({
      where,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'phone', 'email']
        },
        {
          model: Table,
          as: 'table',
          attributes: ['id', 'number', 'name', 'capacity']
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name']
        }
      ],
      order: [['reservation_date', 'ASC'], ['reservation_time', 'ASC']]
    });

    res.json({
      success: true,
      data: reservations
    });

  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Confirmar reserva
const confirmReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const confirmed_by_user_id = req.user.id;

    const reservation = await Reservation.findByPk(id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reserva não encontrada'
      });
    }

    if (reservation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Apenas reservas pendentes podem ser confirmadas'
      });
    }

    await reservation.update({
      status: 'confirmed',
      confirmed_by_user_id,
      confirmed_at: new Date()
    });

    res.json({
      success: true,
      data: reservation
    });

  } catch (error) {
    console.error('Erro ao confirmar reserva:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Cancelar reserva
const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const cancelled_by_user_id = req.user.id;

    const reservation = await Reservation.findByPk(id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reserva não encontrada'
      });
    }

    if (['cancelled', 'completed'].includes(reservation.status)) {
      return res.status(400).json({
        success: false,
        error: 'Esta reserva não pode ser cancelada'
      });
    }

    await reservation.update({
      status: 'cancelled',
      cancelled_by_user_id,
      cancelled_at: new Date(),
      cancellation_reason: reason
    });

    res.json({
      success: true,
      data: reservation
    });

  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Marcar como no-show (cliente não compareceu)
const markNoShow = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reserva não encontrada'
      });
    }

    await reservation.update({
      status: 'no_show'
    });

    res.json({
      success: true,
      data: reservation
    });

  } catch (error) {
    console.error('Erro ao marcar no-show:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Marcar como completada
const completeReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        error: 'Reserva não encontrada'
      });
    }

    await reservation.update({
      status: 'completed'
    });

    res.json({
      success: true,
      data: reservation
    });

  } catch (error) {
    console.error('Erro ao completar reserva:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createReservation,
  getReservations,
  confirmReservation,
  cancelReservation,
  markNoShow,
  completeReservation
};

