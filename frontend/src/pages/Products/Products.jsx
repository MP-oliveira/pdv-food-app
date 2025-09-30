import React from 'react'
import { Search, Plus, Edit, Package } from 'lucide-react'
import './Products.css'

const Products = () => {
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
