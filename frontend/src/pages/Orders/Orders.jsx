import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Clock, Users, MapPin, Phone, Eye, CheckCircle, XCircle, Grid3X3, Printer } from 'lucide-react'
import CancelOrderModal from '../../components/CancelOrderModal/CancelOrderModal'
import PrintPreview from '../../components/PrintPreview/PrintPreview'
import './Orders.css'

const Orders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('orders') // 'orders' ou 'tables'
  const [draggedOrder, setDraggedOrder] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [showPrintPreview, setShowPrintPreview] = useState(false)
  const [printData, setPrintData] = useState(null)
  const [printType, setPrintType] = useState('customer')

  // Estados das colunas
  const [pendingOrders, setPendingOrders] = useState([])
  const [confirmedOrders, setConfirmedOrders] = useState([])
  const [sentOrders, setSentOrders] = useState([])

  // Estados das mesas
  const [tables, setTables] = useState([])

  // Buscar pedidos e mesas
  useEffect(() => {
    fetchOrders()
    fetchTables()
    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      fetchOrders()
      fetchTables()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        const formattedOrders = data.data.map(order => ({
          id: order.id,
          orderNumber: order.order_number || String(order.id).padStart(3, '0'),
          type: order.order_type === 'delivery' ? 'DELIVERY' : order.order_type === 'takeaway' ? 'RETIRADA' : 'MESA',
          customer: order.customer?.name || 'Cliente',
          time: new Date(order.created_at),
          createdAt: new Date(order.created_at),
          address: order.delivery_address?.street || null,
          phone: order.customer?.phone || null,
          subtotal: parseFloat(order.subtotal),
          discount: parseFloat(order.discount_amount),
          serviceFee: parseFloat(order.service_fee),
          tip: parseFloat(order.tax_amount),
          total: parseFloat(order.total),
          platform: order.delivery_address?.platform || null,
          status: order.status,
          tableNumber: order.table_number,
          waiter: order.user?.name || 'Sistema',
          paymentMethod: order.payments?.[0]?.method || null,
          items: order.order_items?.map(item => ({
            name: item.product?.name || 'Produto',
            quantity: item.quantity,
            price: item.unit_price,
            notes: item.notes
          })) || []
        }))

        setOrders(formattedOrders)
        setPendingOrders(formattedOrders.filter(order => order.status === 'pending'))
        setConfirmedOrders(formattedOrders.filter(order => order.status === 'confirmed'))
        setSentOrders(formattedOrders.filter(order => order.status === 'sent'))
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
    }
  }

  const fetchTables = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/tables`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setTables(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar mesas:', error)
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
    e.dataTransfer.setData('application/json', JSON.stringify(order))
    e.currentTarget.style.opacity = '0.5'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetStatus) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (draggedOrder && draggedOrder.status !== targetStatus) {
      moveOrder(draggedOrder.id, targetStatus)
    }
    setDraggedOrder(null)
  }

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
    setDraggedOrder(null)
  }

  const openOrderModal = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handlePrintReceipt = (order, type, e) => {
    if (e) e.stopPropagation()
    setPrintData(order)
    setPrintType(type) // 'kitchen' ou 'customer'
    setShowPrintPreview(true)
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
    // Gera um número de pedido formatado (apenas os 3 dígitos)
    const orderNumber = order.orderNumber ? order.orderNumber.replace('PED-', '') : String(order.id).padStart(3, '0')
    
    return (
      <div 
        className="order-card"
        draggable="true"
        onDragStart={(e) => handleDragStart(e, order)}
        onDragEnd={handleDragEnd}
        onDoubleClick={() => openOrderModal(order)}
      >
        {/* Número do pedido e Mesa/Delivery no topo */}
        <div className="card-top">
          <span className="order-number">{orderNumber}</span>
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
        
        {/* Botões de ação */}
        <div className="card-actions">
          <button 
            className="btn-action btn-print"
            onClick={(e) => handlePrintReceipt(order, 'customer', e)}
            title="Imprimir Cupom"
          >
            <Printer size={22} />
          </button>

          <button 
            className="btn-action btn-cancel"
            onClick={(e) => {
              e.stopPropagation()
              openCancelModal(order)
            }}
            title="Cancelar pedido"
          >
            <XCircle size={22} />
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

  return (
    <div className="orders-page">
      <div className="orders-page-header">
        <h1>Gestão de Pedidos</h1>
        
        {/* Abas */}
        <div className="orders-tabs">
          <button 
            className={`orders-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Grid3X3 size={16} />
            Pedidos
          </button>
          <button 
            className={`orders-tab-btn ${activeTab === 'tables' ? 'active' : ''}`}
            onClick={() => setActiveTab('tables')}
          >
            <Users size={16} />
            Mesas
          </button>
        </div>

        <div className="orders-stats">
          <div className="orders-stat-card">
            <span className="orders-stat-label">Pedidos</span>
            <span className="orders-stat-value">{orders.length}</span>
          </div>
          <div className="orders-stat-card">
            <span className="orders-stat-label">Pendentes</span>
            <span className="orders-stat-value">{pendingOrders.length}</span>
          </div>
          <div className="orders-stat-card">
            <span className="orders-stat-label">Confirmados</span>
            <span className="orders-stat-value">{confirmedOrders.length}</span>
          </div>
          <div className="orders-stat-card">
            <span className="orders-stat-label">Enviados</span>
            <span className="orders-stat-value">{sentOrders.length}</span>
          </div>
          <div className="orders-stat-card">
            <span className="orders-stat-label">Mesas Ocupadas</span>
            <span className="orders-stat-value">{tables.filter(t => t.isOccupied).length}</span>
          </div>
          <div className="orders-stat-card">
            <span className="orders-stat-label">Total</span>
            <span className="orders-stat-value">
              R$ {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="orders-board">
          <div 
            className="orders-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'pending')}
          >
            <div className="orders-column-header pending">
              <span>Pendentes</span>
              <span className="orders-count">{pendingOrders.length}</span>
            </div>
            <div className="orders-list">
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
            className="orders-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'confirmed')}
          >
            <div className="orders-column-header confirmed">
              <span>Confirmados</span>
              <span className="orders-count">{confirmedOrders.length}</span>
            </div>
            <div className="orders-list">
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
            className="orders-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'sent')}
          >
            <div className="orders-column-header sent">
              <span>Enviados</span>
              <span className="orders-count">{sentOrders.length}</span>
            </div>
            <div className="orders-list">
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

      {/* Print Preview Modal */}
      <PrintPreview
        isOpen={showPrintPreview}
        onClose={() => setShowPrintPreview(false)}
        type={printType}
        data={printData}
      />
    </div>
  )
}

export default Orders