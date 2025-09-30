const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuração para Supabase
const sequelize = new Sequelize(process.env.DATABASE_URL || {
  database: process.env.DB_NAME || 'postgres',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || process.env.SUPABASE_DB_PASSWORD,
  host: process.env.DB_HOST || 'db.urdhfhpvlivbzpfcckcq.supabase.co',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
