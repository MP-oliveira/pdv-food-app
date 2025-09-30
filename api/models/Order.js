const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_number: {
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
  table_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tables',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  order_type: {
    type: DataTypes.ENUM('dine_in', 'takeaway', 'delivery'),
    allowNull: false,
    defaultValue: 'dine_in'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  discount_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  service_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  delivery_address: {
    type: DataTypes.JSON,
    allowNull: true
  },
  estimated_time: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Tempo estimado em minutos'
  },
  confirmed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  prepared_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true
});

// Associações
Order.associate = (models) => {
  Order.belongsTo(models.Customer, {
    foreignKey: 'customer_id',
    as: 'customer'
  });
  
  Order.belongsTo(models.Table, {
    foreignKey: 'table_id',
    as: 'table'
  });
  
  Order.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
  
  Order.hasMany(models.OrderItem, {
    foreignKey: 'order_id',
    as: 'items'
  });
  
  Order.hasMany(models.Payment, {
    foreignKey: 'order_id',
    as: 'payments'
  });
  
  Order.hasOne(models.Invoice, {
    foreignKey: 'order_id',
    as: 'invoice'
  });
};

module.exports = Order;
