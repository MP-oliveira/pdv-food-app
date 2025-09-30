const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'pix', 'voucher'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'ID da transação do gateway de pagamento'
  },
  gateway_response: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Resposta completa do gateway'
  },
  processed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  processed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true
});

// Associações
Payment.associate = (models) => {
  Payment.belongsTo(models.Order, {
    foreignKey: 'order_id',
    as: 'order'
  });
  
  Payment.belongsTo(models.User, {
    foreignKey: 'processed_by',
    as: 'processed_by_user'
  });
};

module.exports = Payment;
