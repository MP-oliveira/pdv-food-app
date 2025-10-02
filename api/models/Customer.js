const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  document: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'CPF ou CNPJ'
  },
  document_type: {
    type: DataTypes.ENUM('cpf', 'cnpj'),
    allowNull: true
  },
  loyalty_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Pontos do programa de fidelidade'
  },
  address: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Endereço completo em JSON'
  },
  birth_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_vip: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  total_orders: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  total_spent: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  last_order_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'customers',
  timestamps: true,
  underscored: true
});

// Associações
Customer.associate = (models) => {
  Customer.hasMany(models.Order, {
    foreignKey: 'customer_id',
    as: 'orders'
  });
  
  Customer.hasMany(models.Invoice, {
    foreignKey: 'customer_id',
    as: 'invoices'
  });
};

module.exports = Customer;
