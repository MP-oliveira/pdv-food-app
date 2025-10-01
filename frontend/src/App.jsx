import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Menu from './pages/Menu/Menu'
import Kitchen from './pages/Kitchen/Kitchen'
import Orders from './pages/Orders/Orders'
import Customers from './pages/Customers/Customers'
import Products from './pages/Products/Products'
import Reports from './pages/Reports/Reports'
import Settings from './pages/Settings/Settings'
import PDV from './pages/PDV/PDV'
import Cashier from './pages/Cashier/Cashier'
import Tabs from './pages/Tabs/Tabs'
import StockHistory from './pages/StockHistory/StockHistory'
import WaiterSales from './pages/WaiterSales/WaiterSales'
import Queue from './pages/Queue/Queue'
import Reservations from './pages/Reservations/Reservations'
import Loyalty from './pages/Loyalty/Loyalty'
import DigitalMenu from './pages/DigitalMenu/DigitalMenu'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  // Rotas públicas (sem autenticação)
  const publicRoutes = (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/menu/:restaurantId" element={<DigitalMenu />} />
      <Route path="/menu" element={<DigitalMenu />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )

  if (!user) {
    return publicRoutes
  }

  return (
    <Routes>
      {/* Rotas públicas (sem Layout) */}
      <Route path="/menu/:restaurantId" element={<DigitalMenu />} />
      <Route path="/menu" element={<DigitalMenu />} />
      
      {/* Rotas autenticadas (com Layout) */}
      <Route path="/" element={<Layout><Navigate to="/dashboard" replace /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/pdv" element={<Layout><PDV /></Layout>} />
      <Route path="/cardapio" element={<Layout><Menu /></Layout>} />
      <Route path="/kitchen" element={<Layout><Kitchen /></Layout>} />
      <Route path="/orders" element={<Layout><Orders /></Layout>} />
      <Route path="/cashier" element={<Layout><Cashier /></Layout>} />
      <Route path="/tabs" element={<Layout><Tabs /></Layout>} />
      <Route path="/customers" element={<Layout><Customers /></Layout>} />
      <Route path="/products" element={<Layout><Products /></Layout>} />
      <Route path="/stock-history" element={<Layout><StockHistory /></Layout>} />
      <Route path="/waiter-sales" element={<Layout><WaiterSales /></Layout>} />
      <Route path="/queue" element={<Layout><Queue /></Layout>} />
      <Route path="/reservations" element={<Layout><Reservations /></Layout>} />
      <Route path="/loyalty" element={<Layout><Loyalty /></Layout>} />
      <Route path="/reports" element={<Layout><Reports /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
      <Route path="*" element={<Layout><Navigate to="/dashboard" replace /></Layout>} />
    </Routes>
  )
}

export default App
