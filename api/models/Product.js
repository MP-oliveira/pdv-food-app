const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  cost_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  preparation_time: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Tempo de preparo em minutos'
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  is_digital: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Produto digital (não consome estoque)'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true
});

// Associações
Product.associate = (models) => {
  Product.belongsTo(models.Category, {
    foreignKey: 'category_id',
    as: 'category'
  });
  
  Product.hasOne(models.Stock, {
    foreignKey: 'product_id',
    as: 'stock'
  });
  
  Product.hasMany(models.OrderItem, {
    foreignKey: 'product_id',
    as: 'order_items'
  });
};

module.exports = Product;
