const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  /**
   * Gerar PDF da nota fiscal
   */
  static async generateInvoicePDF(invoiceData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Cabeçalho
        doc.fontSize(20).text('NOTA FISCAL', 50, 50);
        doc.fontSize(12).text(`Número: ${invoiceData.invoice_number}`, 50, 80);
        doc.text(`Data: ${new Date(invoiceData.created_at).toLocaleDateString('pt-BR')}`, 50, 100);

        // Dados da empresa
        doc.fontSize(14).text('DADOS DA EMPRESA', 50, 130);
        doc.fontSize(10).text('PDV Food App', 50, 150);
        doc.text('CNPJ: 00.000.000/0001-00', 50, 170);
        doc.text('Endereço: Rua Exemplo, 123', 50, 190);

        // Dados do cliente
        if (invoiceData.customer) {
          doc.fontSize(14).text('DADOS DO CLIENTE', 50, 220);
          doc.fontSize(10).text(`Nome: ${invoiceData.customer.name}`, 50, 240);
          if (invoiceData.customer.document) {
            doc.text(`CPF/CNPJ: ${invoiceData.customer.document}`, 50, 260);
          }
        }

        // Itens
        doc.fontSize(14).text('ITENS', 50, 300);
        
        let yPosition = 320;
        invoiceData.order.items.forEach(item => {
          doc.fontSize(10)
            .text(`${item.quantity}x ${item.product.name}`, 50, yPosition)
            .text(`R$ ${item.total_price.toFixed(2)}`, 400, yPosition);
          yPosition += 20;
        });

        // Totais
        yPosition += 20;
        doc.fontSize(12)
          .text(`Subtotal: R$ ${invoiceData.subtotal.toFixed(2)}`, 350, yPosition)
          .text(`Taxa: R$ ${invoiceData.tax_amount.toFixed(2)}`, 350, yPosition + 20)
          .text(`Total: R$ ${invoiceData.total.toFixed(2)}`, 350, yPosition + 40);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Salvar PDF no storage
   */
  static async savePDF(pdfData, filename) {
    const uploadPath = path.join(__dirname, '../uploads/invoices', filename);
    
    // Criar diretório se não existir
    const dir = path.dirname(uploadPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(uploadPath, pdfData);
    return uploadPath;
  }
}

module.exports = PDFService;
