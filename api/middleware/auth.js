const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware para verificar autenticação JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token de acesso necessário' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no banco
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Usuário inválido ou inativo' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(500).json({ error: 'Erro na autenticação' });
  }
};

/**
 * Middleware para verificar roles específicas
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acesso negado',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware para verificar se é admin
 */
const requireAdmin = authorize('admin');

/**
 * Middleware para verificar se pode gerenciar pedidos
 */
const canManageOrders = authorize('admin', 'garcom', 'cozinha');

/**
 * Middleware para verificar se pode processar pagamentos
 */
const canProcessPayments = authorize('admin', 'caixa');

/**
 * Middleware para verificar se pode acessar relatórios
 */
const canViewReports = authorize('admin', 'caixa');

module.exports = {
  authenticateToken,
  authorize,
  requireAdmin,
  canManageOrders,
  canProcessPayments,
  canViewReports
};
