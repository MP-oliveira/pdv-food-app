import React, { useState, useEffect } from 'react'
import { X, CreditCard, DollarSign, Smartphone, Wallet, Check } from 'lucide-react'
import './PaymentModal.css'

const PaymentModal = ({ isOpen, onClose, orderTotal, orderItems, onPaymentComplete }) => {
  const [paymentMethods, setPaymentMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [cashAmount, setCashAmount] = useState('')
  const [change, setChange] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  // Formas de pagamento disponíveis (usando cores padrão do projeto)
  const availableMethods = [
    { id: 'money', name: 'Dinheiro', icon: DollarSign, color: 'var(--color-success)' },
    { id: 'debit', name: 'Cartão Débito', icon: CreditCard, color: 'var(--color-primary-blue)' },
    { id: 'credit', name: 'Cartão Crédito', icon: CreditCard, color: 'var(--color-primary-pink)' },
    { id: 'pix', name: 'PIX', icon: Smartphone, color: 'var(--color-success)' },
    { id: 'voucher', name: 'Vale Refeição', icon: Wallet, color: 'var(--color-primary-yellow)' },
  ]

  useEffect(() => {
    if (!isOpen) {
      // Reset ao fechar
      setPaymentMethods([])
      setSelectedMethod(null)
      setCashAmount('')
      setChange(0)
      setShowSuccess(false)
    }
  }, [isOpen])

  // Calcular troco quando valor em dinheiro mudar
  useEffect(() => {
    if (selectedMethod?.id === 'money' && cashAmount) {
      const amount = parseFloat(cashAmount)
      const total = getRemainingAmount()
      setChange(Math.max(0, amount - total))
    } else {
      setChange(0)
    }
  }, [cashAmount, selectedMethod])

  const getRemainingAmount = () => {
    const paid = paymentMethods.reduce((sum, pm) => sum + pm.amount, 0)
    return orderTotal - paid
  }

  const addPaymentMethod = () => {
    if (!selectedMethod) return

    let amount = 0
    
    if (selectedMethod.id === 'money') {
      amount = parseFloat(cashAmount) || 0
    } else {
      amount = getRemainingAmount()
    }

    if (amount <= 0) return

    const newPayment = {
      id: Date.now(),
      method: selectedMethod.name,
      methodId: selectedMethod.id,
      amount: Math.min(amount, getRemainingAmount()),
      icon: selectedMethod.icon,
      color: selectedMethod.color
    }

    setPaymentMethods([...paymentMethods, newPayment])
    setSelectedMethod(null)
    setCashAmount('')
    setChange(0)
  }

  const removePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id))
  }

  const handleFinishPayment = () => {
    const remaining = getRemainingAmount()
    
    if (remaining > 0.01) {
      alert(`Ainda falta pagar R$ ${remaining.toFixed(2)}`)
      return
    }

    // Mostrar animação de sucesso
    setShowSuccess(true)
    
    setTimeout(() => {
      onPaymentComplete({
        methods: paymentMethods,
        total: orderTotal,
        change: change,
        orderItems: orderItems
      })
      onClose()
    }, 1500)
  }

  if (!isOpen) return null

  const remaining = getRemainingAmount()
  const isPaid = remaining <= 0.01

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
        {showSuccess ? (
          <div className="payment-success">
            <div className="success-icon">
              <Check size={80} />
            </div>
            <h2>Pagamento Confirmado!</h2>
            <p>O pedido foi finalizado com sucesso</p>
          </div>
        ) : (
          <>
            <div className="payment-modal-header">
              <h2>Pagamento</h2>
              <button className="close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <div className="payment-modal-body">
              {/* Resumo do pedido */}
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Total do Pedido:</span>
                  <strong>R$ {orderTotal.toFixed(2).replace('.', ',')}</strong>
                </div>
                {paymentMethods.length > 0 && (
                  <div className="summary-row">
                    <span>Já Pago:</span>
                    <span className="paid-amount">
                      R$ {(orderTotal - remaining).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Restante:</span>
                  <strong className={remaining <= 0 ? 'paid' : ''}>
                    R$ {remaining.toFixed(2).replace('.', ',')}
                  </strong>
                </div>
              </div>

              {/* Formas de pagamento adicionadas */}
              {paymentMethods.length > 0 && (
                <div className="added-payments">
                  <h3>Formas de Pagamento</h3>
                  {paymentMethods.map((pm) => (
                    <div key={pm.id} className="payment-item" style={{ borderLeft: `4px solid ${pm.color}` }}>
                      <pm.icon size={20} style={{ color: pm.color }} />
                      <span className="payment-method-name">{pm.method}</span>
                      <span className="payment-amount">
                        R$ {pm.amount.toFixed(2).replace('.', ',')}
                      </span>
                      <button 
                        className="remove-payment-btn"
                        onClick={() => removePaymentMethod(pm.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Seleção de forma de pagamento */}
              {!isPaid && (
                <>
                  <div className="payment-methods-grid">
                    {availableMethods.map((method) => (
                      <button
                        key={method.id}
                        className={`payment-method-btn ${selectedMethod?.id === method.id ? 'selected' : ''}`}
                        onClick={() => setSelectedMethod(method)}
                        style={{
                          '--method-color': method.color
                        }}
                      >
                        <method.icon size={24} />
                        <span>{method.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Input de valor para dinheiro */}
                  {selectedMethod?.id === 'money' && (
                    <div className="cash-input-container">
                      <label>Valor Recebido:</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        autoFocus
                      />
                      {change > 0 && (
                        <div className="change-display">
                          <span>Troco:</span>
                          <strong>R$ {change.toFixed(2).replace('.', ',')}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedMethod && (
                    <button 
                      className="add-payment-btn"
                      onClick={addPaymentMethod}
                    >
                      Adicionar {selectedMethod.name}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="payment-modal-footer">
              <button className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button 
                className="finish-payment-btn"
                onClick={handleFinishPayment}
                disabled={!isPaid}
              >
                {isPaid ? 'Finalizar Pagamento' : `Falta R$ ${remaining.toFixed(2).replace('.', ',')}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentModal
