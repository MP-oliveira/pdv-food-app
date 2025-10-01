const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoyaltyProgram = sequelize.define('LoyaltyProgram', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  total_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  available_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  used_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  level: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
    allowNull: false,
    defaultValue: 'bronze'
  },
  total_spent: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  visits_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  cashback_balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Saldo de cashback em reais'
  }
}, {
  tableName: 'loyalty_programs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associações
LoyaltyProgram.associate = (models) => {
  LoyaltyProgram.belongsTo(models.Customer, {
    foreignKey: 'customer_id',
    as: 'customer'
  });
  
  LoyaltyProgram.hasMany(models.LoyaltyTransaction, {
    foreignKey: 'loyalty_program_id',
    as: 'transactions'
  });
};

module.exports = LoyaltyProgram;

