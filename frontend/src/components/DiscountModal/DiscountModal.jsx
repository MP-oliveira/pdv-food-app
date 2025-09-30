import React, { useState } from 'react'
import { X, Percent, DollarSign, Tag, AlertCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import './DiscountModal.css'

const DiscountModal = ({ isOpen, onClose, orderTotal, onApplyDiscount }) => {
  const { user } = useAuth()
  const [discountType, setDiscountType] = useState('percentage') // 'percentage' | 'fixed' | 'coupon'
  const [discountValue, setDiscountValue] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [error, setError] = useState('')

  // Limites de desconto por role
  const discountLimits = {
    admin: 100, // 100% ou qualquer valor
    garcom: 10,  // 10% ou R$ 20
    caixa: 15,   // 15% ou R$ 30
    cozinha: 0   // Sem permissão
  }

  const maxDiscount = discountLimits[user?.role] || 0

  const handleReset = () => {
    setDiscountType('percentage')
    setDiscountValue('')
    setCouponCode('')
    setError('')
  }

  const validateDiscount = () => {
    setError('')

    if (maxDiscount === 0) {
      setError('Você não tem permissão para aplicar descontos')
      return false
    }

    if (discountType === 'coupon') {
      if (!couponCode.trim()) {
        setError('Digite um código de cupom')
        return false
      }
      // Validação de cupom (pode ser integrada com backend)
      const validCoupons = {
        'BEMVINDO10': { type: 'percentage', value: 10 },
        'PRIMEIRA15': { type: 'percentage', value: 15 },
        'DESC20': { type: 'fixed', value: 20 },
        'VIP25': { type: 'percentage', value: 25 }
      }

      const coupon = validCoupons[couponCode.toUpperCase()]
      if (!coupon) {
        setError('Cupom inválido ou expirado')
        return false
      }

      return coupon
    }

    const value = parseFloat(discountValue)
    if (isNaN(value) || value <= 0) {
      setError('Digite um valor válido')
      return false
    }

    if (discountType === 'percentage') {
      if (value > maxDiscount) {
        setError(`Seu limite é de ${maxDiscount}%`)
        return false
      }
      if (value > 100) {
        setError('Desconto não pode ser maior que 100%')
        return false
      }
    } else if (discountType === 'fixed') {
      const maxFixed = user?.role === 'admin' ? orderTotal : (user?.role === 'garcom' ? 20 : 30)
      if (value > maxFixed && user?.role !== 'admin') {
        setError(`Seu limite é de R$ ${maxFixed.toFixed(2)}`)
        return false
      }
      if (value > orderTotal) {
        setError('Desconto não pode ser maior que o total')
        return false
      }
    }

    return true
  }

  const calculateDiscount = () => {
    if (discountType === 'coupon') {
      const coupon = validateDiscount()
      if (!coupon) return 0

      if (coupon.type === 'percentage') {
        return (orderTotal * coupon.value) / 100
      } else {
        return Math.min(coupon.value, orderTotal)
      }
    }

    const value = parseFloat(discountValue)
    if (discountType === 'percentage') {
      return (orderTotal * value) / 100
    } else {
      return Math.min(value, orderTotal)
    }
  }

  const handleApplyDiscount = () => {
    const validation = validateDiscount()
    if (!validation && discountType !== 'coupon') return
    if (discountType === 'coupon' && !validation) return

    const discountAmount = calculateDiscount()
    
    onApplyDiscount({
      type: discountType,
      value: discountType === 'coupon' ? couponCode : parseFloat(discountValue),
      amount: discountAmount,
      newTotal: orderTotal - discountAmount
    })

    handleReset()
    onClose()
  }

  if (!isOpen) return null

  const discountAmount = calculateDiscount()
  const newTotal = orderTotal - discountAmount

  return (
    <div className="discount-modal-overlay" onClick={onClose}>
      <div className="discount-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="discount-modal-header">
          <h2>Aplicar Desconto</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="discount-modal-body">
          {/* Resumo do pedido */}
          <div className="discount-summary">
            <div className="summary-row">
              <span>Total Original:</span>
              <strong>R$ {orderTotal.toFixed(2).replace('.', ',')}</strong>
            </div>
            {discountAmount > 0 && (
              <>
                <div className="summary-row discount-row">
                  <span>Desconto:</span>
                  <span className="discount-value">
                    - R$ {discountAmount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="summary-row total">
                  <span>Novo Total:</span>
                  <strong className="new-total">
                    R$ {newTotal.toFixed(2).replace('.', ',')}
                  </strong>
                </div>
              </>
            )}
          </div>

          {/* Informação de permissão */}
          <div className="permission-info">
            <AlertCircle size={16} />
            <span>
              Seu limite de desconto: <strong>
                {maxDiscount === 0 ? 'Sem permissão' : 
                 user?.role === 'admin' ? 'Ilimitado' : 
                 `${maxDiscount}%`}
              </strong>
            </span>
          </div>

          {/* Tipos de desconto */}
          <div className="discount-types">
            <button
              className={`discount-type-btn ${discountType === 'percentage' ? 'active' : ''}`}
              onClick={() => setDiscountType('percentage')}
            >
              <Percent size={20} />
              <span>Percentual</span>
            </button>
            <button
              className={`discount-type-btn ${discountType === 'fixed' ? 'active' : ''}`}
              onClick={() => setDiscountType('fixed')}
            >
              <DollarSign size={20} />
              <span>Valor Fixo</span>
            </button>
            <button
              className={`discount-type-btn ${discountType === 'coupon' ? 'active' : ''}`}
              onClick={() => setDiscountType('coupon')}
            >
              <Tag size={20} />
              <span>Cupom</span>
            </button>
          </div>

          {/* Input de valor */}
          {discountType !== 'coupon' ? (
            <div className="discount-input-container">
              <label>
                {discountType === 'percentage' ? 'Percentual de Desconto:' : 'Valor do Desconto:'}
              </label>
              <div className="input-wrapper">
                {discountType === 'percentage' && <span className="input-prefix">%</span>}
                {discountType === 'fixed' && <span className="input-prefix">R$</span>}
                <input
                  type="number"
                  step={discountType === 'percentage' ? '1' : '0.01'}
                  placeholder={discountType === 'percentage' ? '0' : '0,00'}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <div className="discount-input-container">
              <label>Código do Cupom:</label>
              <input
                type="text"
                placeholder="Digite o código"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                autoFocus
              />
              <div className="coupon-examples">
                <small>Cupons válidos: BEMVINDO10, PRIMEIRA15, DESC20, VIP25</small>
              </div>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="discount-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="discount-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="apply-discount-btn"
            onClick={handleApplyDiscount}
            disabled={maxDiscount === 0}
          >
            Aplicar Desconto
          </button>
        </div>
      </div>
    </div>
  )
}

export default DiscountModal
