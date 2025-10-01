const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CashierTransaction = sequelize.define('CashierTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cashier_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cashiers',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('opening', 'sale', 'withdrawal', 'deposit', 'closing'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true // 'money', 'debit', 'credit', 'pix', etc
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id'
    }
  }
}, {
  tableName: 'cashier_transactions',
  timestamps: true,
  underscored: true
});

CashierTransaction.associate = (models) => {
  CashierTransaction.belongsTo(models.Cashier, {
    foreignKey: 'cashier_id',
    as: 'cashier'
  });
  
  CashierTransaction.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
  
  CashierTransaction.belongsTo(models.Order, {
    foreignKey: 'order_id',
    as: 'order'
  });
};

module.exports = CashierTransaction;
