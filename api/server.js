const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize } = require('./models');

// Importar rotas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customers');
const tableRoutes = require('./routes/tables');
const paymentRoutes = require('./routes/payments');
const invoiceRoutes = require('./routes/invoices');
const expenseRoutes = require('./routes/expenses');
const reportRoutes = require('./routes/reports');
const notificationRoutes = require('./routes/notifications');
const cashierRoutes = require('./routes/cashier');
const tabRoutes = require('./routes/tabs');
const stockRoutes = require('./routes/stock');
const waiterRoutes = require('./routes/waiters');
const reservationRoutes = require('./routes/reservations');
const queueRoutes = require('./routes/queue');
const qrcodeRoutes = require('./routes/qrcode');
const loyaltyRoutes = require('./routes/loyalty');
const backupRoutes = require('./routes/backup');
const exportRoutes = require('./routes/export');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet());
app.use(compression());

// Rate limiting (mais permissivo em desenvolvimento)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 1000, // máximo 1000 requests por IP
  message: 'Muitas tentativas de acesso. Tente novamente em 1 minuto.'
});
app.use('/api/', limiter);

// Middlewares básicos
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/cashier', cashierRoutes);
app.use('/api/tabs', tabRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/waiters', waiterRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/qrcode', qrcodeRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/export', exportRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.errors
    });
  }
  
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.errors.map(e => e.message)
    });
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Registro já existe',
      details: err.errors.map(e => e.message)
    });
  }
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Inicializar servidor
async function startServer() {
  try {
    // Testar conexão com o banco
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados Supabase estabelecida com sucesso.');
    
    // Sincronizar modelos (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados com o banco de dados.');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📱 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🗄️  Banco: Supabase PostgreSQL`);
      console.log(`📁 Rotas disponíveis:`);
      console.log(`   - /api/auth`);
      console.log(`   - /api/products`);
      console.log(`   - /api/categories`);
      console.log(`   - /api/orders`);
      console.log(`   - /api/customers`);
      console.log(`   - /api/tables`);
      console.log(`   - /api/payments`);
      console.log(`   - /api/reports`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Recebido SIGTERM, encerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Recebido SIGINT, encerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

startServer();
