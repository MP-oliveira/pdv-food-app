import React from 'react'
import { Search, Plus, Edit, Eye } from 'lucide-react'
import './Customers.css'

const Customers = () => {
  const customers = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      totalOrders: 15,
      totalSpent: 450.50,
      lastOrder: '2024-01-15'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '(11) 88888-8888',
      totalOrders: 8,
      totalSpent: 320.75,
      lastOrder: '2024-01-14'
    }
  ]

  return (
    <div className="customers-page">
      <div className="customers-header">
        <h1>Clientes</h1>
        <button className="btn btn-primary">
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="customers-filters">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Buscar clientes..." />
        </div>
      </div>

      <div className="customers-grid">
        {customers.map(customer => (
          <div key={customer.id} className="customer-card">
            <div className="customer-header">
              <h3>{customer.name}</h3>
              <div className="customer-actions">
                <button className="btn btn-secondary btn-sm">
                  <Eye size={16} />
                </button>
                <button className="btn btn-primary btn-sm">
                  <Edit size={16} />
                </button>
              </div>
            </div>
            <div className="customer-info">
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Telefone:</strong> {customer.phone}</p>
              <p><strong>Pedidos:</strong> {customer.totalOrders}</p>
              <p><strong>Total Gasto:</strong> R$ {customer.totalSpent.toFixed(2)}</p>
              <p><strong>Último Pedido:</strong> {customer.lastOrder}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Customers
