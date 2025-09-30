import React, { useState } from 'react'
import { X, AlertTriangle, Lock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import './CancelOrderModal.css'

const CancelOrderModal = ({ 
  isOpen, 
  onClose, 
  order, 
  onConfirmCancel,
  cancelType = 'order' // 'order' | 'item'
}) => {
  const { user } = useAuth()
  const [reason, setReason] = useState('')
  const [managerPassword, setManagerPassword] = useState('')
  const [error, setError] = useState('')
  const [selectedReason, setSelectedReason] = useState('')

  const predefinedReasons = [
    'Cliente desistiu',
    'Produto em falta',
    'Erro no pedido',
    'Demora excessiva',
    'Cliente não aguardou',
    'Outro'
  ]

  // Permissões por role
  const needsManagerApproval = user?.role !== 'admin'

  // Debug
  React.useEffect(() => {
    if (isOpen) {
      console.log('User role:', user?.role)
      console.log('Needs manager approval:', needsManagerApproval)
    }
  }, [isOpen])

  const handleReset = () => {
    setReason('')
    setManagerPassword('')
    setError('')
    setSelectedReason('')
  }

  const handleCancel = () => {
    setError('')

    // Validar justificativa
    const finalReason = selectedReason === 'Outro' ? reason : selectedReason
    if (!finalReason.trim()) {
      setError('Por favor, selecione ou digite um motivo')
      return
    }

    // Validar senha do gerente (se necessário)
    if (needsManagerApproval) {
      if (!managerPassword) {
        setError('Digite a senha do gerente para aprovar o cancelamento')
        return
      }

      // Validação simples de senha (em produção, validar no backend)
      if (managerPassword !== 'admin123') {
        setError('Senha do gerente incorreta')
        return
      }
    }

    // Confirmar cancelamento
    onConfirmCancel({
      reason: finalReason,
      canceledBy: user?.name,
      canceledAt: new Date(),
      approvedBy: needsManagerApproval ? 'Gerente' : user?.name
    })

    handleReset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="cancel-modal-overlay" onClick={onClose}>
      <div className="cancel-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cancel-modal-header">
          <div className="header-title">
            <AlertTriangle size={24} color="#ef4444" />
            <h2>Cancelar {cancelType === 'order' ? 'Pedido' : 'Item'}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="cancel-modal-body">
          {/* Warning */}
          <div className="cancel-warning">
            <AlertTriangle size={18} />
            <div>
              <strong>Atenção!</strong>
              <p>
                {cancelType === 'order' 
                  ? 'Esta ação irá cancelar todo o pedido e não poderá ser desfeita.'
                  : 'Este item será removido do pedido permanentemente.'}
              </p>
            </div>
          </div>

          {/* Order Info */}
          {order && (
            <div className="order-info-cancel">
              <div className="info-row">
                <span>Pedido:</span>
                <strong>#{order.orderNumber || order.id}</strong>
              </div>
              <div className="info-row">
                <span>Cliente:</span>
                <strong>{order.customer}</strong>
              </div>
              {order.tableNumber && (
                <div className="info-row">
                  <span>Mesa:</span>
                  <strong>{order.tableNumber}</strong>
                </div>
              )}
              <div className="info-row">
                <span>Total:</span>
                <strong>R$ {(order.total || 0).toFixed(2).replace('.', ',')}</strong>
              </div>
            </div>
          )}

          {/* Predefined Reasons */}
          <div className="reasons-container">
            <label>Motivo do Cancelamento:</label>
            <div className="reasons-grid">
              {predefinedReasons.map((r) => (
                <button
                  key={r}
                  className={`reason-btn ${selectedReason === r ? 'selected' : ''}`}
                  onClick={() => setSelectedReason(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reason */}
          {selectedReason === 'Outro' && (
            <div className="custom-reason-container">
              <label>Especifique o motivo:</label>
              <textarea
                placeholder="Digite o motivo do cancelamento..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                autoFocus
              />
            </div>
          )}

          {/* Manager Password */}
          {needsManagerApproval && (
            <div className="manager-approval">
              <Lock size={18} />
              <div className="approval-content">
                <label>Senha do Gerente:</label>
                <input
                  type="password"
                  placeholder="Digite a senha do gerente"
                  value={managerPassword}
                  onChange={(e) => setManagerPassword(e.target.value)}
                />
                <small>Necessário aprovação do gerente para cancelamento</small>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="cancel-error">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="cancel-modal-footer">
          <button className="btn-cancel-action" onClick={onClose}>
            Voltar
          </button>
          <button 
            className="btn-confirm-cancel"
            onClick={handleCancel}
          >
            Confirmar Cancelamento
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelOrderModal
