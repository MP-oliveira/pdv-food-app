import React, { useState } from 'react'
import { X, Package, Plus, Minus, Edit3 } from 'lucide-react'
import './StockEntryModal.css'

const StockEntryModal = ({ isOpen, onClose, onConfirm, product }) => {
  const [type, setType] = useState('PURCHASE') // PURCHASE, PRODUCTION, ADJUSTMENT
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')

    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Digite uma quantidade válida')
      return
    }

    onConfirm({
      product_id: product.id,
      type,
      quantity: parseFloat(quantity),
      reason: reason || getDefaultReason()
    })

    // Reset
    setQuantity('')
    setReason('')
    setType('PURCHASE')
  }

  const getDefaultReason = () => {
    switch(type) {
      case 'PURCHASE': return 'Compra de mercadoria'
      case 'PRODUCTION': return 'Produção interna'
      case 'ADJUSTMENT': return 'Ajuste de inventário'
      default: return ''
    }
  }

  const getTypeLabel = () => {
    switch(type) {
      case 'PURCHASE': return '📦 Compra'
      case 'PRODUCTION': return '🏭 Produção'
      case 'ADJUSTMENT': return '✏️ Ajuste'
      default: return ''
    }
  }

  if (!isOpen || !product) return null

  return (
    <div className="stock-entry-overlay" onClick={onClose}>
      <div className="stock-entry-content" onClick={(e) => e.stopPropagation()}>
        <div className="stock-entry-header">
          <h2>Entrada de Estoque</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="stock-entry-body">
          <div className="product-info">
            <Package size={20} />
            <div>
              <strong>{product.name}</strong>
              <p>Estoque atual: {product.stock?.current_quantity || 0} {product.stock?.unit || 'un'}</p>
            </div>
          </div>

          <div className="form-group">
            <label>Tipo de Movimentação:</label>
            <div className="type-buttons">
              <button
                className={`type-btn ${type === 'PURCHASE' ? 'active' : ''}`}
                onClick={() => setType('PURCHASE')}
              >
                <Plus size={18} />
                Compra
              </button>
              <button
                className={`type-btn ${type === 'PRODUCTION' ? 'active' : ''}`}
                onClick={() => setType('PRODUCTION')}
              >
                <Package size={18} />
                Produção
              </button>
              <button
                className={`type-btn ${type === 'ADJUSTMENT' ? 'active' : ''}`}
                onClick={() => setType('ADJUSTMENT')}
              >
                <Edit3 size={18} />
                Ajuste
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>
              {type === 'ADJUSTMENT' ? 'Nova Quantidade:' : 'Quantidade a Adicionar:'}
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              placeholder="Digite a quantidade"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Motivo/Observação (Opcional):</label>
            <textarea
              placeholder={`Ex: ${getDefaultReason()}`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>

          {type === 'ADJUSTMENT' && (
            <div className="adjustment-warning">
              <strong>⚠️ Atenção:</strong> O ajuste irá SUBSTITUIR o estoque atual por este valor.
            </div>
          )}

          {error && (
            <div className="stock-entry-error">
              {error}
            </div>
          )}
        </div>

        <div className="stock-entry-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="confirm-stock-btn"
            onClick={handleSubmit}
          >
            {getTypeLabel()} - Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default StockEntryModal

