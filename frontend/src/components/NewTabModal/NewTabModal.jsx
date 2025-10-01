import React, { useState, useEffect } from 'react'
import { X, User, Hash } from 'lucide-react'
import './NewTabModal.css'

const NewTabModal = ({ isOpen, onClose, onConfirm, tables }) => {
  const [customerName, setCustomerName] = useState('')
  const [tableId, setTableId] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')

    if (!customerName.trim()) {
      setError('Digite o nome do cliente')
      return
    }

    onConfirm({
      customer_name: customerName,
      table_id: tableId ? parseInt(tableId) : null,
      notes
    })

    setCustomerName('')
    setTableId('')
    setNotes('')
  }

  if (!isOpen) return null

  return (
    <div className="new-tab-modal-overlay" onClick={onClose}>
      <div className="new-tab-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="new-tab-modal-header">
          <h2>Nova Comanda</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="new-tab-modal-body">
          <div className="form-group">
            <label>
              <User size={18} />
              Nome do Cliente:
            </label>
            <input
              type="text"
              placeholder="Digite o nome"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>
              <Hash size={18} />
              Mesa (Opcional):
            </label>
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
            >
              <option value="">Sem mesa</option>
              {tables && tables.map(table => (
                <option key={table.id} value={table.id}>
                  Mesa {table.number}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Observações (Opcional):</label>
            <textarea
              placeholder="Observações sobre a comanda..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {error && (
            <div className="new-tab-error">
              {error}
            </div>
          )}
        </div>

        <div className="new-tab-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="confirm-new-tab-btn"
            onClick={handleSubmit}
          >
            Abrir Comanda
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewTabModal

