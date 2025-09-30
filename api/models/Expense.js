const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  category: {
    type: DataTypes.ENUM('ingredients', 'utilities', 'rent', 'salaries', 'marketing', 'equipment', 'other'),
    allowNull: false,
    defaultValue: 'other'
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'pix', 'transfer'),
    allowNull: false,
    defaultValue: 'cash'
  },
  receipt_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
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
  expense_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'expenses',
  timestamps: true,
  underscored: true
});

// Associações
Expense.associate = (models) => {
  Expense.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = Expense;
