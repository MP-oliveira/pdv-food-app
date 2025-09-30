import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Clock, Users, MapPin, Phone, Eye, CheckCircle, XCircle, Grid3X3 } from 'lucide-react'
import './Orders.css'

const Orders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders') // 'orders' ou 'tables'
  const [draggedOrder, setDraggedOrder] = useState(null)

  // Estados das colunas
  const [pendingOrders, setPendingOrders] = useState([])
  const [confirmedOrders, setConfirmedOrders] = useState([])
  const [sentOrders, setSentOrders] = useState([])

  // Estados das mesas
  const [tables, setTables] = useState([])

  // Dados de exemplo (simulando pedidos)
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        type: 'DELIVERY',
        customer: 'Maria Silva',
        time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        address: 'Av. Paulista, 100 - Ap33, São Paulo-SP',
        total: 80.00,
        platform: 'iFood',
        status: 'pending',
        tableNumber: null,
        items: [
          { name: 'X-Burger Picanha', quantity: 1, price: 24.90 },
          { name: 'Coca-Cola 600ml', quantity: 2, price: 8.50 }
        ]
      },
      {
        id: 2,
        type: 'MESA',
        customer: 'João Santos',
        time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
        address: null,
        total: 45.50,
        platform: null,
        status: 'pending',
        tableNumber: 5,
        items: [
          { name: 'Pizza Margherita', quantity: 1, price: 32.90 },
          { name: 'Fanta Lata', quantity: 1, price: 5.50 }
        ]
      },
      {
        id: 3,
        type: 'DELIVERY',
        customer: 'Ana Costa',
        time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        address: 'Rua Augusta, 115 - Casa 1, São Paulo-SP',
        total: 55.00,
        platform: 'Uber Eats',
        status: 'confirmed',
        tableNumber: null,
        items: [
          { name: 'Frango Grelhado', quantity: 1, price: 19.90 },
          { name: 'Salada Verde', quantity: 1, price: 15.90 }
        ]
      }
    ]

    setOrders(mockOrders)
    setPendingOrders(mockOrders.filter(order => order.status === 'pending'))
    setConfirmedOrders(mockOrders.filter(order => order.status === 'confirmed'))
    setSentOrders(mockOrders.filter(order => order.status === 'sent'))
    
    // Dados das mesas
    const mockTables = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      isOccupied: [2, 5, 8, 12, 15].includes(i + 1), // Mesas ocupadas
      customerName: [2, 5, 8, 12, 15].includes(i + 1) ? 
        ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima', 'Carlos Oliveira'][[2, 5, 8, 12, 15].indexOf(i + 1)] : null,
      startTime: [2, 5, 8, 12, 15].includes(i + 1) ? 
        new Date(Date.now() - (Math.random() * 60 + 10) * 60 * 1000) : null, // Entre 10-70 minutos atrás
      total: [2, 5, 8, 12, 15].includes(i + 1) ? 
        Math.floor(Math.random() * 100 + 20) : 0
    }))
    
    setTables(mockTables)
    setLoading(false)
  }, [])

  const formatTime = (date) => {
    const now = new Date()
    const diff = Math.floor((now - date) / 60000) // diferença em minutos
    
    if (diff < 1) return 'agora'
    if (diff === 1) return 'há 1 minuto'
    if (diff < 60) return `há ${diff} minutos`
    
    const hours = Math.floor(diff / 60)
    if (hours === 1) return 'há 1 hora'
    return `há ${hours} horas`
  }

  const moveOrder = (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    const updatedOrder = { ...order, status: newStatus }
    const updatedOrders = orders.map(o => o.id === orderId ? updatedOrder : o)
    
    setOrders(updatedOrders)
    setPendingOrders(updatedOrders.filter(o => o.status === 'pending'))
    setConfirmedOrders(updatedOrders.filter(o => o.status === 'confirmed'))
    setSentOrders(updatedOrders.filter(o => o.status === 'sent'))
  }

  // Funções de Drag & Drop
  const handleDragStart = (e, order) => {
    setDraggedOrder(order)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetStatus) => {
    e.preventDefault()
    if (draggedOrder && draggedOrder.status !== targetStatus) {
      moveOrder(draggedOrder.id, targetStatus)
    }
    setDraggedOrder(null)
  }

  const handleDragEnd = () => {
    setDraggedOrder(null)
  }

  const openOrderModal = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const OrderCard = ({ order, onMove }) => (
    <div 
      className="order-card"
      draggable
      onDragStart={(e) => handleDragStart(e, order)}
      onDragEnd={handleDragEnd}
      onClick={() => openOrderModal(order)}
    >
      <div className="order-header">
        <span className="order-type">{order.type}</span>
        <span className="order-time">
          <Clock size={12} />
          {formatTime(order.time)}
        </span>
      </div>
      
      <div className="order-customer">
        <strong>{order.customer}</strong>
      </div>
      
      {order.type === 'DELIVERY' && (
        <div className="order-address">
          <MapPin size={12} />
          {order.address}
        </div>
      )}
      
      {order.type === 'MESA' && (
        <div className="order-table">
          <Users size={12} />
          Mesa {order.tableNumber}
        </div>
      )}
      
      {order.platform && (
        <div className="order-platform">
          {order.platform}
        </div>
      )}
      
      <div className="order-total">
        R$ {order.total.toFixed(2).replace('.', ',')}
      </div>
      
      <div className="order-actions">
        <button 
          className="action-btn view-btn"
          onClick={(e) => {
            e.stopPropagation()
            openOrderModal(order)
          }}
        >
          <Eye size={14} />
        </button>
        
        {order.status === 'pending' && (
          <button 
            className="action-btn confirm-btn"
            onClick={(e) => {
              e.stopPropagation()
              onMove(order.id, 'confirmed')
            }}
          >
            <CheckCircle size={14} />
          </button>
        )}
        
        {order.status === 'confirmed' && (
          <button 
            className="action-btn send-btn"
            onClick={(e) => {
              e.stopPropagation()
              onMove(order.id, 'sent')
            }}
          >
            Enviar
          </button>
        )}
      </div>
    </div>
  )

  const OrderModal = () => {
    if (!selectedOrder) return null

    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Detalhes do Pedido #{selectedOrder.id}</h3>
            <button 
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
          </div>
          
          <div className="modal-body">
            <div className="order-info">
              <div className="info-row">
                <strong>Cliente:</strong> {selectedOrder.customer}
              </div>
              <div className="info-row">
                <strong>Tipo:</strong> {selectedOrder.type}
              </div>
              <div className="info-row">
                <strong>Horário:</strong> {selectedOrder.time.toLocaleString('pt-BR')}
              </div>
              <div className="info-row">
                <strong>Tempo de espera:</strong> {formatTime(selectedOrder.time)}
              </div>
              
              {selectedOrder.type === 'MESA' && (
                <div className="info-row">
                  <strong>Mesa:</strong> {selectedOrder.tableNumber}
                </div>
              )}
              
              {selectedOrder.type === 'DELIVERY' && (
                <div className="info-row">
                  <strong>Endereço:</strong> {selectedOrder.address}
                </div>
              )}
              
              {selectedOrder.platform && (
                <div className="info-row">
                  <strong>Plataforma:</strong> {selectedOrder.platform}
                </div>
              )}
            </div>
            
            <div className="order-items">
              <h4>Itens do Pedido:</h4>
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span>{item.quantity}x {item.name}</span>
                  <span>R$ {(item.quantity * item.price).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>
            
            <div className="order-total-modal">
              <strong>Total: R$ {selectedOrder.total.toFixed(2).replace('.', ',')}</strong>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Fechar
            </button>
            
            {selectedOrder.status === 'pending' && (
              <button 
                className="btn-primary"
                onClick={() => {
                  moveOrder(selectedOrder.id, 'confirmed')
                  setShowModal(false)
                }}
              >
                Confirmar Pedido
              </button>
            )}
            
            {selectedOrder.status === 'confirmed' && (
              <button 
                className="btn-primary"
                onClick={() => {
                  moveOrder(selectedOrder.id, 'sent')
                  setShowModal(false)
                }}
              >
                Enviar Pedido
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Componente para calcular o progresso do tempo (para o loader circular)
  const getTimeProgress = (startTime) => {
    if (!startTime) return 0
    const now = new Date()
    const diff = now - startTime
    const minutes = Math.floor(diff / 60000)
    // Progresso baseado em 2 horas (120 minutos) como máximo
    return Math.min((minutes / 120) * 100, 100)
  }

  const TableCard = ({ table }) => (
    <div 
      className={`table-card ${table.isOccupied ? 'occupied' : 'free'}`}
      onClick={() => table.isOccupied && openOrderModal({
        id: `table-${table.id}`,
        type: 'MESA',
        customer: table.customerName,
        time: table.startTime,
        total: table.total,
        tableNumber: table.number,
        items: []
      })}
    >
      <div className="table-number">{table.number}</div>
      
      {table.isOccupied && (
        <>
          <div className="table-timer">
            <div className="circular-progress">
              <svg className="progress-ring" width="60" height="60">
                <circle
                  className="progress-ring-circle"
                  stroke="#ef4444"
                  strokeWidth="3"
                  fill="transparent"
                  r="25"
                  cx="30"
                  cy="30"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 25}`,
                    strokeDashoffset: `${2 * Math.PI * 25 * (1 - getTimeProgress(table.startTime) / 100)}`
                  }}
                />
              </svg>
              <div className="time-text">
                {formatTime(table.startTime)}
              </div>
            </div>
          </div>
          
          <div className="table-info">
            <div className="customer-name">{table.customerName}</div>
            <div className="table-total">R$ {table.total.toFixed(2).replace('.', ',')}</div>
          </div>
        </>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Carregando pedidos...</div>
      </div>
    )
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Gestão de Pedidos</h1>
        
        {/* Abas */}
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Grid3X3 size={16} />
            Pedidos
          </button>
          <button 
            className={`tab-button ${activeTab === 'tables' ? 'active' : ''}`}
            onClick={() => setActiveTab('tables')}
          >
            <Users size={16} />
            Mesas
          </button>
        </div>

        <div className="orders-stats">
          <div className="stat-card">
            <span className="stat-label">Pedidos</span>
            <span className="stat-value">{orders.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pendentes</span>
            <span className="stat-value">{pendingOrders.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Confirmados</span>
            <span className="stat-value">{confirmedOrders.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Enviados</span>
            <span className="stat-value">{sentOrders.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Mesas Ocupadas</span>
            <span className="stat-value">{tables.filter(t => t.isOccupied).length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total</span>
            <span className="stat-value">
              R$ {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="orders-board">
          <div 
            className="order-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'pending')}
          >
            <div className="column-header pending">
              <span>Pendentes</span>
              <span className="order-count">{pendingOrders.length}</span>
            </div>
            <div className="order-list">
              {pendingOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onMove={moveOrder}
                />
              ))}
            </div>
          </div>

          <div 
            className="order-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'confirmed')}
          >
            <div className="column-header confirmed">
              <span>Confirmados</span>
              <span className="order-count">{confirmedOrders.length}</span>
            </div>
            <div className="order-list">
              {confirmedOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onMove={moveOrder}
                />
              ))}
            </div>
          </div>

          <div 
            className="order-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'sent')}
          >
            <div className="column-header sent">
              <span>Enviados</span>
              <span className="order-count">{sentOrders.length}</span>
            </div>
            <div className="order-list">
              {sentOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onMove={moveOrder}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="tables-board">
          <div className="tables-grid">
            {tables.map(table => (
              <TableCard key={table.id} table={table} />
            ))}
          </div>
        </div>
      )}

      {showModal && <OrderModal />}
    </div>
  )
}

export default Orders