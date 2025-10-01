const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WaitingQueue = sequelize.define('WaitingQueue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  customer_phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  party_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Número de pessoas'
  },
  status: {
    type: DataTypes.ENUM('waiting', 'called', 'seated', 'cancelled', 'no_show'),
    allowNull: false,
    defaultValue: 'waiting'
  },
  priority: {
    type: DataTypes.ENUM('normal', 'vip', 'reservation'),
    allowNull: false,
    defaultValue: 'normal'
  },
  estimated_wait_time: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Tempo estimado em minutos'
  },
  queue_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Número da senha'
  },
  table_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tables',
      key: 'id'
    }
  },
  called_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  seated_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'waiting_queue',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associações
WaitingQueue.associate = (models) => {
  WaitingQueue.belongsTo(models.Table, {
    foreignKey: 'table_id',
    as: 'table'
  });
  
  WaitingQueue.belongsTo(models.User, {
    foreignKey: 'created_by_user_id',
    as: 'createdBy'
  });
};

module.exports = WaitingQueue;

