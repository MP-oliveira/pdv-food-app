import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Plus, Receipt, Users, ArrowRight, Merge, X, Check } from 'lucide-react'
import NewTabModal from '../../components/NewTabModal/NewTabModal'
import './Tabs.css'

const Tabs = () => {
  const { user } = useAuth()
  const [openTabs, setOpenTabs] = useState([])
  const [selectedTab, setSelectedTab] = useState(null)
  const [showNewTabModal, setShowNewTabModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tables, setTables] = useState([])

  useEffect(() => {
    fetchOpenTabs()
    fetchTables()
  }, [])

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

  const fetchOpenTabs = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/tabs?status=open`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setOpenTabs(data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar comandas:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCreateTab = async (tabData) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/tabs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tabData)
      })

      const data = await response.json()
      if (data.success) {
        fetchOpenTabs()
        setShowNewTabModal(false)
      } else {
        alert(data.error || 'Erro ao abrir comanda')
      }
    } catch (error) {
      console.error('Erro ao criar comanda:', error)
      alert('Erro ao criar comanda')
    }
  }

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        <h1>Comandas Abertas</h1>
        <button 
          className="btn-new-tab"
          onClick={() => setShowNewTabModal(true)}
        >
          <Plus size={20} />
          Nova Comanda
        </button>
      </div>

      <div className="tabs-stats">
        <div className="stat-card">
          <span className="stat-label">Comandas Abertas</span>
          <span className="stat-value">{openTabs.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total em Aberto</span>
          <span className="stat-value">
            {formatPrice(openTabs.reduce((sum, tab) => sum + parseFloat(tab.total || 0), 0))}
          </span>
        </div>
      </div>

      <div className="tabs-grid">
        {loading ? (
          <div className="loading">Carregando...</div>
        ) : openTabs.length === 0 ? (
          <div className="empty-state">
            <Receipt size={64} />
            <h3>Nenhuma comanda aberta</h3>
            <p>Clique em "Nova Comanda" para começar</p>
          </div>
        ) : (
          openTabs.map(tab => (
            <div 
              key={tab.id} 
              className="tab-card"
              onClick={() => setSelectedTab(tab)}
            >
              <div className="tab-card-header">
                <span className="tab-number">{tab.tab_number}</span>
                {tab.table && (
                  <span className="tab-table">Mesa {tab.table.number}</span>
                )}
              </div>
              
              <div className="tab-customer">
                <Users size={16} />
                <strong>{tab.customer_name}</strong>
              </div>
              
              <div className="tab-info">
                <span className="tab-time">Aberta às {formatTime(tab.opened_at)}</span>
                <span className="tab-items">{tab.items?.length || 0} itens</span>
              </div>
              
              <div className="tab-total">
                {formatPrice(tab.total || 0)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Tab Modal */}
      <NewTabModal
        isOpen={showNewTabModal}
        onClose={() => setShowNewTabModal(false)}
        onConfirm={handleCreateTab}
        tables={tables}
      />
    </div>
  )
}

export default Tabs
