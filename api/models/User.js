const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  supabase_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'garcom', 'caixa', 'cozinha'),
    allowNull: false,
    defaultValue: 'garcom'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

// Associações
User.associate = (models) => {
  User.hasMany(models.Order, {
    foreignKey: 'user_id',
    as: 'orders'
  });
  
  User.hasMany(models.Payment, {
    foreignKey: 'processed_by',
    as: 'processed_payments'
  });
  
  User.hasMany(models.Expense, {
    foreignKey: 'user_id',
    as: 'expenses'
  });
  
  User.hasMany(models.Notification, {
    foreignKey: 'user_id',
    as: 'notifications'
  });
};

module.exports = User;
