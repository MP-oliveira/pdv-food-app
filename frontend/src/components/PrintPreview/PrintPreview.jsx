import React, { useRef } from 'react'
import { X, Printer } from 'lucide-react'
import './PrintPreview.css'

const PrintPreview = ({ isOpen, onClose, type, data }) => {
  const printRef = useRef()

  if (!isOpen || !data) return null

  const handlePrint = () => {
    const printContent = printRef.current
    const windowPrint = window.open('', '', 'width=800,height=600')
    
    windowPrint.document.write(`
      <html>
        <head>
          <title>Impressão - ${type === 'kitchen' ? 'Comanda Cozinha' : 'Cupom Cliente'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Courier New', monospace;
              width: 80mm;
              padding: 5mm;
              background: white;
            }
            
            .print-receipt {
              width: 100%;
            }
            
            .receipt-header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            
            .receipt-logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            
            .receipt-title {
              font-size: 18px;
              font-weight: bold;
              margin: 10px 0;
              text-transform: uppercase;
            }
            
            .receipt-info {
              font-size: 11px;
              line-height: 1.4;
            }
            
            .receipt-section {
              margin: 15px 0;
              padding: 10px 0;
              border-bottom: 1px dashed #000;
            }
            
            .section-title {
              font-size: 13px;
              font-weight: bold;
              margin-bottom: 8px;
              text-transform: uppercase;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
              font-size: 12px;
            }
            
            .info-label {
              font-weight: bold;
            }
            
            .receipt-items {
              margin: 15px 0;
            }
            
            .item-row {
              margin: 8px 0;
              font-size: 12px;
            }
            
            .item-header {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              margin-bottom: 3px;
            }
            
            .item-qty {
              font-weight: bold;
              margin-right: 5px;
            }
            
            .item-notes {
              font-size: 11px;
              font-style: italic;
              color: #333;
              margin-left: 15px;
              margin-top: 2px;
            }
            
            .item-prep-time {
              font-size: 11px;
              color: #666;
              margin-left: 15px;
              margin-top: 2px;
            }
            
            .receipt-totals {
              margin-top: 15px;
              padding-top: 10px;
              border-top: 2px solid #000;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
              font-size: 12px;
            }
            
            .total-row.grand-total {
              font-size: 16px;
              font-weight: bold;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 2px solid #000;
            }
            
            .receipt-footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 15px;
              border-top: 2px dashed #000;
              font-size: 11px;
            }
            
            .footer-message {
              margin: 5px 0;
            }
            
            .footer-bold {
              font-weight: bold;
              font-size: 13px;
              margin: 10px 0;
            }
            
            .kitchen-priority {
              background: #000;
              color: #fff;
              padding: 10px;
              text-align: center;
              font-size: 14px;
              font-weight: bold;
              margin: 10px 0;
            }
            
            .kitchen-priority.urgent {
              background: #E74C3C;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 5mm;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    
    windowPrint.document.close()
    windowPrint.focus()
    
    setTimeout(() => {
      windowPrint.print()
      windowPrint.close()
    }, 250)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderKitchenReceipt = () => (
    <div className="print-receipt" ref={printRef}>
      <div className="receipt-header">
        <div className="receipt-logo">🍽️ PDV FOOD APP</div>
        <div className="receipt-title">COMANDA COZINHA</div>
        <div className="receipt-info">
          {formatDateTime(data.createdAt || new Date())}
        </div>
      </div>

      {data.priority === 'urgent' && (
        <div className="kitchen-priority urgent">
          ⚠️ PEDIDO URGENTE ⚠️
        </div>
      )}

      <div className="receipt-section">
        <div className="info-row">
          <span className="info-label">PEDIDO:</span>
          <span>#{data.orderNumber || data.id}</span>
        </div>
        {data.tableNumber && (
          <div className="info-row">
            <span className="info-label">MESA:</span>
            <span>{data.tableNumber}</span>
          </div>
        )}
        {data.customer && (
          <div className="info-row">
            <span className="info-label">CLIENTE:</span>
            <span>{data.customer}</span>
          </div>
        )}
        <div className="info-row">
          <span className="info-label">TIPO:</span>
          <span>{data.type === 'DELIVERY' ? 'DELIVERY' : 'PRESENCIAL'}</span>
        </div>
      </div>

      <div className="receipt-items">
        <div className="section-title">ITENS DO PEDIDO</div>
        {data.items?.map((item, index) => (
          <div key={index} className="item-row">
            <div className="item-header">
              <span>
                <span className="item-qty">{item.quantity}x</span>
                {item.name}
              </span>
            </div>
            {item.notes && (
              <div className="item-notes">OBS: {item.notes}</div>
            )}
            {item.preparationTime && (
              <div className="item-prep-time">
                ⏱️ Tempo estimado: {item.preparationTime} min
              </div>
            )}
          </div>
        ))}
      </div>

      {data.notes && (
        <div className="receipt-section">
          <div className="section-title">OBSERVAÇÕES GERAIS</div>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
            {data.notes}
          </div>
        </div>
      )}

      <div className="receipt-footer">
        <div className="footer-bold">BOA PRODUÇÃO! 👨‍🍳</div>
      </div>
    </div>
  )

  const renderCustomerReceipt = () => (
    <div className="print-receipt" ref={printRef}>
      <div className="receipt-header">
        <div className="receipt-logo">🍽️ PDV FOOD APP</div>
        <div className="receipt-title">CUPOM NÃO FISCAL</div>
        <div className="receipt-info">
          Rua Exemplo, 123 - Centro<br/>
          Tel: (11) 9999-9999<br/>
          CNPJ: 00.000.000/0001-00
        </div>
        <div className="receipt-info" style={{ marginTop: '8px' }}>
          {formatDateTime(data.createdAt || new Date())}
        </div>
      </div>

      <div className="receipt-section">
        <div className="info-row">
          <span className="info-label">PEDIDO:</span>
          <span>#{data.orderNumber || data.id}</span>
        </div>
        {data.tableNumber && (
          <div className="info-row">
            <span className="info-label">MESA:</span>
            <span>{data.tableNumber}</span>
          </div>
        )}
        {data.customer && (
          <div className="info-row">
            <span className="info-label">CLIENTE:</span>
            <span>{data.customer}</span>
          </div>
        )}
        {data.waiter && (
          <div className="info-row">
            <span className="info-label">ATENDENTE:</span>
            <span>{data.waiter}</span>
          </div>
        )}
      </div>

      <div className="receipt-items">
        <div className="section-title">ITENS</div>
        {data.items?.map((item, index) => (
          <div key={index} className="item-row">
            <div className="item-header">
              <span>
                <span className="item-qty">{item.quantity}x</span>
                {item.name}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
            {item.notes && (
              <div className="item-notes">OBS: {item.notes}</div>
            )}
          </div>
        ))}
      </div>

      <div className="receipt-totals">
        <div className="total-row">
          <span>SUBTOTAL:</span>
          <span>{formatCurrency(data.subtotal || 0)}</span>
        </div>
        
        {data.discount > 0 && (
          <div className="total-row">
            <span>DESCONTO:</span>
            <span>- {formatCurrency(data.discount)}</span>
          </div>
        )}
        
        {data.serviceFee > 0 && (
          <div className="total-row">
            <span>TAXA SERVIÇO (10%):</span>
            <span>{formatCurrency(data.serviceFee)}</span>
          </div>
        )}
        
        {data.tip > 0 && (
          <div className="total-row">
            <span>GORJETA:</span>
            <span>{formatCurrency(data.tip)}</span>
          </div>
        )}
        
        <div className="total-row grand-total">
          <span>TOTAL:</span>
          <span>{formatCurrency(data.total || 0)}</span>
        </div>
      </div>

      {data.paymentMethod && (
        <div className="receipt-section">
          <div className="section-title">PAGAMENTO</div>
          <div className="info-row">
            <span className="info-label">FORMA:</span>
            <span>{data.paymentMethod}</span>
          </div>
          {data.paymentMethod === 'Dinheiro' && data.received && (
            <>
              <div className="info-row">
                <span className="info-label">RECEBIDO:</span>
                <span>{formatCurrency(data.received)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">TROCO:</span>
                <span>{formatCurrency(data.received - data.total)}</span>
              </div>
            </>
          )}
        </div>
      )}

      <div className="receipt-footer">
        <div className="footer-message">
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        </div>
        <div className="footer-bold">OBRIGADO PELA PREFERÊNCIA!</div>
        <div className="footer-message">
          Volte sempre! 😊
        </div>
        <div className="footer-message" style={{ marginTop: '10px', fontSize: '10px' }}>
          Este não é um documento fiscal
        </div>
      </div>
    </div>
  )

  return (
    <div className="print-preview-overlay" onClick={onClose}>
      <div className="print-preview-content" onClick={(e) => e.stopPropagation()}>
        <div className="print-preview-header">
          <h2>
            {type === 'kitchen' ? '👨‍🍳 Comanda Cozinha' : '🧾 Cupom Cliente'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="print-preview-body">
          <div className="preview-paper">
            {type === 'kitchen' ? renderKitchenReceipt() : renderCustomerReceipt()}
          </div>
        </div>

        <div className="print-preview-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-print" onClick={handlePrint}>
            <Printer size={20} />
            Imprimir
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrintPreview

