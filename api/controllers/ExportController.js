const ExcelJS = require('exceljs');
const { Order, OrderItem, Payment, Customer, Product, Expense } = require('../models');
const { Op } = require('sequelize');

// Exportar vendas para Excel
const exportSalesToExcel = async (req, res) => {
  try {
    const { date_from, date_to } = req.query;

    const where = {};
    if (date_from && date_to) {
      where.created_at = {
        [Op.between]: [new Date(date_from), new Date(date_to)]
      };
    }

    const orders = await Order.findAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        {
          model: Customer,
          as: 'customer'
        },
        {
          model: Payment,
          as: 'payment'
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Criar workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vendas');

    // Definir colunas
    worksheet.columns = [
      { header: 'Data', key: 'date', width: 20 },
      { header: 'Pedido', key: 'order_number', width: 15 },
      { header: 'Cliente', key: 'customer', width: 30 },
      { header: 'Mesa', key: 'table', width: 10 },
      { header: 'Tipo', key: 'type', width: 15 },
      { header: 'Subtotal', key: 'subtotal', width: 15 },
      { header: 'Desconto', key: 'discount', width: 15 },
      { header: 'Taxa Serviço', key: 'service_fee', width: 15 },
      { header: 'Total', key: 'total', width: 15 },
      { header: 'Pagamento', key: 'payment_method', width: 20 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    // Estilizar header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Adicionar dados
    orders.forEach(order => {
      worksheet.addRow({
        date: new Date(order.created_at).toLocaleString('pt-BR'),
        order_number: order.order_number,
        customer: order.customer?.name || 'Não informado',
        table: order.table_number || '-',
        type: order.type,
        subtotal: parseFloat(order.subtotal || 0),
        discount: parseFloat(order.discount || 0),
        service_fee: parseFloat(order.service_fee || 0),
        total: parseFloat(order.total || 0),
        payment_method: order.payment?.method || '-',
        status: order.status
      });
    });

    // Adicionar totais no final
    const totalRow = worksheet.addRow({});
    totalRow.getCell('customer').value = 'TOTAL:';
    totalRow.getCell('customer').font = { bold: true };
    totalRow.getCell('subtotal').value = { formula: `SUM(F2:F${orders.length + 1})` };
    totalRow.getCell('discount').value = { formula: `SUM(G2:G${orders.length + 1})` };
    totalRow.getCell('service_fee').value = { formula: `SUM(H2:H${orders.length + 1})` };
    totalRow.getCell('total').value = { formula: `SUM(I2:I${orders.length + 1})` };
    totalRow.font = { bold: true };

    // Formatar números como moeda
    worksheet.getColumn('subtotal').numFmt = 'R$ #,##0.00';
    worksheet.getColumn('discount').numFmt = 'R$ #,##0.00';
    worksheet.getColumn('service_fee').numFmt = 'R$ #,##0.00';
    worksheet.getColumn('total').numFmt = 'R$ #,##0.00';

    // Enviar arquivo
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=vendas_${new Date().toISOString().split('T')[0]}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Erro ao exportar vendas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Exportar DRE (Demonstrativo de Resultado)
const exportDRE = async (req, res) => {
  try {
    const { date_from, date_to } = req.query;

    const dateFilter = {};
    if (date_from && date_to) {
      dateFilter.created_at = {
        [Op.between]: [new Date(date_from), new Date(date_to)]
      };
    }

    // Buscar receitas (vendas)
    const orders = await Order.findAll({ where: dateFilter });
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

    // Buscar despesas
    const expenses = await Expense.findAll({ where: dateFilter });
    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    // Calcular lucro
    const profit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    // Agrupar despesas por categoria
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const cat = expense.category || 'Outros';
      if (!acc[cat]) acc[cat] = 0;
      acc[cat] += parseFloat(expense.amount || 0);
      return acc;
    }, {});

    // Criar Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DRE');

    // Título
    worksheet.mergeCells('A1:C1');
    worksheet.getCell('A1').value = 'DEMONSTRATIVO DE RESULTADO DO EXERCÍCIO (DRE)';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Período
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value = `Período: ${date_from || 'Início'} até ${date_to || 'Hoje'}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    worksheet.addRow([]);

    // Receitas
    worksheet.addRow(['RECEITAS', '', '']);
    worksheet.addRow(['Vendas Brutas', totalRevenue.toFixed(2), '']);
    worksheet.addRow(['', '', '']);

    // Despesas
    worksheet.addRow(['DESPESAS', '', '']);
    Object.entries(expensesByCategory).forEach(([category, amount]) => {
      worksheet.addRow([category, amount.toFixed(2), '']);
    });
    worksheet.addRow(['Total Despesas', totalExpenses.toFixed(2), '']);
    worksheet.addRow(['', '', '']);

    // Resultado
    worksheet.addRow(['RESULTADO', '', '']);
    worksheet.addRow(['Lucro Líquido', profit.toFixed(2), `${profitMargin.toFixed(2)}%`]);

    // Estilizar
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(2).numFmt = 'R$ #,##0.00';
    worksheet.getColumn(3).width = 15;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=DRE_${new Date().toISOString().split('T')[0]}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Erro ao exportar DRE:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Exportar produtos para Excel
const exportProductsToExcel = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: Stock, as: 'stock' }
      ],
      order: [['name', 'ASC']]
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Produtos');

    worksheet.columns = [
      { header: 'Código', key: 'sku', width: 15 },
      { header: 'Nome', key: 'name', width: 30 },
      { header: 'Categoria', key: 'category', width: 20 },
      { header: 'Preço Venda', key: 'price', width: 15 },
      { header: 'Preço Custo', key: 'cost_price', width: 15 },
      { header: 'Margem %', key: 'margin', width: 12 },
      { header: 'Estoque', key: 'stock', width: 12 },
      { header: 'Disponível', key: 'available', width: 12 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF27AE60' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    products.forEach(product => {
      const price = parseFloat(product.price || 0);
      const cost = parseFloat(product.cost_price || 0);
      const margin = cost > 0 ? ((price - cost) / price) * 100 : 0;

      worksheet.addRow({
        sku: product.sku || '-',
        name: product.name,
        category: product.category?.name || '-',
        price: price,
        cost_price: cost,
        margin: margin.toFixed(2),
        stock: product.stock?.current_quantity || 0,
        available: product.is_available ? 'Sim' : 'Não'
      });
    });

    worksheet.getColumn('price').numFmt = 'R$ #,##0.00';
    worksheet.getColumn('cost_price').numFmt = 'R$ #,##0.00';
    worksheet.getColumn('margin').numFmt = '0.00"%"';

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=produtos_${new Date().toISOString().split('T')[0]}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Erro ao exportar produtos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  exportSalesToExcel,
  exportDRE,
  exportProductsToExcel
};

