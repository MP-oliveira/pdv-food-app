import React, { useState } from 'react'
import { Search, Plus, Edit, Package, TrendingUp } from 'lucide-react'
import StockEntryModal from '../../components/StockEntryModal/StockEntryModal'
import './Products.css'

const Products = () => {
  const [showStockModal, setShowStockModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const handleStockEntry = async (stockData) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/stock/movement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(stockData)
      })

      const data = await response.json()
      if (data.success) {
        alert('Estoque atualizado com sucesso!')
        setShowStockModal(false)
        setSelectedProduct(null)
        // Aqui você recarregaria os produtos
      } else {
        alert(data.error || 'Erro ao atualizar estoque')
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error)
      alert('Erro ao atualizar estoque')
    }
  }

  const openStockModal = (product) => {
    setSelectedProduct(product)
    setShowStockModal(true)
  }

  const products = [
    {
      id: 1,
      name: 'Hambúrguer Clássico',
      price: 25.90,
      category: 'Pratos Principais',
      stock: 50,
      available: true
    },
    {
      id: 2,
      name: 'Pizza Margherita',
      price: 35.90,
      category: 'Pratos Principais',
      stock: 30,
      available: true
    }
  ]

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Produtos</h1>
        <button className="btn btn-primary">
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="products-filters">
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Buscar produtos..." />
        </div>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-header">
              <div className="product-icon">
                <Package size={24} />
              </div>
              <div className="product-actions">
                <button className="btn btn-secondary btn-sm">
                  <Edit size={16} />
                </button>
              </div>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-price">R$ {product.price.toFixed(2)}</p>
              <p className="product-category">{product.category}</p>
              <p className="product-stock">Estoque: {product.stock}</p>
              <button 
                className="btn-stock-entry"
                onClick={() => openStockModal(product)}
                title="Adicionar estoque"
              >
                <TrendingUp size={18} />
                Entrada
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Entry Modal */}
      <StockEntryModal
        isOpen={showStockModal}
        onClose={() => {
          setShowStockModal(false)
          setSelectedProduct(null)
        }}
        onConfirm={handleStockEntry}
        product={selectedProduct}
      />
    </div>
  )
}

export default Products
