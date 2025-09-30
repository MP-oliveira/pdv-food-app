import React from 'react'
import { Clock, User, MapPin } from 'lucide-react'
import './RecentOrders.css'

const RecentOrders = () => {
  // Dados mockados para demonstração
  const orders = [
    {
      id: 1,
      orderNumber: 'PED-001',
      customer: 'João Silva',
      table: 'Mesa 5',
      total: 45.90,
      status: 'preparing',
      time: '10 min',
      items: ['Hambúrguer Clássico', 'Refrigerante']
    },
    {
      id: 2,
      orderNumber: 'PED-002',
      customer: 'Maria Santos',
      table: 'Mesa 2',
      total: 78.50,
      status: 'ready',
      time: '5 min',
      items: ['Pizza Margherita', 'Suco Natural']
    },
    {
      id: 3,
      orderNumber: 'PED-003',
      customer: 'Pedro Costa',
      table: 'Delivery',
      total: 32.40,
      status: 'delivered',
      time: '15 min',
      items: ['Hambúrguer Clássico', 'Pudim']
    },
    {
      id: 4,
      orderNumber: 'PED-004',
      customer: 'Ana Oliveira',
      table: 'Mesa 1',
      total: 56.80,
      status: 'pending',
      time: '2 min',
      items: ['Pizza Margherita', 'Refrigerante', 'Pudim']
    }
  ]

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Pronto',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    }
    return statusLabels[status] || status
  }

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'orange',
      confirmed: 'blue',
      preparing: 'yellow',
      ready: 'green',
      delivered: 'gray',
      cancelled: 'red'
    }
    return statusColors[status] || 'gray'
  }

  return (
    <div className="recent-orders">
      <div className="recent-orders-header">
        <h2>Pedidos Recentes</h2>
        <button className="btn btn-secondary btn-sm">
          Ver Todos
        </button>
      </div>

      <div className="recent-orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <div className="order-header">
              <div className="order-info">
                <h3 className="order-number">{order.orderNumber}</h3>
                <div className="order-customer">
                  <User size={14} />
                  <span>{order.customer}</span>
                </div>
              </div>
              <div className="order-status">
                <span className={`status-badge status-${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>

            <div className="order-details">
              <div className="order-location">
                <MapPin size={14} />
                <span>{order.table}</span>
              </div>
              <div className="order-time">
                <Clock size={14} />
                <span>{order.time}</span>
              </div>
              <div className="order-total">
                R$ {order.total.toFixed(2)}
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <span key={index} className="order-item-tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentOrders
