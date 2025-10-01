const sequelize = require('../config/database');

// Importar todos os modelos
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Stock = require('./Stock');
const Customer = require('./Customer');
const Table = require('./Table');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const Invoice = require('./Invoice');
const Expense = require('./Expense');
const Notification = require('./Notification');
const Cashier = require('./Cashier');
const CashierTransaction = require('./CashierTransaction');
const Tab = require('./Tab');
const TabItem = require('./TabItem');

// Objeto com todos os modelos
const models = {
  User,
  Category,
  Product,
  Stock,
  Customer,
  Table,
  Order,
  OrderItem,
  Payment,
  Invoice,
  Expense,
  Notification,
  Cashier,
  CashierTransaction,
  Tab,
  TabItem,
  sequelize
};

// Configurar associações
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
