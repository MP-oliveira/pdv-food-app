import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Clock, Users, ChefHat, Eye, CheckCircle, XCircle, AlertCircle, Printer } from 'lucide-react'
import PrintPreview from '../../components/PrintPreview/PrintPreview'
import './Kitchen.css'

const Kitchen = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [draggedOrder, setDraggedOrder] = useState(null)
  const [showPrintPreview, setShowPrintPreview] = useState(false)
  const [printData, setPrintData] = useState(null)

  // Estados das colunas da cozinha
  const [pendingOrders, setPendingOrders] = useState([])
  const [preparingOrders, setPreparingOrders] = useState([])
  const [readyOrders, setReadyOrders] = useState([])

  // Buscar pedidos da cozinha
  useEffect(() => {
    fetchKitchenOrders()
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchKitchenOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchKitchenOrders = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders?status=pending,preparing,ready&type=kitchen`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        const kitchenOrders = data.data.map(order => ({
          id: order.id,
          orderNumber: order.order_number?.replace('PED-', '') || String(order.id).padStart(3, '0'),
          customer: order.customer?.name || 'Cliente',
          tableNumber: order.table_number,
          type: order.order_type === 'delivery' ? 'DELIVERY' : 'MESA',
          time: new Date(order.created_at),
          status: order.status,
          items: order.order_items?.map(item => ({
            name: item.product?.name || 'Produto',
            quantity: item.quantity,
            price: item.unit_price,
            preparationTime: item.product?.preparation_time || 15,
            notes: item.notes
          })) || [],
          total: order.total
        }))

        setOrders(kitchenOrders)
        setPendingOrders(kitchenOrders.filter(order => order.status === 'pending'))
        setPreparingOrders(kitchenOrders.filter(order => order.status === 'preparing'))
        setReadyOrders(kitchenOrders.filter(order => order.status === 'ready'))
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar pedidos da cozinha:', error)
      setLoading(false)
    }
  }

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

  const handlePrintKitchen = (order, e) => {
    if (e) e.stopPropagation()
    setPrintData(order)
    setShowPrintPreview(true)
  }

  const KitchenOrderCard = ({ order, onMove }) => (
    <div 
      className="kitchen-order-card"
      draggable
      onDragStart={(e) => handleDragStart(e, order)}
      onDragEnd={handleDragEnd}
      onClick={() => openOrderModal(order)}
    >
      {/* Número do pedido e Mesa/Delivery no topo */}
      <div className="card-top">
        <span className="order-number">#{order.orderNumber}</span>
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
              {item.notes && (
                <span className="item-note">({item.notes})</span>
              )}
            </div>
            <span className="item-prep-time">{item.preparationTime}min</span>
          </div>
        ))}
      </div>
      
      {/* Botões de ação */}
      <div className="card-actions">
        <button 
          className="btn-action btn-print"
          onClick={(e) => handlePrintKitchen(order, e)}
          title="Imprimir Comanda"
        >
          <Printer size={25} />
        </button>

        {order.status === 'pending' && (
          <button 
            className="btn-action btn-start"
            onClick={(e) => {
              e.stopPropagation()
              onMove(order.id, 'preparing')
            }}
          >
            PRONTO
          </button>
        )}
        
        {order.status === 'preparing' && (
          <button 
            className="btn-action btn-ready"
            onClick={(e) => {
              e.stopPropagation()
              onMove(order.id, 'ready')
            }}
          >
            ENTREGUE
          </button>
        )}
        
        {order.status === 'ready' && (
          <button 
            className="btn-action btn-delivered"
            onClick={(e) => {
              e.stopPropagation()
              console.log('Pedido entregue:', order.id)
            }}
          >
            CONCLUÍDO
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
        <h1>Cozinha</h1>
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
            <span>Pendentes</span>
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
            <span>Preparando</span>
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
            <span>Prontos</span>
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
      
      {/* Print Preview Modal */}
      <PrintPreview
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        type="kitchen"
        data={printData}
      />
    </div>
  )
}

export default Kitchen