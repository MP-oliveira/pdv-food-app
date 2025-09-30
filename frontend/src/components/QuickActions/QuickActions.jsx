import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { 
  Plus, 
  ShoppingCart, 
  ChefHat, 
  Users, 
  Package,
  BarChart3
} from 'lucide-react'
import './QuickActions.css'

const QuickActions = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const getActionsForRole = (role) => {
    const allActions = [
      {
        id: 'new-order',
        title: 'Novo Pedido',
        description: 'Criar um novo pedido',
        icon: Plus,
        color: 'blue',
        path: '/menu',
        roles: ['admin', 'garcom']
      },
      {
        id: 'view-orders',
        title: 'Ver Pedidos',
        description: 'Visualizar todos os pedidos',
        icon: ShoppingCart,
        color: 'green',
        path: '/orders',
        roles: ['admin', 'garcom', 'caixa']
      },
      {
        id: 'kitchen',
        title: 'Cozinha',
        description: 'Gerenciar pedidos da cozinha',
        icon: ChefHat,
        color: 'orange',
        path: '/kitchen',
        roles: ['admin', 'cozinha']
      },
      {
        id: 'customers',
        title: 'Clientes',
        description: 'Gerenciar clientes',
        icon: Users,
        color: 'purple',
        path: '/customers',
        roles: ['admin', 'garcom', 'caixa']
      },
      {
        id: 'products',
        title: 'Produtos',
        description: 'Gerenciar produtos e estoque',
        icon: Package,
        color: 'red',
        path: '/products',
        roles: ['admin']
      },
      {
        id: 'reports',
        title: 'Relatórios',
        description: 'Visualizar relatórios financeiros',
        icon: BarChart3,
        color: 'indigo',
        path: '/reports',
        roles: ['admin', 'caixa']
      }
    ]

    return allActions.filter(action => action.roles.includes(role))
  }

  const actions = getActionsForRole(user?.role)

  const handleActionClick = (path) => {
    navigate(path)
  }

  return (
    <div className="quick-actions">
      <div className="quick-actions-header">
        <h2>Ações Rápidas</h2>
        <p>Atalhos para funções principais</p>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              className={`quick-action-btn quick-action-${action.color}`}
              onClick={() => handleActionClick(action.path)}
            >
              <div className="quick-action-icon">
                <Icon size={20} />
              </div>
              <div className="quick-action-content">
                <h3 className="quick-action-title">{action.title}</h3>
                <p className="quick-action-description">{action.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
