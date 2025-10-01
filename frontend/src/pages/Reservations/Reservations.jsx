import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Calendar, Plus, Clock, Users, Phone, Mail, CheckCircle, XCircle, Edit } from 'lucide-react'
import './Reservations.css'

const Reservations = () => {
  const { user } = useAuth()
  const [reservations, setReservations] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newReservation, setNewReservation] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    party_size: 2,
    reservation_date: '',
    reservation_time: '',
    notes: ''
  })

  useEffect(() => {
    fetchReservations()
  }, [selectedDate])

  const fetchReservations = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const dateStr = selectedDate.toISOString().split('T')[0]
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reservations?date=${dateStr}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setReservations(data.data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar reservas:', error)
      setLoading(false)
    }
  }

  const handleCreateReservation = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReservation)
      })

      const data = await response.json()
      if (data.success) {
        fetchReservations()
        setShowAddModal(false)
        setNewReservation({
          customer_name: '',
          customer_phone: '',
          customer_email: '',
          party_size: 2,
          reservation_date: '',
          reservation_time: '',
          notes: ''
        })
      }
    } catch (error) {
      console.error('Erro ao criar reserva:', error)
      alert('Erro ao criar reserva')
    }
  }

  const handleConfirmReservation = async (id) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      await fetch(`${import.meta.env.VITE_API_URL}/reservations/${id}/confirm`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      fetchReservations()
    } catch (error) {
      console.error('Erro ao confirmar reserva:', error)
    }
  }

  const handleCancelReservation = async (id, reason) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      await fetch(`${import.meta.env.VITE_API_URL}/reservations/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cancellation_reason: reason })
      })

      fetchReservations()
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error)
    }
  }

  const handleCompleteReservation = async (id, tableId) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      await fetch(`${import.meta.env.VITE_API_URL}/reservations/${id}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ table_id: tableId })
      })

      fetchReservations()
    } catch (error) {
      console.error('Erro ao completar reserva:', error)
    }
  }

  const formatTime = (time) => {
    return time.slice(0, 5)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Pendente', color: '#f59e0b' },
      confirmed: { label: 'Confirmada', color: '#3b82f6' },
      completed: { label: 'Concluída', color: '#10b981' },
      cancelled: { label: 'Cancelada', color: '#ef4444' }
    }
    return badges[status] || badges.pending
  }

  const changeDate = (days) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  const isToday = () => {
    const today = new Date()
    return selectedDate.toDateString() === today.toDateString()
  }

  return (
    <div className="reservations-page">
      <div className="reservations-header">
        <div>
          <h1>Reservas</h1>
          <p className="reservations-subtitle">{reservations.filter(r => r.status !== 'cancelled').length} reservas ativas</p>
        </div>
        <button className="btn-add-reservation" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Nova Reserva
        </button>
      </div>

      {/* Calendar Navigation */}
      <div className="calendar-nav">
        <button className="btn-nav" onClick={() => changeDate(-1)}>
          ← Anterior
        </button>
        <div className="current-date">
          <Calendar size={20} />
          <span>{formatDate(selectedDate)}</span>
        </div>
        <button className="btn-nav" onClick={() => changeDate(1)}>
          Próximo →
        </button>
        {!isToday() && (
          <button className="btn-today" onClick={goToToday}>
            Hoje
          </button>
        )}
      </div>

      <div className="reservations-content">
        {reservations.length === 0 ? (
          <div className="empty-state">
            <Calendar size={64} />
            <h3>Nenhuma reserva para esta data</h3>
            <p>Adicione uma nova reserva para começar</p>
          </div>
        ) : (
          <div className="reservations-timeline">
            {reservations.map((reservation) => {
              const statusBadge = getStatusBadge(reservation.status)
              return (
                <div key={reservation.id} className={`reservation-card ${reservation.status}`}>
                  <div className="reservation-time">
                    <Clock size={20} />
                    <span className="time">{formatTime(reservation.reservation_time)}</span>
                  </div>

                  <div className="reservation-info">
                    <div className="customer-details">
                      <h3>{reservation.customer_name}</h3>
                      <div className="details-row">
                        <span className="detail">
                          <Phone size={14} />
                          {reservation.customer_phone}
                        </span>
                        {reservation.customer_email && (
                          <span className="detail">
                            <Mail size={14} />
                            {reservation.customer_email}
                          </span>
                        )}
                        <span className="detail">
                          <Users size={14} />
                          {reservation.party_size} {reservation.party_size === 1 ? 'pessoa' : 'pessoas'}
                        </span>
                      </div>
                      {reservation.notes && (
                        <p className="notes">{reservation.notes}</p>
                      )}
                    </div>

                    <div className="reservation-actions">
                      {reservation.status === 'pending' && (
                        <>
                          <button 
                            className="btn-action btn-confirm"
                            onClick={() => handleConfirmReservation(reservation.id)}
                          >
                            <CheckCircle size={18} />
                            Confirmar
                          </button>
                          <button 
                            className="btn-action btn-cancel"
                            onClick={() => handleCancelReservation(reservation.id, 'Cancelado manualmente')}
                          >
                            <XCircle size={18} />
                            Cancelar
                          </button>
                        </>
                      )}
                      
                      {reservation.status === 'confirmed' && (
                        <>
                          <button 
                            className="btn-action btn-complete"
                            onClick={() => handleCompleteReservation(reservation.id, null)}
                          >
                            <CheckCircle size={18} />
                            Cliente Chegou
                          </button>
                          <button 
                            className="btn-action btn-cancel"
                            onClick={() => handleCancelReservation(reservation.id, 'Cancelado manualmente')}
                          >
                            <XCircle size={18} />
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="status-badge" style={{ backgroundColor: statusBadge.color }}>
                    {statusBadge.label}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Nova Reserva */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nova Reserva</h2>
              <button onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Nome do Cliente:</label>
                  <input
                    type="text"
                    value={newReservation.customer_name}
                    onChange={(e) => setNewReservation({...newReservation, customer_name: e.target.value})}
                    placeholder="Digite o nome"
                  />
                </div>

                <div className="form-group">
                  <label>Telefone:</label>
                  <input
                    type="tel"
                    value={newReservation.customer_phone}
                    onChange={(e) => setNewReservation({...newReservation, customer_phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>E-mail (opcional):</label>
                <input
                  type="email"
                  value={newReservation.customer_email}
                  onChange={(e) => setNewReservation({...newReservation, customer_email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data:</label>
                  <input
                    type="date"
                    value={newReservation.reservation_date}
                    onChange={(e) => setNewReservation({...newReservation, reservation_date: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Horário:</label>
                  <input
                    type="time"
                    value={newReservation.reservation_time}
                    onChange={(e) => setNewReservation({...newReservation, reservation_time: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Número de Pessoas:</label>
                <input
                  type="number"
                  min="1"
                  value={newReservation.party_size}
                  onChange={(e) => setNewReservation({...newReservation, party_size: parseInt(e.target.value)})}
                />
              </div>

              <div className="form-group">
                <label>Observações:</label>
                <textarea
                  value={newReservation.notes}
                  onChange={(e) => setNewReservation({...newReservation, notes: e.target.value})}
                  placeholder="Observações especiais..."
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm" onClick={handleCreateReservation}>
                Criar Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reservations

