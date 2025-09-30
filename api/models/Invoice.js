const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
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
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'issued', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft'
  },
  issued_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  pdf_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  xml_data: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Dados XML da nota fiscal'
  }
}, {
  tableName: 'invoices',
  timestamps: true,
  underscored: true
});

// Associações
Invoice.associate = (models) => {
  Invoice.belongsTo(models.Order, {
    foreignKey: 'order_id',
    as: 'order'
  });
  
  Invoice.belongsTo(models.Customer, {
    foreignKey: 'customer_id',
    as: 'customer'
  });
};

module.exports = Invoice;
