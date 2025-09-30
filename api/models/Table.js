const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Table = sequelize.define('Table', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 4,
    validate: {
      min: 1
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Localização da mesa (ex: salão, varanda)'
  },
  is_available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'tables',
  timestamps: true,
  underscored: true
});

// Associações
Table.associate = (models) => {
  Table.hasMany(models.Order, {
    foreignKey: 'table_id',
    as: 'orders'
  });
};

module.exports = Table;
