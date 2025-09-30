const express = require('express');
const { query, validationResult } = require('express-validator');
const ReportsController = require('../controllers/ReportsController');
const { authenticateToken, canViewReports } = require('../middleware/auth');

const router = express.Router();

// GET /api/reports/daily - Relatório diário
router.get('/daily', [
  authenticateToken,
  canViewReports,
  query('date').optional().isISO8601()
], ReportsController.getDailyReport);

module.exports = router;
