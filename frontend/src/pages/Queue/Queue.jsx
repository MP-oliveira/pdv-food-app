import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Plus, Clock, Users, Phone, CheckCircle, XCircle, UserCheck } from 'lucide-react'
import './Queue.css'

const Queue = () => {
  const { user } = useAuth()
  const [queue, setQueue] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newCustomer, setNewCustomer] = useState({
    customer_name: '',
    customer_phone: '',
    party_size: 2,
    priority: 'normal',
    notes: ''
  })

  useEffect(() => {
    fetchQueue()
  }, [])

  const fetchQueue = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/queue`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setQueue(data.data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar fila:', error)
      setLoading(false)
    }
  }

  const handleAddToQueue = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/queue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCustomer)
      })

      const data = await response.json()
      if (data.success) {
        fetchQueue()
        setShowAddModal(false)
        setNewCustomer({
          customer_name: '',
          customer_phone: '',
          party_size: 2,
          priority: 'normal',
          notes: ''
        })
      }
    } catch (error) {
      console.error('Erro ao adicionar à fila:', error)
      alert('Erro ao adicionar à fila')
    }
  }

  const handleCallCustomer = async (id) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      await fetch(`${import.meta.env.VITE_API_URL}/queue/${id}/call`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      fetchQueue()
    } catch (error) {
      console.error('Erro ao chamar cliente:', error)
    }
  }

  const handleSeatCustomer = async (id, tableId) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      await fetch(`${import.meta.env.VITE_API_URL}/queue/${id}/seat`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ table_id: tableId })
      })

      fetchQueue()
    } catch (error) {
      console.error('Erro ao sentar cliente:', error)
    }
  }

  const handleRemoveFromQueue = async (id, reason) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      await fetch(`${import.meta.env.VITE_API_URL}/queue/${id}/remove`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      })

      fetchQueue()
    } catch (error) {
      console.error('Erro ao remover da fila:', error)
    }
  }

  const getWaitTime = (createdAt) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diff = Math.floor((now - created) / 60000)
    
    if (diff < 1) return 'Agora'
    if (diff === 1) return '1 min'
    return `${diff} min`
  }

  const getPriorityBadge = (priority) => {
    if (priority === 'vip') return '⭐ VIP'
    if (priority === 'reservation') return '📅 Reserva'
    return ''
  }

  return (
    <div className="queue-page">
      <div className="queue-header">
        <div>
          <h1>Fila de Espera</h1>
          <p className="queue-subtitle">{queue.filter(q => q.status === 'waiting').length} pessoas aguardando</p>
        </div>
        <button className="btn-add-queue" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Adicionar à Fila
        </button>
      </div>

      <div className="queue-content">
        {queue.length === 0 ? (
          <div className="empty-state">
            <Users size={64} />
            <h3>Nenhum cliente na fila</h3>
            <p>Adicione clientes à fila de espera</p>
          </div>
        ) : (
          <div className="queue-list">
            {queue.map((customer, index) => (
              <div key={customer.id} className={`queue-card ${customer.status} ${customer.priority}`}>
                <div className="queue-number">
                  <span className="number">#{customer.queue_number}</span>
                  {customer.priority !== 'normal' && (
                    <span className="priority-badge">{getPriorityBadge(customer.priority)}</span>
                  )}
                </div>

                <div className="queue-info">
                  <div className="customer-details">
                    <h3>{customer.customer_name}</h3>
                    <div className="details-row">
                      <span className="detail">
                        <Phone size={14} />
                        {customer.customer_phone}
                      </span>
                      <span className="detail">
                        <Users size={14} />
                        {customer.party_size} {customer.party_size === 1 ? 'pessoa' : 'pessoas'}
                      </span>
                      <span className="detail">
                        <Clock size={14} />
                        Aguardando {getWaitTime(customer.created_at)}
                      </span>
                    </div>
                    {customer.notes && (
                      <p className="notes">{customer.notes}</p>
                    )}
                  </div>

                  <div className="queue-actions">
                    {customer.status === 'waiting' && (
                      <>
                        <button 
                          className="btn-action btn-call"
                          onClick={() => handleCallCustomer(customer.id)}
                        >
                          <Phone size={18} />
                          Chamar
                        </button>
                        <button 
                          className="btn-action btn-seat"
                          onClick={() => handleSeatCustomer(customer.id, null)}
                        >
                          <CheckCircle size={18} />
                          Sentar
                        </button>
                      </>
                    )}
                    
                    {customer.status === 'called' && (
                      <button 
                        className="btn-action btn-seat"
                        onClick={() => handleSeatCustomer(customer.id, null)}
                      >
                        <CheckCircle size={18} />
                        Sentar
                      </button>
                    )}

                    <button 
                      className="btn-action btn-remove"
                      onClick={() => handleRemoveFromQueue(customer.id, 'Cancelado manualmente')}
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>

                {customer.status === 'called' && (
                  <div className="status-badge called">
                    Chamado
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Adicionar à Fila */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar à Fila</h2>
              <button onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Nome do Cliente:</label>
                <input
                  type="text"
                  value={newCustomer.customer_name}
                  onChange={(e) => setNewCustomer({...newCustomer, customer_name: e.target.value})}
                  placeholder="Digite o nome"
                />
              </div>

              <div className="form-group">
                <label>Telefone:</label>
                <input
                  type="tel"
                  value={newCustomer.customer_phone}
                  onChange={(e) => setNewCustomer({...newCustomer, customer_phone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="form-group">
                <label>Número de Pessoas:</label>
                <input
                  type="number"
                  min="1"
                  value={newCustomer.party_size}
                  onChange={(e) => setNewCustomer({...newCustomer, party_size: parseInt(e.target.value)})}
                />
              </div>

              <div className="form-group">
                <label>Prioridade:</label>
                <select
                  value={newCustomer.priority}
                  onChange={(e) => setNewCustomer({...newCustomer, priority: e.target.value})}
                >
                  <option value="normal">Normal</option>
                  <option value="vip">VIP</option>
                  <option value="reservation">Reserva</option>
                </select>
              </div>

              <div className="form-group">
                <label>Observações:</label>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                  placeholder="Observações..."
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleAddToQueue}>
                Adicionar à Fila
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Queue

