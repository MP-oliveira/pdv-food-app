import React, { useState } from 'react'
import { BarChart3, DollarSign, TrendingUp, Calendar, Download, FileSpreadsheet } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import './Reports.css'

const Reports = () => {
  const [dateRange, setDateRange] = useState('month')

  // Dados mockados para o gráfico
  const salesData = [
    { name: 'Seg', vendas: 4000, pedidos: 24 },
    { name: 'Ter', vendas: 3000, pedidos: 18 },
    { name: 'Qua', vendas: 5000, pedidos: 32 },
    { name: 'Qui', vendas: 4500, pedidos: 28 },
    { name: 'Sex', vendas: 6000, pedidos: 38 },
    { name: 'Sáb', vendas: 8000, pedidos: 52 },
    { name: 'Dom', vendas: 7000, pedidos: 45 }
  ]

  const handleExport = async (type) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      let url = `${import.meta.env.VITE_API_URL}/export/${type}/excel`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = downloadUrl
        a.download = `${type}_${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
      } else {
        alert('Erro ao exportar. Verifique se há dados disponíveis.')
      }
    } catch (error) {
      console.error('Erro ao exportar:', error)
      alert('Erro ao exportar dados')
    }
  }
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
        <div className="header-left">
          <h1>Relatórios</h1>
          <div className="date-filter">
            <Calendar size={20} />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="today">Hoje</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mês</option>
              <option value="year">Este Ano</option>
            </select>
          </div>
        </div>

        <div className="export-buttons">
          <button className="btn-export" onClick={() => handleExport('sales')}>
            <FileSpreadsheet size={18} />
            Exportar Vendas
          </button>
          <button className="btn-export" onClick={() => handleExport('dre')}>
            <Download size={18} />
            Exportar DRE
          </button>
          <button className="btn-export" onClick={() => handleExport('products')}>
            <FileSpreadsheet size={18} />
            Exportar Produtos
          </button>
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
        <div className="chart-section">
          <h3>📊 Vendas da Semana</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                formatter={(value) => ['R$ ' + value.toLocaleString('pt-BR'), '']}
              />
              <Legend />
              <Bar dataKey="vendas" fill="#3b82f6" name="Vendas (R$)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h3>📈 Evolução de Pedidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="pedidos" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Pedidos"
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Reports
