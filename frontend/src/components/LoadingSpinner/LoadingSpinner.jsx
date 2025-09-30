import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner = ({ size = 'medium', text = 'Carregando...' }) => {
  return (
    <div className="loading-spinner">
      <div className={`spinner spinner-${size}`}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
