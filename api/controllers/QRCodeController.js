const QRCode = require('qrcode');
const { Table } = require('../models');

// Gerar QR Code para mesa
const generateTableQRCode = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findByPk(id);
    
    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Mesa não encontrada'
      });
    }

    // URL do cardápio digital com o ID da mesa
    const menuUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu-digital/${table.id}`;

    // Gerar QR Code como Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      data: {
        table_id: table.id,
        table_number: table.number,
        qr_code: qrCodeDataUrl,
        menu_url: menuUrl
      }
    });

  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Gerar todos os QR Codes
const generateAllQRCodes = async (req, res) => {
  try {
    const tables = await Table.findAll({
      where: { is_active: true },
      order: [['number', 'ASC']]
    });

    const qrCodes = await Promise.all(
      tables.map(async (table) => {
        const menuUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu-digital/${table.id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
          width: 300,
          margin: 2
        });

        return {
          table_id: table.id,
          table_number: table.number,
          table_name: table.name,
          qr_code: qrCodeDataUrl,
          menu_url: menuUrl
        };
      })
    );

    res.json({
      success: true,
      data: qrCodes
    });

  } catch (error) {
    console.error('Erro ao gerar QR Codes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  generateTableQRCode,
  generateAllQRCodes
};

