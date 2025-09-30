import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Clock, Users, MapPin, Phone, Eye, CheckCircle, XCircle, Grid3X3 } from 'lucide-react'
import CancelOrderModal from '../../components/CancelOrderModal/CancelOrderModal'
import './Orders.css'

const Orders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders') // 'orders' ou 'tables'
  const [draggedOrder, setDraggedOrder] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState(null)

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

  const openCancelModal = (order) => {
    setOrderToCancel(order)
    setShowCancelModal(true)
  }

  const handleCancelOrder = (cancelData) => {
    console.log('Pedido cancelado:', orderToCancel, cancelData)
    
    // Remover pedido das listas
    setPendingOrders(prev => prev.filter(o => o.id !== orderToCancel.id))
    setConfirmedOrders(prev => prev.filter(o => o.id !== orderToCancel.id))
    setSentOrders(prev => prev.filter(o => o.id !== orderToCancel.id))
    
    setShowCancelModal(false)
    setOrderToCancel(null)
  }

  const OrderCard = ({ order, onMove }) => {
    // Gera um número de pedido formatado
    const orderNumber = String(order.id).padStart(3, '0')
    
    return (
      <div 
        className="order-card"
        draggable
        onDragStart={(e) => handleDragStart(e, order)}
        onDragEnd={handleDragEnd}
        onClick={() => openOrderModal(order)}
      >
        {/* Número do pedido e Mesa/Delivery no topo */}
        <div className="card-top">
          <span className="order-number">#{orderNumber}</span>
          {order.tableNumber && (
            <span className="table-badge">Mesa {order.tableNumber}</span>
          )}
          {order.type === 'DELIVERY' && !order.tableNumber && (
            <span className="delivery-badge">DELIVERY</span>
          )}
        </div>

        {/* Nome do cliente e tempo */}
        <div className="card-customer">
          <strong>{order.customer}</strong>
          <span className="card-time">
            <Clock size={14} />
            {formatTime(order.time)}
          </span>
        </div>
        
        {/* Itens do pedido */}
        <div className="card-items">
          {order.items.map((item, index) => (
            <div key={index} className="card-item">
              <span className="item-qty">{item.quantity}x</span>
              <div className="item-details">
                <span className="item-title">{item.name}</span>
              </div>
              <span className="item-price">R$ {(item.quantity * item.price).toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
          
          {/* Informações adicionais */}
          {order.type === 'DELIVERY' && order.platform && (
            <div className="order-platform-info">
              <MapPin size={14} />
              <span>{order.platform}</span>
            </div>
          )}
          {order.type === 'DELIVERY' && order.address && (
            <div className="order-address-info">
              <span>{order.address}</span>
            </div>
          )}
        </div>
        
        {/* Total e Botões de ação */}
        <div className="card-actions">
          <div className="order-total-badge">
            R$ {order.total.toFixed(2).replace('.', ',')}
          </div>
          
          <button 
            className="btn-action btn-cancel"
            onClick={(e) => {
              e.stopPropagation()
              openCancelModal(order)
            }}
            title="Cancelar pedido"
          >
            <XCircle size={18} />
          </button>
          
          {order.status === 'pending' && (
            <button 
              className="btn-action btn-confirm"
              onClick={(e) => {
                e.stopPropagation()
                onMove(order.id, 'confirmed')
              }}
            >
              CONFIRMAR
            </button>
          )}
          
          {order.status === 'confirmed' && (
            <button 
              className="btn-action btn-send"
              onClick={(e) => {
                e.stopPropagation()
                onMove(order.id, 'sent')
              }}
            >
              ENVIAR
            </button>
          )}
          
          {order.status === 'sent' && (
            <button 
              className="btn-action btn-delivered"
              onClick={(e) => {
                e.stopPropagation()
                console.log('Pedido entregue:', order.id)
              }}
            >
              FINALIZAR
            </button>
          )}
        </div>
      </div>
    )
  }

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
      
      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false)
          setOrderToCancel(null)
        }}
        order={orderToCancel}
        onConfirmCancel={handleCancelOrder}
      />
    </div>
  )
}

export default Orders