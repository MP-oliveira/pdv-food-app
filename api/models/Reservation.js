const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'id'
    }
  },
  customer_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  customer_phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  customer_email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  table_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tables',
      key: 'id'
    }
  },
  reservation_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  reservation_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  guests_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show'),
    allowNull: false,
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  confirmed_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  confirmed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelled_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  cancelled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancellation_reason: {
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
  tableName: 'reservations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associações
Reservation.associate = (models) => {
  Reservation.belongsTo(models.Customer, {
    foreignKey: 'customer_id',
    as: 'customer'
  });
  
  Reservation.belongsTo(models.Table, {
    foreignKey: 'table_id',
    as: 'table'
  });
  
  Reservation.belongsTo(models.User, {
    foreignKey: 'created_by_user_id',
    as: 'createdBy'
  });
  
  Reservation.belongsTo(models.User, {
    foreignKey: 'confirmed_by_user_id',
    as: 'confirmedBy'
  });
  
  Reservation.belongsTo(models.User, {
    foreignKey: 'cancelled_by_user_id',
    as: 'cancelledBy'
  });
};

module.exports = Reservation;

