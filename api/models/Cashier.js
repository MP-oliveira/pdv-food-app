const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cashier = sequelize.define('Cashier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  opened_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  opened_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  initial_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  current_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  closed_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  closed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  final_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  expected_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  difference: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    allowNull: false,
    defaultValue: 'open'
  }
}, {
  tableName: 'cashiers',
  timestamps: true,
  underscored: true
});

Cashier.associate = (models) => {
  Cashier.belongsTo(models.User, {
    foreignKey: 'opened_by_user_id',
    as: 'openedBy'
  });
  
  Cashier.belongsTo(models.User, {
    foreignKey: 'closed_by_user_id',
    as: 'closedBy'
  });
  
  Cashier.hasMany(models.CashierTransaction, {
    foreignKey: 'cashier_id',
    as: 'transactions'
  });
};

module.exports = Cashier;
