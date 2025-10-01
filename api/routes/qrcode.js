const express = require('express');
const router = express.Router();
const QRCodeController = require('../controllers/QRCodeController');
const { authenticateToken } = require('../middleware/auth');

// Gerar QR Code para uma mesa específica
router.get('/table/:id', authenticateToken, QRCodeController.generateTableQRCode);

// Gerar QR Codes para todas as mesas
router.get('/all', authenticateToken, QRCodeController.generateAllQRCodes);

module.exports = router;

