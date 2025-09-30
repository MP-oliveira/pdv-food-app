import React from 'react'
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

  // Dados mockados para demonstração
  const stats = [
    {
      title: 'Pedidos Hoje',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      title: 'Receita Hoje',
      value: 'R$ 1.247,50',
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Clientes Ativos',
      value: '18',
      change: '+3',
      changeType: 'positive',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Produtos em Estoque',
      value: '156',
      change: '-5',
      changeType: 'negative',
      icon: Package,
      color: 'orange'
    }
  ]

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
