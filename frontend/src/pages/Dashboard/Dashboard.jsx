import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import StatsCard from '../../components/StatsCard/StatsCard'
import RecentOrders from '../../components/RecentOrders/RecentOrders'
import QuickActions from '../../components/QuickActions/QuickActions'
import { 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp,
  ChefHat,
  Package
} from 'lucide-react'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        const dashboardStats = [
          {
            title: 'Pedidos Hoje',
            value: data.data.orders_today || '0',
            change: data.data.orders_change || '0%',
            changeType: parseFloat(data.data.orders_change) > 0 ? 'positive' : 'negative',
            icon: ShoppingCart,
            color: 'blue'
          },
          {
            title: 'Receita Hoje',
            value: `R$ ${(data.data.revenue_today || 0).toFixed(2).replace('.', ',')}`,
            change: data.data.revenue_change || '0%',
            changeType: parseFloat(data.data.revenue_change) > 0 ? 'positive' : 'negative',
            icon: DollarSign,
            color: 'green'
          },
          {
            title: 'Clientes Ativos',
            value: data.data.active_customers || '0',
            change: data.data.customers_change || '0',
            changeType: 'positive',
            icon: Users,
            color: 'purple'
          },
          {
            title: 'Produtos em Estoque',
            value: data.data.products_in_stock || '0',
            change: data.data.stock_change || '0',
            changeType: parseInt(data.data.stock_change) < 0 ? 'negative' : 'positive',
            icon: Package,
            color: 'orange'
          }
        ]
        setStats(dashboardStats)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
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
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="dashboard-subtitle">
            Bem-vindo ao PDV Food App - {getRoleLabel(user?.role)}
          </p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main">
          <RecentOrders />
        </div>
        
        <div className="dashboard-sidebar">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
