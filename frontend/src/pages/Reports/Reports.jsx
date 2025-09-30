import React from 'react'
import { BarChart3, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import './Reports.css'

const Reports = () => {
  const stats = [
    {
      title: 'Receita Total',
      value: 'R$ 12.450,00',
      change: '+15%',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Pedidos Hoje',
      value: '45',
      change: '+8%',
      icon: BarChart3,
      color: 'blue'
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 32,50',
      change: '+5%',
      icon: TrendingUp,
      color: 'purple'
    }
  ]

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>Relatórios</h1>
        <div className="date-filter">
          <Calendar size={20} />
          <select>
            <option value="today">Hoje</option>
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="year">Este Ano</option>
          </select>
        </div>
      </div>

      <div className="reports-stats">
        {stats.map((stat, index) => (
          <div key={index} className={`stats-card stats-${stat.color}`}>
            <div className="stats-icon">
              <stat.icon size={24} />
            </div>
            <div className="stats-content">
              <h3>{stat.title}</h3>
              <p className="stats-value">{stat.value}</p>
              <p className="stats-change">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="reports-content">
        <div className="chart-placeholder">
          <BarChart3 size={48} />
          <h3>Gráfico de Vendas</h3>
          <p>Visualização dos dados de vendas por período</p>
        </div>
      </div>
    </div>
  )
}

export default Reports
