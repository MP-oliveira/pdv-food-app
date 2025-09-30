import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Clock, Users, ChefHat, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import './Kitchen.css'

const Kitchen = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [draggedOrder, setDraggedOrder] = useState(null)

  // Estados das colunas da cozinha
  const [pendingOrders, setPendingOrders] = useState([])
  const [preparingOrders, setPreparingOrders] = useState([])
  const [readyOrders, setReadyOrders] = useState([])

  // Dados de exemplo (simulando pedidos da cozinha)
  useEffect(() => {
    const mockOrders = [
      {
        id: 1,
        orderNumber: '001',
        customer: 'Maria Silva',
        tableNumber: 5,
        type: 'MESA',
        time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        status: 'pending',
        priority: 'normal',
        items: [
          { 
            name: 'X-Burger Picanha', 
            quantity: 1, 
            price: 24.90,
            preparationTime: 15,
            category: 'Pratos Principais',
            notes: 'Sem cebola'
          },
          { 
            name: 'Coca-Cola 600ml', 
            quantity: 1, 
            price: 8.50,
            preparationTime: 0,
            category: 'Bebidas'
          }
        ],
        total: 33.40
      },
      {
        id: 2,
        orderNumber: '002',
        customer: 'João Santos',
        tableNumber: null,
        type: 'DELIVERY',
        time: new Date(Date.now() - 10 * 60 * 1000), // 10 minutos atrás
        status: 'preparing',
        priority: 'high',
        items: [
          { 
            name: 'Pizza Margherita', 
            quantity: 1, 
            price: 32.90,
            preparationTime: 30,
            category: 'Pizzas'
          },
          { 
            name: 'Fanta Lata 310ml', 
            quantity: 2, 
            price: 5.50,
            preparationTime: 0,
            category: 'Bebidas'
          }
        ],
        total: 43.90
      },
      {
        id: 3,
        orderNumber: '003',
        customer: 'Ana Costa',
        tableNumber: 3,
        type: 'MESA',
        time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
        status: 'ready',
        priority: 'normal',
        items: [
          { 
            name: 'Frango Grelhado', 
            quantity: 1, 
            price: 19.90,
            preparationTime: 20,
            category: 'Pratos Principais'
          },
          { 
            name: 'Salada Verde', 
            quantity: 1, 
            price: 15.90,
            preparationTime: 5,
            category: 'Saladas'
          }
        ],
        total: 35.80
      },
      {
        id: 4,
        orderNumber: '004',
        customer: 'Pedro Lima',
        tableNumber: 7,
        type: 'MESA',
        time: new Date(Date.now() - 3 * 60 * 1000), // 3 minutos atrás
        status: 'pending',
        priority: 'urgent',
        items: [
          { 
            name: 'Bife à Parmegiana', 
            quantity: 1, 
            price: 26.90,
            preparationTime: 25,
            category: 'Pratos Principais',
            notes: 'Bem passado'
          },
          { 
            name: 'Batata Frita', 
            quantity: 1, 
            price: 12.90,
            preparationTime: 10,
            category: 'Aperitivos'
          }
        ],
        total: 39.80
      }
    ]

    setOrders(mockOrders)
    setPendingOrders(mockOrders.filter(order => order.status === 'pending'))
    setPreparingOrders(mockOrders.filter(order => order.status === 'preparing'))
    setReadyOrders(mockOrders.filter(order => order.status === 'ready'))
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#ef4444'
      case 'high': return '#f59e0b'
      case 'normal': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'urgent': return 'URGENTE'
      case 'high': return 'ALTA'
      case 'normal': return 'NORMAL'
      default: return 'NORMAL'
    }
  }

  const moveOrder = (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    const updatedOrder = { ...order, status: newStatus }
    const updatedOrders = orders.map(o => o.id === orderId ? updatedOrder : o)
    
    setOrders(updatedOrders)
    setPendingOrders(updatedOrders.filter(o => o.status === 'pending'))
    setPreparingOrders(updatedOrders.filter(o => o.status === 'preparing'))
    setReadyOrders(updatedOrders.filter(o => o.status === 'ready'))
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

  const KitchenOrderCard = ({ order, onMove }) => (
    <div 
      className="kitchen-order-card"
      draggable
      onDragStart={(e) => handleDragStart(e, order)}
      onDragEnd={handleDragEnd}
      onClick={() => openOrderModal(order)}
    >
      <div className="order-header">
        <div className="order-info">
          <span className="order-number">#{order.orderNumber}</span>
          <span className="order-priority" style={{ color: getPriorityColor(order.priority) }}>
            {getPriorityLabel(order.priority)}
          </span>
        </div>
        <span className="order-time">
          <Clock size={12} />
          {formatTime(order.time)}
        </span>
      </div>
      
      <div className="order-customer">
        <strong>{order.customer}</strong>
        {order.tableNumber && (
          <span className="table-info">Mesa {order.tableNumber}</span>
        )}
        {order.type === 'DELIVERY' && (
          <span className="delivery-info">DELIVERY</span>
        )}
      </div>
      
      <div className="order-items">
        {order.items.map((item, index) => (
          <div key={index} className="order-item">
            <span className="item-quantity">{item.quantity}x</span>
            <span className="item-name">{item.name}</span>
            {item.notes && (
              <span className="item-notes">({item.notes})</span>
            )}
            <span className="item-time">{item.preparationTime}min</span>
          </div>
        ))}
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
            className="action-btn start-btn"
            onClick={(e) => {
              e.stopPropagation()
              onMove(order.id, 'preparing')
            }}
          >
            <ChefHat size={14} />
            Iniciar
          </button>
        )}
        
        {order.status === 'preparing' && (
          <button 
            className="action-btn ready-btn"
            onClick={(e) => {
              e.stopPropagation()
              onMove(order.id, 'ready')
            }}
          >
            <CheckCircle size={14} />
            Pronto
          </button>
        )}
        
        {order.status === 'ready' && (
          <button 
            className="action-btn delivered-btn"
            onClick={(e) => {
              e.stopPropagation()
              // Aqui seria enviado para entrega
              console.log('Pedido entregue:', order.id)
            }}
          >
            Entregue
          </button>
        )}
      </div>
    </div>
  )

  const OrderModal = () => {
    if (!selectedOrder) return null

    const totalPreparationTime = selectedOrder.items.reduce((total, item) => 
      total + (item.preparationTime * item.quantity), 0
    )

    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Pedido #{selectedOrder.orderNumber}</h3>
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
              {selectedOrder.tableNumber && (
                <div className="info-row">
                  <strong>Mesa:</strong> {selectedOrder.tableNumber}
                </div>
              )}
              <div className="info-row">
                <strong>Horário:</strong> {selectedOrder.time.toLocaleString('pt-BR')}
              </div>
              <div className="info-row">
                <strong>Tempo de espera:</strong> {formatTime(selectedOrder.time)}
              </div>
              <div className="info-row">
                <strong>Prioridade:</strong> 
                <span style={{ color: getPriorityColor(selectedOrder.priority), marginLeft: '8px' }}>
                  {getPriorityLabel(selectedOrder.priority)}
                </span>
              </div>
              <div className="info-row">
                <strong>Tempo total de preparo:</strong> {totalPreparationTime} minutos
              </div>
            </div>
            
            <div className="order-items">
              <h4>Itens do Pedido:</h4>
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-details">
                    <span className="item-quantity">{item.quantity}x</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-category">({item.category})</span>
                    {item.notes && (
                      <span className="item-notes">Obs: {item.notes}</span>
                    )}
                  </div>
                  <div className="item-info">
                    <span className="item-time">{item.preparationTime}min</span>
                    <span className="item-price">R$ {(item.quantity * item.price).toFixed(2).replace('.', ',')}</span>
                  </div>
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
                  moveOrder(selectedOrder.id, 'preparing')
                  setShowModal(false)
                }}
              >
                Iniciar Preparo
              </button>
            )}
            
            {selectedOrder.status === 'preparing' && (
              <button 
                className="btn-primary"
                onClick={() => {
                  moveOrder(selectedOrder.id, 'ready')
                  setShowModal(false)
                }}
              >
                Marcar como Pronto
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="kitchen-container">
        <div className="loading">Carregando pedidos da cozinha...</div>
      </div>
    )
  }

  return (
    <div className="kitchen-container">
      <div className="kitchen-header">
        <h1>🏪 Cozinha</h1>
        <div className="kitchen-stats">
          <div className="stat-card">
            <span className="stat-label">Pendentes</span>
            <span className="stat-value pending">{pendingOrders.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Preparando</span>
            <span className="stat-value preparing">{preparingOrders.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Prontos</span>
            <span className="stat-value ready">{readyOrders.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total</span>
            <span className="stat-value">{orders.length}</span>
          </div>
        </div>
      </div>

      <div className="kitchen-board">
        <div 
          className="kitchen-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'pending')}
        >
          <div className="column-header pending">
            <span>⏳ Pendentes</span>
            <span className="order-count">{pendingOrders.length}</span>
          </div>
          <div className="order-list">
            {pendingOrders.map(order => (
              <KitchenOrderCard 
                key={order.id} 
                order={order} 
                onMove={moveOrder}
              />
            ))}
          </div>
        </div>

        <div 
          className="kitchen-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'preparing')}
        >
          <div className="column-header preparing">
            <span>👨‍🍳 Preparando</span>
            <span className="order-count">{preparingOrders.length}</span>
          </div>
          <div className="order-list">
            {preparingOrders.map(order => (
              <KitchenOrderCard 
                key={order.id} 
                order={order} 
                onMove={moveOrder}
              />
            ))}
          </div>
        </div>

        <div 
          className="kitchen-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'ready')}
        >
          <div className="column-header ready">
            <span>✅ Prontos</span>
            <span className="order-count">{readyOrders.length}</span>
          </div>
          <div className="order-list">
            {readyOrders.map(order => (
              <KitchenOrderCard 
                key={order.id} 
                order={order} 
                onMove={moveOrder}
              />
            ))}
          </div>
        </div>
      </div>

      {showModal && <OrderModal />}
    </div>
  )
}

export default Kitchen