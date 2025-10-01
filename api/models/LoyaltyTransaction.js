const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoyaltyTransaction = sequelize.define('LoyaltyTransaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  loyalty_program_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'loyalty_programs',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('earn', 'redeem', 'expire', 'adjustment', 'cashback'),
    allowNull: false,
    comment: 'earn=ganhou, redeem=resgatou, expire=expirou, adjustment=ajuste, cashback=cashback'
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Valor em reais relacionado (para cashback)'
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  reference_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'order, payment, etc'
  },
  reference_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Data de expiração dos pontos'
  }
}, {
  tableName: 'loyalty_transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associações
LoyaltyTransaction.associate = (models) => {
  LoyaltyTransaction.belongsTo(models.LoyaltyProgram, {
    foreignKey: 'loyalty_program_id',
    as: 'loyaltyProgram'
  });
  
  LoyaltyTransaction.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = LoyaltyTransaction;

