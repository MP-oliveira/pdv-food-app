import React, { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, Search, X } from 'lucide-react'
import './DigitalMenu.css'

const DigitalMenu = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`)
      const data = await response.json()
      
      if (data.success) {
        // Adiciona imagens do Unsplash para cada produto
        const productsWithImages = data.data.map(product => ({
          ...product,
          image: getUnsplashImage(product.category)
        }))
        setProducts(productsWithImages)
        
        // Extrai categorias únicas
        const uniqueCategories = [...new Set(data.data.map(p => p.category))]
        setCategories(uniqueCategories)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setLoading(false)
    }
  }

  const getUnsplashImage = (category) => {
    const imageMap = {
      'Lanches': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      'Bebidas': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
      'Sobremesas': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
      'Pizzas': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      'Massas': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
      'Porções': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
      'Carnes': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop',
      'Saladas': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      'Pratos Executivos': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      'Sucos': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop'
    }
    return imageMap[category] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    const existingItem = cart.find(item => item.id === productId)
    
    if (existingItem.quantity === 1) {
      setCart(cart.filter(item => item.id !== productId))
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ))
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="digital-menu-page">
      {/* Header */}
      <div className="menu-header">
        <div className="restaurant-info">
          <h1>🍴 PDV Food App</h1>
          <p>Cardápio Digital</p>
        </div>
        
        <button 
          className="cart-button"
          onClick={() => setShowCart(true)}
        >
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="cart-badge">{getCartItemsCount()}</span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="menu-search">
        <Search size={20} />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="menu-categories">
        <button
          className={selectedCategory === 'all' ? 'active' : ''}
          onClick={() => setSelectedCategory('all')}
        >
          Todos
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="menu-products">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              {product.description && (
                <p className="product-description">{product.description}</p>
              )}
              <div className="product-footer">
                <span className="product-price">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <button
                  className="btn-add-to-cart"
                  onClick={() => addToCart(product)}
                >
                  <Plus size={20} />
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="cart-modal-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Seu Pedido</h2>
              <button onClick={() => setShowCart(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingCart size={64} />
                  <p>Seu carrinho está vazio</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <span className="cart-item-price">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="cart-item-actions">
                      <button onClick={() => removeFromCart(item.id)}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => addToCart(item)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-value">
                    R$ {getCartTotal().toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <button className="btn-finalize">
                  Chamar Garçom
                </button>
                <p className="cart-note">
                  Um garçom virá até sua mesa para finalizar o pedido
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DigitalMenu

