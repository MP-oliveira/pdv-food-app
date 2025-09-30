import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import './StatsCard.css'

const StatsCard = ({ title, value, change, changeType, icon: Icon, color = 'blue' }) => {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-header">
        <div className="stats-card-icon">
          <Icon size={24} />
        </div>
        <div className="stats-card-change">
          {changeType === 'positive' ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span className={`change-${changeType}`}>{change}</span>
        </div>
      </div>
      
      <div className="stats-card-content">
        <h3 className="stats-card-title">{title}</h3>
        <p className="stats-card-value">{value}</p>
      </div>
    </div>
  )
}

export default StatsCard
