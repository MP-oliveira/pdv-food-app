import React, { useState } from 'react'
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import './Header.css'

const Header = ({ user, onMenuClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { signOut } = useAuth()

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
        <button className="header-notification-btn" aria-label="Notificações">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

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
