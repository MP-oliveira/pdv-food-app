const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TabItem = sequelize.define('TabItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tab_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tabs',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  added_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'preparing', 'ready', 'delivered'),
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  tableName: 'tab_items',
  timestamps: true,
  underscored: true
});

TabItem.associate = (models) => {
  TabItem.belongsTo(models.Tab, {
    foreignKey: 'tab_id',
    as: 'tab'
  });
  
  TabItem.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });
  
  TabItem.belongsTo(models.User, {
    foreignKey: 'added_by_user_id',
    as: 'addedBy'
  });
};

module.exports = TabItem;

