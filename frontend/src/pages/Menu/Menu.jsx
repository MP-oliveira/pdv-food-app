import React, { useState, useEffect } from 'react'
import { Search, Filter, ShoppingCart, Plus, Minus } from 'lucide-react'
import './Menu.css'

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, searchTerm])

  const fetchCategories = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setCategories([{ id: 'all', name: 'Todos', color: '#3B82F6' }, ...data.data])
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1]

      let url = `${import.meta.env.VITE_API_URL}/products?`
      if (selectedCategory !== 'all') {
        url += `category_id=${selectedCategory}&`
      }
      if (searchTerm) {
        url += `search=${encodeURIComponent(searchTerm)}&`
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        // Adicionar imagens do Unsplash baseado na categoria
        const productsWithImages = (data.data.products || data.data).map(product => ({
          ...product,
          image: product.image_url || getUnsplashImageByCategory(product.category?.name)
        }))
        setProducts(productsWithImages)
      }
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setLoading(false)
    }
  }

  const getUnsplashImageByCategory = (categoryName) => {
    const imageMap = {
      'Lanches': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      'Pizzas': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      'Bebidas': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
      'Sobremesas': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
      'Massas': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
      'Porções': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
      'Carnes': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop',
      'Saladas': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop'
    }
    return imageMap[categoryName] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory
    return matchesSearch && matchesCategory && product.is_available !== false
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
