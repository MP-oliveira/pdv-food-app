const express = require('express');
const router = express.Router();
const ExportController = require('../controllers/ExportController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.use(authenticateToken);
router.use(requireAdmin);

// Exportar vendas para Excel
router.get('/sales/excel', ExportController.exportSalesToExcel);

// Exportar DRE
router.get('/dre/excel', ExportController.exportDRE);

// Exportar produtos
router.get('/products/excel', ExportController.exportProductsToExcel);

module.exports = router;

