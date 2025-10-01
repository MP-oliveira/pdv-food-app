import React, { useState } from 'react'
import { X, DollarSign, Unlock } from 'lucide-react'
import './OpenCashierModal.css'

const OpenCashierModal = ({ isOpen, onClose, onConfirm }) => {
  const [initialAmount, setInitialAmount] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')

    const amount = parseFloat(initialAmount)
    if (isNaN(amount) || amount < 0) {
      setError('Digite um valor válido')
      return
    }

    onConfirm(amount)
    setInitialAmount('')
  }

  if (!isOpen) return null

  return (
    <div className="open-cashier-modal-overlay" onClick={onClose}>
      <div className="open-cashier-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="open-cashier-modal-header">
          <div className="header-title">
            <Unlock size={24} color="var(--color-success)" />
            <h2>Abrir Caixa</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="open-cashier-modal-body">
          <div className="cashier-info">
            <DollarSign size={48} />
            <p>Para iniciar as operações, informe o valor inicial em dinheiro no caixa</p>
          </div>

          <div className="amount-input-container">
            <label>Valor Inicial:</label>
            <div className="input-wrapper">
              <span className="currency-prefix">R$</span>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="open-cashier-error">
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="open-cashier-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="confirm-open-btn"
            onClick={handleSubmit}
          >
            <Unlock size={18} />
            Abrir Caixa
          </button>
        </div>
      </div>
    </div>
  )
}

export default OpenCashierModal
