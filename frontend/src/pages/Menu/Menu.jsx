import React, { useState } from 'react'
import { Search, Filter, ShoppingCart, Plus, Minus } from 'lucide-react'
import './Menu.css'

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])

  // Dados mockados
  const categories = [
    { id: 'all', name: 'Todos', color: '#3B82F6' },
    { id: 1, name: 'Pratos Principais', color: '#FF6B6B' },
    { id: 2, name: 'Bebidas', color: '#4ECDC4' },
    { id: 3, name: 'Sobremesas', color: '#45B7D1' }
  ]

  const products = [
    {
      id: 1,
      name: 'Hambúrguer Clássico',
      description: 'Hambúrguer com carne, queijo, alface, tomate e molho especial',
      price: 25.90,
      category_id: 1,
      image: '/api/placeholder/300/200',
      available: true
    },
    {
      id: 2,
      name: 'Pizza Margherita',
      description: 'Pizza com molho de tomate, mussarela e manjericão',
      price: 35.90,
      category_id: 1,
      image: '/api/placeholder/300/200',
      available: true
    },
    {
      id: 3,
      name: 'Refrigerante Lata',
      description: 'Refrigerante gelado em lata 350ml',
      price: 4.50,
      category_id: 2,
      image: '/api/placeholder/300/200',
      available: true
    },
    {
      id: 4,
      name: 'Suco Natural',
      description: 'Suco natural de laranja ou maracujá',
      price: 8.90,
      category_id: 2,
      image: '/api/placeholder/300/200',
      available: true
    },
    {
      id: 5,
      name: 'Pudim de Leite',
      description: 'Pudim caseiro com calda de caramelo',
      price: 12.90,
      category_id: 3,
      image: '/api/placeholder/300/200',
      available: true
    }
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory
    return matchesSearch && matchesCategory && product.available
  })

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Cardápio</h1>
        <div className="menu-filters">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-filter">
            <Filter size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="menu-content">
        <div className="menu-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">R$ {product.price.toFixed(2)}</div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => addToCart(product)}
                >
                  <Plus size={16} />
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="cart-sidebar">
            <div className="cart-header">
              <h3>Carrinho</h3>
              <span className="cart-count">{cart.length} itens</span>
            </div>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <strong>Total: R$ {getTotalPrice().toFixed(2)}</strong>
              </div>
              <button className="btn btn-primary btn-lg">
                <ShoppingCart size={20} />
                Finalizar Pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu
