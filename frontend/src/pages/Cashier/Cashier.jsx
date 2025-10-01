import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Lock, 
  Unlock,
  Eye,
  Plus,
  Minus,
  FileText
} from 'lucide-react'
import OpenCashierModal from '../../components/OpenCashierModal/OpenCashierModal'
import './Cashier.css'

const Cashier = () => {
  const { user } = useAuth()
  const [cashierStatus, setCashierStatus] = useState(null) // 'open' | 'closed'
  const [currentCashier, setCurrentCashier] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [showOpenModal, setShowOpenModal] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  // Verificar status do caixa ao carregar
  useEffect(() => {
    checkCashierStatus()
  }, [])

  const checkCashierStatus = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/cashier/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setCashierStatus(data.data.status)
        if (data.data.cashier) {
          setCurrentCashier(data.data.cashier)
          setTransactions(data.data.cashier.transactions || [])
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status do caixa:', error)
      setCashierStatus('closed')
    }
  }

  const openCashier = async (initialAmount) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/cashier/open`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          initial_amount: parseFloat(initialAmount)
        })
      })

      const data = await response.json()

      if (data.success) {
        setCurrentCashier(data.data)
        setTransactions(data.data.transactions || [])
        setCashierStatus('open')
        setShowOpenModal(false)
      } else {
        alert(data.error || 'Erro ao abrir caixa')
      }
    } catch (error) {
      console.error('Erro ao abrir caixa:', error)
      alert('Erro ao abrir caixa')
    }
  }

  const addTransaction = async (type, amount, description) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/cashier/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          description
        })
      })

      const data = await response.json()

      if (data.success) {
        // Atualizar estado
        checkCashierStatus()
      } else {
        alert(data.error || 'Erro ao adicionar transação')
      }
    } catch (error) {
      console.error('Erro ao adicionar transação:', error)
      alert('Erro ao adicionar transação')
    }
  }

  const closeCashier = (closingData) => {
    const closedCashier = {
      ...currentCashier,
      closedBy: user?.name,
      closedAt: new Date(),
      ...closingData
    }

    // Salvar no histórico
    const history = JSON.parse(localStorage.getItem('cashier_history') || '[]')
    history.push(closedCashier)
    localStorage.setItem('cashier_history', JSON.stringify(history))

    // Limpar caixa atual
    localStorage.removeItem('current_cashier')
    setCurrentCashier(null)
    setTransactions([])
    setCashierStatus('closed')
    setShowCloseModal(false)
  }

  const getTransactionsByType = (type) => {
    return transactions.filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalSales = () => getTransactionsByType('sale')
  const getTotalWithdrawals = () => getTransactionsByType('withdrawal')
  const getTotalDeposits = () => getTransactionsByType('deposit')

  if (!user) return null

  return (
    <div className="cashier-container">
      {/* Header */}
      <div className="cashier-header">
        <h1>Gestão de Caixa</h1>
        <div className="cashier-status-badge">
          {cashierStatus === 'open' ? (
            <>
              <Unlock size={18} />
              <span>Caixa Aberto</span>
            </>
          ) : (
            <>
              <Lock size={18} />
              <span>Caixa Fechado</span>
            </>
          )}
        </div>
      </div>

      {cashierStatus === 'closed' ? (
        /* Caixa Fechado */
        <div className="cashier-closed-state">
          <div className="closed-icon">
            <Lock size={80} />
          </div>
          <h2>Caixa Fechado</h2>
          <p>Para começar a operar, você precisa abrir o caixa</p>
          <button 
            className="btn-open-cashier"
            onClick={() => setShowOpenModal(true)}
          >
            <Unlock size={20} />
            Abrir Caixa
          </button>
          <button 
            className="btn-view-history"
            onClick={() => setShowHistoryModal(true)}
          >
            <FileText size={20} />
            Ver Histórico
          </button>
        </div>
      ) : (
        /* Caixa Aberto */
        <>
          {/* Stats Cards */}
          <div className="cashier-stats">
            <div className="stat-card primary">
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Saldo Atual</span>
                <span className="stat-value">
                  R$ {(currentCashier?.current_amount || 0).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Vendas</span>
                <span className="stat-value">
                  R$ {getTotalSales().toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon red">
                <TrendingDown size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Sangrias</span>
                <span className="stat-value">
                  R$ {getTotalWithdrawals().toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">
                <Plus size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Reforços</span>
                <span className="stat-value">
                  R$ {getTotalDeposits().toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="cashier-actions">
            <button 
              className="action-card withdrawal"
              onClick={() => setShowManageModal(true)}
            >
              <TrendingDown size={32} />
              <span>Sangria</span>
              <small>Retirar dinheiro</small>
            </button>
            
            <button 
              className="action-card deposit"
              onClick={() => setShowManageModal(true)}
            >
              <TrendingUp size={32} />
              <span>Reforço</span>
              <small>Adicionar dinheiro</small>
            </button>
            
            <button 
              className="action-card history"
              onClick={() => setShowHistoryModal(true)}
            >
              <Eye size={32} />
              <span>Movimentações</span>
              <small>Ver histórico</small>
            </button>
            
            <button 
              className="action-card close"
              onClick={() => setShowCloseModal(true)}
            >
              <Lock size={32} />
              <span>Fechar Caixa</span>
              <small>Encerrar turno</small>
            </button>
          </div>

          {/* Transactions History */}
          <div className="transactions-section">
            <h2>Movimentações de Hoje</h2>
            <div className="transactions-list">
              {transactions.slice().reverse().map((transaction) => (
                <div 
                  key={transaction.id} 
                  className={`transaction-item ${transaction.type}`}
                >
                  <div className="transaction-icon">
                    {transaction.type === 'opening' && <Unlock size={20} />}
                    {transaction.type === 'sale' && <DollarSign size={20} />}
                    {transaction.type === 'withdrawal' && <TrendingDown size={20} />}
                    {transaction.type === 'deposit' && <TrendingUp size={20} />}
                  </div>
                  <div className="transaction-info">
                    <strong>{transaction.description}</strong>
                    <span className="transaction-meta">
                      {new Date(transaction.timestamp).toLocaleString('pt-BR')} • {transaction.user}
                    </span>
                  </div>
                  <div className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'withdrawal' ? '- ' : '+ '}
                    R$ {transaction.amount.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Open Cashier Modal */}
      <OpenCashierModal
        isOpen={showOpenModal}
        onClose={() => setShowOpenModal(false)}
        onConfirm={openCashier}
      />
    </div>
  )
}

export default Cashier
