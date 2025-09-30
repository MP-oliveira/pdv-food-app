import React, { useState } from 'react'
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import './Header.css'

const Header = ({ user, onMenuClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { signOut } = useAuth()
  
  // Notificações com estado
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Novo Pedido #123',
      message: 'Mesa 5 - R$ 85,00',
      time: 'Há 2 minutos',
      read: false,
      type: 'order'
    },
    {
      id: 2,
      title: 'Pedido Pronto',
      message: 'Pedido #120 está pronto para entrega',
      time: 'Há 5 minutos',
      read: false,
      type: 'kitchen'
    },
    {
      id: 3,
      title: 'Estoque Baixo',
      message: 'Coca-Cola 600ml - 5 unidades',
      time: 'Há 1 hora',
      read: true,
      type: 'stock'
    }
  ])
  
  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const markAllAsRead = (e) => {
    e.stopPropagation()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  // Fechar dropdowns quando clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.header-notifications')) {
        setShowNotifications(false)
      }
      if (showUserMenu && !event.target.closest('.header-user')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications, showUserMenu])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  const getRoleLabel = (role) => {
    const roles = {
      admin: 'Administrador',
      garcom: 'Garçom',
      caixa: 'Caixa',
      cozinha: 'Cozinha'
    }
    return roles[role] || role
  }

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="header-menu-btn"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
        
        <div className="header-title">
          <h1>PDV Food App</h1>
        </div>
      </div>

      <div className="header-right">
        <div className="header-notifications">
          <button 
            className="header-notification-btn" 
            aria-label="Notificações"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notificações</h3>
                {unreadCount > 0 && (
                  <span className="unread-count">{unreadCount} não lidas</span>
                )}
              </div>
              
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <Bell size={32} />
                    <p>Nenhuma notificação</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="notification-content">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                      {!notification.read && (
                        <div className="notification-dot"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="notifications-footer">
                  <button 
                    className="mark-all-read"
                    onClick={markAllAsRead}
                  >
                    Marcar todas como lidas
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="header-user">
          <button 
            className="header-user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="Menu do usuário"
          >
            <div className="user-avatar">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{getRoleLabel(user?.role)}</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-header">
                <div className="user-avatar-large">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} />
                  ) : (
                    <User size={24} />
                  )}
                </div>
                <div>
                  <p className="user-name-large">{user?.name}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>
              
              <div className="user-menu-divider"></div>
              
              <button className="user-menu-item">
                <Settings size={16} />
                Configurações
              </button>
              
              <button 
                className="user-menu-item user-menu-item-danger"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
