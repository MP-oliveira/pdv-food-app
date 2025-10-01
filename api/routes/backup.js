const express = require('express');
const router = express.Router();
const BackupController = require('../controllers/BackupController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Todas as rotas requerem admin
router.use(authenticateToken);
router.use(requireAdmin);

// Criar backup manual
router.post('/create', BackupController.createBackup);

// Listar backups
router.get('/list', BackupController.listBackups);

// Download de backup
router.get('/download/:filename', BackupController.downloadBackup);

// Estatísticas do banco
router.get('/stats', BackupController.getDatabaseStats);

module.exports = router;

