import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Gift, Star, TrendingUp, Award, Plus, Search } from 'lucide-react'
import './Loyalty.css'

const Loyalty = () => {
  const { user } = useAuth()
  const [customers, setCustomers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
    fetchTransactions()
  }, [])

  const fetchCustomers = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/loyalty/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setCustomers(data.data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/loyalty/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setTransactions(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar transações:', error)
    }
  }

  const handleAddPoints = async (customerId, points, description) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      await fetch(`${import.meta.env.VITE_API_URL}/loyalty/add-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customer_id: customerId,
          points,
          description
        })
      })

      fetchCustomers()
      fetchTransactions()
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error)
    }
  }

  const handleRedeemPoints = async (customerId, points, description) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      await fetch(`${import.meta.env.VITE_API_URL}/loyalty/redeem-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customer_id: customerId,
          points,
          description
        })
      })

      fetchCustomers()
      fetchTransactions()
      setShowRedeemModal(false)
      setSelectedCustomer(null)
    } catch (error) {
      console.error('Erro ao resgatar pontos:', error)
    }
  }

  const getLoyaltyLevel = (points) => {
    if (points >= 1000) return { name: 'Platinum', color: '#818cf8', icon: '💎' }
    if (points >= 500) return { name: 'Gold', color: '#fbbf24', icon: '🥇' }
    if (points >= 200) return { name: 'Silver', color: '#94a3b8', icon: '🥈' }
    return { name: 'Bronze', color: '#fb923c', icon: '🥉' }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  )

  const rewards = [
    { id: 1, name: '10% de Desconto', points: 100, icon: '🎁' },
    { id: 2, name: 'Bebida Grátis', points: 150, icon: '🥤' },
    { id: 3, name: 'Sobremesa Grátis', points: 200, icon: '🍰' },
    { id: 4, name: '20% de Desconto', points: 300, icon: '🎉' },
    { id: 5, name: 'Prato Grátis', points: 500, icon: '🍽️' }
  ]

  return (
    <div className="loyalty-page">
      <div className="loyalty-header">
        <div>
          <h1>Programa de Fidelidade</h1>
          <p className="loyalty-subtitle">{customers.length} clientes cadastrados</p>
        </div>
      </div>

      {/* Stats */}
      <div className="loyalty-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f6' }}>
            <Star size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total de Pontos Distribuídos</span>
            <span className="stat-value">
              {customers.reduce((sum, c) => sum + (c.loyalty_points || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Transações Este Mês</span>
            <span className="stat-value">
              {transactions.filter(t => {
                const date = new Date(t.created_at)
                const now = new Date()
                return date.getMonth() === now.getMonth()
              }).length}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>
            <Award size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Clientes VIP</span>
            <span className="stat-value">
              {customers.filter(c => (c.loyalty_points || 0) >= 500).length}
            </span>
          </div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="rewards-section">
        <h2>Catálogo de Recompensas</h2>
        <div className="rewards-grid">
          {rewards.map(reward => (
            <div key={reward.id} className="reward-card">
              <div className="reward-icon">{reward.icon}</div>
              <h3>{reward.name}</h3>
              <div className="reward-points">
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                {reward.points} pontos
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customers List */}
      <div className="customers-section">
        <div className="section-header">
          <h2>Clientes do Programa</h2>
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="customers-grid">
          {filteredCustomers.map(customer => {
            const level = getLoyaltyLevel(customer.loyalty_points || 0)
            return (
              <div key={customer.id} className="customer-card">
                <div className="customer-header">
                  <div className="customer-avatar">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="customer-info">
                    <h3>{customer.name}</h3>
                    <p>{customer.phone}</p>
                  </div>
                  <div className="loyalty-badge" style={{ background: level.color }}>
                    {level.icon} {level.name}
                  </div>
                </div>

                <div className="customer-points">
                  <div className="points-display">
                    <Star size={24} fill="#fbbf24" color="#fbbf24" />
                    <span className="points-value">{customer.loyalty_points || 0}</span>
                    <span className="points-label">pontos</span>
                  </div>
                </div>

                <div className="customer-actions">
                  <button
                    className="btn-action btn-add"
                    onClick={() => handleAddPoints(customer.id, 50, 'Pontos bônus')}
                  >
                    <Plus size={16} />
                    Adicionar 50pts
                  </button>
                  <button
                    className="btn-action btn-redeem"
                    onClick={() => {
                      setSelectedCustomer(customer)
                      setShowRedeemModal(true)
                    }}
                    disabled={!customer.loyalty_points || customer.loyalty_points < 100}
                  >
                    <Gift size={16} />
                    Resgatar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowRedeemModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Resgatar Pontos</h2>
              <button onClick={() => setShowRedeemModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="customer-summary">
                <div className="customer-avatar">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{selectedCustomer.name}</h3>
                  <p className="available-points">
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    {selectedCustomer.loyalty_points} pontos disponíveis
                  </p>
                </div>
              </div>

              <div className="rewards-list">
                {rewards
                  .filter(r => r.points <= (selectedCustomer.loyalty_points || 0))
                  .map(reward => (
                    <button
                      key={reward.id}
                      className="reward-option"
                      onClick={() => handleRedeemPoints(
                        selectedCustomer.id,
                        reward.points,
                        `Resgate: ${reward.name}`
                      )}
                    >
                      <span className="reward-icon">{reward.icon}</span>
                      <div className="reward-info">
                        <span className="reward-name">{reward.name}</span>
                        <span className="reward-cost">-{reward.points} pontos</span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Loyalty

