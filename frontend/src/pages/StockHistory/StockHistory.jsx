import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Package, TrendingUp, TrendingDown, Edit3, ShoppingCart, Factory, Trash2, Calendar, Filter } from 'lucide-react'
import './StockHistory.css'

const StockHistory = () => {
  const { user } = useAuth()
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    type: '',
    dateFrom: '',
    dateTo: '',
    productId: ''
  })

  useEffect(() => {
    fetchMovements()
  }, [filter])

  const fetchMovements = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const params = new URLSearchParams()
      if (filter.type) params.append('type', filter.type)
      if (filter.dateFrom) params.append('date_from', filter.dateFrom)
      if (filter.dateTo) params.append('date_to', filter.dateTo)
      if (filter.productId) params.append('product_id', filter.productId)
      params.append('limit', '100')

      const response = await fetch(`${import.meta.env.VITE_API_URL}/stock/movements?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setMovements(data.data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar movimentações:', error)
      setLoading(false)
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'IN': return <TrendingUp size={18} className="icon-in" />
      case 'OUT': return <TrendingDown size={18} className="icon-out" />
      case 'PURCHASE': return <ShoppingCart size={18} className="icon-purchase" />
      case 'PRODUCTION': return <Factory size={18} className="icon-production" />
      case 'SALE': return <ShoppingCart size={18} className="icon-sale" />
      case 'WASTE': return <Trash2 size={18} className="icon-waste" />
      case 'ADJUSTMENT': return <Edit3 size={18} className="icon-adjustment" />
      default: return <Package size={18} />
    }
  }

  const getTypeLabel = (type) => {
    const labels = {
      'IN': 'Entrada',
      'OUT': 'Saída',
      'PURCHASE': 'Compra',
      'PRODUCTION': 'Produção',
      'SALE': 'Venda',
      'WASTE': 'Desperdício',
      'ADJUSTMENT': 'Ajuste'
    }
    return labels[type] || type
  }

  const getTypeClass = (type) => {
    if (['IN', 'PURCHASE', 'PRODUCTION'].includes(type)) return 'movement-in'
    if (['OUT', 'SALE', 'WASTE'].includes(type)) return 'movement-out'
    return 'movement-neutral'
  }

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="stock-history-container">
        <div className="loading">Carregando histórico...</div>
      </div>
    )
  }

  return (
    <div className="stock-history-page">
      <div className="stock-history-header">
        <h1>Histórico de Movimentações</h1>
        
        <div className="filters-section">
          <div className="filter-group">
            <label>Tipo:</label>
            <select 
              value={filter.type}
              onChange={(e) => setFilter({...filter, type: e.target.value})}
            >
              <option value="">Todos</option>
              <option value="IN">Entrada</option>
              <option value="OUT">Saída</option>
              <option value="PURCHASE">Compra</option>
              <option value="PRODUCTION">Produção</option>
              <option value="SALE">Venda</option>
              <option value="WASTE">Desperdício</option>
              <option value="ADJUSTMENT">Ajuste</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Data Início:</label>
            <input 
              type="date"
              value={filter.dateFrom}
              onChange={(e) => setFilter({...filter, dateFrom: e.target.value})}
            />
          </div>

          <div className="filter-group">
            <label>Data Fim:</label>
            <input 
              type="date"
              value={filter.dateTo}
              onChange={(e) => setFilter({...filter, dateTo: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="movements-list">
        {movements.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <p>Nenhuma movimentação encontrada</p>
          </div>
        ) : (
          movements.map(movement => (
            <div key={movement.id} className={`movement-item ${getTypeClass(movement.type)}`}>
              <div className="movement-icon">
                {getTypeIcon(movement.type)}
              </div>
              
              <div className="movement-info">
                <div className="movement-header">
                  <strong>{movement.product?.name || `Produto #${movement.product_id}`}</strong>
                  <span className="movement-type">{getTypeLabel(movement.type)}</span>
                </div>
                <div className="movement-details">
                  <span className="movement-quantity">
                    Quantidade: <strong>{movement.quantity}</strong>
                  </span>
                  <span className="movement-balance">
                    {movement.previous_quantity} → {movement.new_quantity}
                  </span>
                </div>
                {movement.reason && (
                  <div className="movement-reason">
                    {movement.reason}
                  </div>
                )}
                <div className="movement-footer">
                  <span className="movement-user">
                    Por: {movement.user?.name || 'Sistema'}
                  </span>
                  <span className="movement-date">
                    {formatDateTime(movement.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default StockHistory

