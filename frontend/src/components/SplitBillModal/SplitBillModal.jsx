import React, { useState, useEffect } from 'react'
import { X, Users, DollarSign, User, Check } from 'lucide-react'
import './SplitBillModal.css'

const SplitBillModal = ({ isOpen, onClose, orderTotal, orderItems, onSplitComplete }) => {
  const [splitType, setSplitType] = useState('equal') // 'equal' | 'items' | 'custom'
  const [numberOfPeople, setNumberOfPeople] = useState(2)
  const [customSplits, setCustomSplits] = useState([])
  const [itemAssignments, setItemAssignments] = useState({})
  const [people, setPeople] = useState([])

  useEffect(() => {
    if (isOpen) {
      // Inicializar pessoas
      const initialPeople = Array.from({ length: numberOfPeople }, (_, i) => ({
        id: i + 1,
        name: `Pessoa ${i + 1}`,
        amount: 0,
        items: []
      }))
      setPeople(initialPeople)

      // Inicializar custom splits
      if (splitType === 'custom') {
        setCustomSplits(initialPeople.map(p => ({ id: p.id, amount: '' })))
      }

      // Inicializar item assignments
      if (splitType === 'items') {
        const assignments = {}
        orderItems.forEach(item => {
          assignments[item.id] = Array(item.quantity).fill(null)
        })
        setItemAssignments(assignments)
      }
    }
  }, [isOpen, numberOfPeople, splitType])

  const calculateEqualSplit = () => {
    return orderTotal / numberOfPeople
  }

  const calculateItemsSplit = () => {
    const peopleAmounts = {}
    
    Object.keys(itemAssignments).forEach(itemId => {
      const item = orderItems.find(i => i.id === parseInt(itemId))
      const assignments = itemAssignments[itemId]
      
      assignments.forEach(personId => {
        if (personId) {
          if (!peopleAmounts[personId]) peopleAmounts[personId] = 0
          peopleAmounts[personId] += parseFloat(item.price)
        }
      })
    })

    return people.map(p => ({
      ...p,
      amount: peopleAmounts[p.id] || 0
    }))
  }

  const calculateCustomSplit = () => {
    return people.map((p, i) => ({
      ...p,
      amount: parseFloat(customSplits[i]?.amount || 0)
    }))
  }

  const assignItemToPerson = (itemId, index, personId) => {
    setItemAssignments(prev => ({
      ...prev,
      [itemId]: prev[itemId].map((id, i) => i === index ? personId : id)
    }))
  }

  const handleConfirmSplit = () => {
    let finalSplits = []

    if (splitType === 'equal') {
      const amountPerPerson = calculateEqualSplit()
      finalSplits = people.map(p => ({ ...p, amount: amountPerPerson }))
    } else if (splitType === 'items') {
      finalSplits = calculateItemsSplit()
    } else if (splitType === 'custom') {
      finalSplits = calculateCustomSplit()
    }

    // Validar se total bate
    const totalSplit = finalSplits.reduce((sum, p) => sum + p.amount, 0)
    if (Math.abs(totalSplit - orderTotal) > 0.01) {
      alert(`Atenção: A soma das partes (R$ ${totalSplit.toFixed(2)}) não corresponde ao total (R$ ${orderTotal.toFixed(2)})`)
      return
    }

    onSplitComplete(finalSplits)
    onClose()
  }

  if (!isOpen) return null

  const getSplitPreview = () => {
    if (splitType === 'equal') {
      const amount = calculateEqualSplit()
      return people.map(p => ({ ...p, amount }))
    } else if (splitType === 'items') {
      return calculateItemsSplit()
    } else if (splitType === 'custom') {
      return calculateCustomSplit()
    }
    return []
  }

  const preview = getSplitPreview()
  const totalPreview = preview.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="split-modal-overlay" onClick={onClose}>
      <div className="split-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="split-modal-header">
          <h2>Dividir Conta</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="split-modal-body">
          {/* Total */}
          <div className="split-total-box">
            <span>Total da Conta:</span>
            <strong>R$ {orderTotal.toFixed(2).replace('.', ',')}</strong>
          </div>

          {/* Split Types */}
          <div className="split-types">
            <button
              className={`split-type-btn ${splitType === 'equal' ? 'active' : ''}`}
              onClick={() => setSplitType('equal')}
            >
              <Users size={20} />
              <span>Dividir Igualmente</span>
            </button>
            <button
              className={`split-type-btn ${splitType === 'items' ? 'active' : ''}`}
              onClick={() => setSplitType('items')}
            >
              <User size={20} />
              <span>Por Pessoa</span>
            </button>
            <button
              className={`split-type-btn ${splitType === 'custom' ? 'active' : ''}`}
              onClick={() => setSplitType('custom')}
            >
              <DollarSign size={20} />
              <span>Personalizado</span>
            </button>
          </div>

          {/* Number of People */}
          {splitType === 'equal' && (
            <div className="people-counter">
              <label>Número de Pessoas:</label>
              <div className="counter-controls">
                <button onClick={() => setNumberOfPeople(Math.max(2, numberOfPeople - 1))}>-</button>
                <span>{numberOfPeople}</span>
                <button onClick={() => setNumberOfPeople(Math.min(10, numberOfPeople + 1))}>+</button>
              </div>
            </div>
          )}

          {/* Item Assignment */}
          {splitType === 'items' && (
            <div className="items-assignment">
              <label>Atribuir Itens:</label>
              {orderItems.map(item => (
                <div key={item.id} className="item-assign-row">
                  <div className="item-info-split">
                    <strong>{item.name}</strong>
                    <span>R$ {parseFloat(item.price).toFixed(2)}</span>
                  </div>
                  <div className="item-quantities">
                    {Array.from({ length: item.quantity }, (_, index) => (
                      <select
                        key={index}
                        value={itemAssignments[item.id]?.[index] || ''}
                        onChange={(e) => assignItemToPerson(item.id, index, parseInt(e.target.value))}
                      >
                        <option value="">Não atribuído</option>
                        {people.map(p => (
                          <option key={p.id} value={p.id}>Pessoa {p.id}</option>
                        ))}
                      </select>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Custom Splits */}
          {splitType === 'custom' && (
            <div className="custom-splits">
              <label>Valores por Pessoa:</label>
              {people.map((person, index) => (
                <div key={person.id} className="custom-split-row">
                  <span>Pessoa {person.id}:</span>
                  <div className="input-wrapper">
                    <span className="currency-prefix">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={customSplits[index]?.amount || ''}
                      onChange={(e) => {
                        const newSplits = [...customSplits]
                        newSplits[index] = { id: person.id, amount: e.target.value }
                        setCustomSplits(newSplits)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Preview */}
          <div className="split-preview">
            <h3>Resumo da Divisão:</h3>
            <div className="preview-list">
              {preview.map(person => (
                <div key={person.id} className="preview-item">
                  <div className="preview-person">
                    <User size={18} />
                    <span>Pessoa {person.id}</span>
                  </div>
                  <span className="preview-amount">
                    R$ {person.amount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>
            <div className="preview-total">
              <span>Total Dividido:</span>
              <strong className={Math.abs(totalPreview - orderTotal) > 0.01 ? 'error' : 'success'}>
                R$ {totalPreview.toFixed(2).replace('.', ',')}
              </strong>
            </div>
          </div>
        </div>

        <div className="split-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="confirm-split-btn"
            onClick={handleConfirmSplit}
            disabled={Math.abs(totalPreview - orderTotal) > 0.01}
          >
            <Check size={18} />
            Confirmar Divisão
          </button>
        </div>
      </div>
    </div>
  )
}

export default SplitBillModal
