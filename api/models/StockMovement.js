const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StockMovement = sequelize.define('StockMovement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('IN', 'OUT', 'ADJUSTMENT', 'SALE', 'PURCHASE', 'PRODUCTION', 'WASTE'),
    allowNull: false,
    comment: 'IN=Entrada, OUT=Saída, ADJUSTMENT=Ajuste, SALE=Venda, PURCHASE=Compra, PRODUCTION=Produção, WASTE=Desperdício'
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false
  },
  previous_quantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true
  },
  new_quantity: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Motivo da movimentação'
  },
  reference_type: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Tipo de referência (order, purchase, etc)'
  },
  reference_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID da referência (order_id, purchase_id, etc)'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'stock_movements',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associações
StockMovement.associate = (models) => {
  StockMovement.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });
  
  StockMovement.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = StockMovement;

