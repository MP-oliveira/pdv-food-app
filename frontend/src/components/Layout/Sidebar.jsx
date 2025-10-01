import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Menu as MenuIcon, 
  ChefHat, 
  ShoppingCart, 
  Users, 
  Package, 
  BarChart3, 
  Settings,
  X,
  CreditCard,
  Wallet,
  Receipt,
  History,
  UserCheck,
  FileText,
  Clock,
  Calendar,
  Gift
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import './Sidebar.css'

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()

  const menuItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Dashboard',
      roles: ['admin', 'garcom', 'caixa', 'cozinha']
    },
    {
      path: '/pdv',
      icon: CreditCard,
      label: 'PDV',
      roles: ['admin', 'garcom', 'caixa']
    },
    {
      path: '/cardapio',
      icon: MenuIcon,
      label: 'Cardápio',
      roles: ['admin', 'garcom']
    },
    {
      path: '/kitchen',
      icon: ChefHat,
      label: 'Cozinha',
      roles: ['admin', 'cozinha']
    },
    {
      path: '/orders',
      icon: ShoppingCart,
      label: 'Pedidos',
      roles: ['admin', 'garcom', 'caixa']
    },
    {
      path: '/cashier',
      icon: Wallet,
      label: 'Caixa',
      roles: ['admin', 'caixa']
    },
    {
      path: '/tabs',
      icon: Receipt,
      label: 'Comandas',
      roles: ['admin', 'garcom', 'caixa']
    },
    {
      path: '/customers',
      icon: Users,
      label: 'Clientes',
      roles: ['admin', 'garcom', 'caixa']
    },
    {
      path: '/products',
      icon: Package,
      label: 'Produtos',
      roles: ['admin']
    },
    {
      path: '/stock-history',
      icon: FileText,
      label: 'Histórico Estoque',
      roles: ['admin']
    },
    {
      path: '/waiter-sales',
      icon: FileText,
      label: 'Vendas Garçom',
      roles: ['admin']
    },
    {
      path: '/queue',
      icon: Clock,
      label: 'Fila de Espera',
      roles: ['admin', 'garcom']
    },
    {
      path: '/reservations',
      icon: Calendar,
      label: 'Reservas',
      roles: ['admin', 'garcom']
    },
    {
      path: '/loyalty',
      icon: Gift,
      label: 'Fidelidade',
      roles: ['admin', 'garcom', 'caixa']
    },
    {
      path: '/reports',
      icon: BarChart3,
      label: 'Relatórios',
      roles: ['admin', 'caixa']
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Configurações',
      roles: ['admin']
    }
  ]

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  )

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button 
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="user-avatar-small">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-details">
              <p className="user-name-small">{user?.name}</p>
              <p className="user-role-small">
                {user?.role === 'admin' && 'Administrador'}
                {user?.role === 'garcom' && 'Garçom'}
                {user?.role === 'caixa' && 'Caixa'}
                {user?.role === 'cozinha' && 'Cozinha'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
