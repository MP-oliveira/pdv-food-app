import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Trophy, TrendingUp, DollarSign, ShoppingBag, Calendar, Users as UsersIcon } from 'lucide-react'
import './WaiterSales.css'

const WaiterSales = () => {
  const { user } = useAuth()
  const [ranking, setRanking] = useState([])
  const [selectedWaiter, setSelectedWaiter] = useState(null)
  const [waiterReport, setWaiterReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month') // day, week, month, custom

  useEffect(() => {
    fetchRanking()
  }, [period])

  const fetchRanking = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/waiters/ranking?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setRanking(data.data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar ranking:', error)
      setLoading(false)
    }
  }

  const fetchWaiterReport = async (waiterId) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/waiters/${waiterId}/report`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setWaiterReport(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar relatório:', error)
    }
  }

  const handleWaiterClick = (waiter) => {
    setSelectedWaiter(waiter)
    fetchWaiterReport(waiter.id)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const getRankBadge = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `${index + 1}º`
  }

  if (loading) {
    return (
      <div className="waiter-sales-container">
        <div className="loading">Carregando dados...</div>
      </div>
    )
  }

  return (
    <div className="waiter-sales-page">
      <div className="waiter-sales-header">
        <h1>👨‍🍳 Vendas por Garçom</h1>
        
        <div className="period-selector">
          <button
            className={`period-btn ${period === 'day' ? 'active' : ''}`}
            onClick={() => setPeriod('day')}
          >
            Hoje
          </button>
          <button
            className={`period-btn ${period === 'week' ? 'active' : ''}`}
            onClick={() => setPeriod('week')}
          >
            Semana
          </button>
          <button
            className={`period-btn ${period === 'month' ? 'active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            Mês
          </button>
        </div>
      </div>

      <div className="waiter-sales-content">
        {/* Ranking */}
        <div className="ranking-section">
          <h2>🏆 Ranking</h2>
          
          {ranking.length === 0 ? (
            <div className="empty-state">
              <UsersIcon size={48} />
              <p>Nenhuma venda registrada no período</p>
            </div>
          ) : (
            <div className="ranking-list">
              {ranking.map((waiter, index) => (
                <div 
                  key={waiter.id}
                  className={`ranking-card ${selectedWaiter?.id === waiter.id ? 'active' : ''} ${index < 3 ? 'top-three' : ''}`}
                  onClick={() => handleWaiterClick(waiter)}
                >
                  <div className="rank-badge">
                    {getRankBadge(index)}
                  </div>
                  
                  <div className="waiter-info">
                    <strong>{waiter.name}</strong>
                    <span className="waiter-email">{waiter.email}</span>
                  </div>
                  
                  <div className="waiter-stats">
                    <div className="stat">
                      <ShoppingBag size={16} />
                      <span>{waiter.total_orders || 0} pedidos</span>
                    </div>
                    <div className="stat stat-highlight">
                      <DollarSign size={16} />
                      <span>{formatCurrency(waiter.total_sales)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalhes do Garçom Selecionado */}
        {waiterReport && (
          <div className="waiter-details-section">
            <div className="details-header">
              <h2>{waiterReport.waiter.name}</h2>
              <span className="waiter-role">{waiterReport.waiter.role}</span>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <ShoppingBag size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-label">Total de Pedidos</span>
                  <span className="stat-value">{waiterReport.summary.total_orders}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <DollarSign size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-label">Total de Vendas</span>
                  <span className="stat-value">{formatCurrency(waiterReport.summary.total_sales)}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-label">Ticket Médio</span>
                  <span className="stat-value">{formatCurrency(waiterReport.summary.average_ticket)}</span>
                </div>
              </div>

              <div className="stat-card highlight">
                <div className="stat-icon">
                  <Trophy size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-label">Comissão (5%)</span>
                  <span className="stat-value">{formatCurrency(waiterReport.summary.commission)}</span>
                </div>
              </div>
            </div>

            {/* Vendas por Dia */}
            <div className="sales-by-day">
              <h3>📅 Vendas por Dia</h3>
              <div className="days-list">
                {Object.entries(waiterReport.sales_by_day || {}).map(([date, data]) => (
                  <div key={date} className="day-item">
                    <span className="day-date">{date}</span>
                    <div className="day-stats">
                      <span className="day-orders">{data.count} pedidos</span>
                      <span className="day-total">{formatCurrency(data.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WaiterSales

