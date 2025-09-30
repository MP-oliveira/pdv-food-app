import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Search, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react'
import PaymentModal from '../../components/PaymentModal/PaymentModal'
import DiscountModal from '../../components/DiscountModal/DiscountModal'
import './PDV.css'

const PDV = () => {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [discount, setDiscount] = useState(null)

  // Buscar categorias
  useEffect(() => {
    fetchCategories()
  }, [])

  // Buscar produtos quando categoria ou busca mudar (com debounce para busca)
  useEffect(() => {
    if (searchTerm) {
      const timer = setTimeout(() => {
        fetchProducts()
      }, 300) // Debounce de 300ms
      return () => clearTimeout(timer)
    } else {
      fetchProducts()
    }
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
        // Remover duplicatas por ID
        const uniqueCategories = data.data.reduce((acc, current) => {
          const exists = acc.find(item => item.id === current.id);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);
        
        // Ordenar por sort_order
        uniqueCategories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        
        setCategories(uniqueCategories)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Erro ao carregar categorias')
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
        setProducts(data.data.products || [])
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0)
  }

  const getTotal = () => {
    const subtotal = getSubtotal()
    if (discount) {
      return subtotal - discount.amount
    }
    return subtotal
  }

  const handleApplyDiscount = (discountData) => {
    setDiscount(discountData)
    setShowDiscountModal(false)
  }

  const removeDiscount = () => {
    setDiscount(null)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const getCategoryColor = (categoryName) => {
    const colorMap = {
      'bebidas': '#60a5fa',        // Azul médio (melhor contraste)
      'pratos principais': '#fbbf24', // Amarelo âmbar (melhor contraste)
      'sobremesas': '#f472b6',     // Rosa médio (melhor contraste)
      'aperitivos': '#34d399',     // Verde esmeralda (melhor contraste)
      'saladas': '#a3e635',        // Verde limão (melhor contraste)
      'pizzas': '#f87171',         // Vermelho coral (melhor contraste)
      'pastéis': '#fb923c',        // Laranja médio (melhor contraste)
      'porções': '#a78bfa',        // Roxo médio (melhor contraste)
      'default': '#9ca3af'         // Cinza médio
    }
    
    const key = categoryName?.toLowerCase() || 'default'
    return colorMap[key] || colorMap['default']
  }

  const handlePaymentComplete = (paymentData) => {
    console.log('Pagamento concluído:', paymentData)
    console.log('Desconto aplicado:', discount)
    // Aqui você pode enviar para o backend
    // Limpar carrinho e desconto após pagamento
    setCart([])
    setDiscount(null)
    setShowPaymentModal(false)
  }

  return (
    <div className="pdv-container">
      {/* Header */}
      <div className="pdv-header">
        <h1>Lançamento de pedido</h1>
        <div className="pdv-user-info">
          <span>Vendedor: {user?.name}</span>
          <span>Mesa: 1</span>
        </div>
      </div>

      {/* Abas de Categorias - Horizontais no topo */}
      <div className="pdv-categories-tabs">
        <button
          className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
          style={{ 
            borderBottomColor: selectedCategory === 'all' ? getCategoryColor('default') : 'transparent',
            borderBottomWidth: selectedCategory === 'all' ? '3px' : '3px'
          }}
        >
          TODOS
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${selectedCategory === category.id.toString() ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id.toString())}
            style={{ 
              borderBottomColor: selectedCategory === category.id.toString() ? getCategoryColor(category.name) : 'transparent',
              borderBottomWidth: '3px'
            }}
          >
            {category.name.toUpperCase()}
            {selectedCategory === category.id.toString() && ' →'}
          </button>
        ))}
      </div>

      <div className="pdv-content">
        {/* Área Central de Produtos */}
        <div className="pdv-main">
          <div className="products-header">
            <h2>
              {selectedCategory === 'all' 
                ? 'TODOS OS PRODUTOS' 
                : categories.find(c => c.id.toString() === selectedCategory)?.name.toUpperCase() || 'PRODUTOS'
              }
            </h2>
            <div className="search-container">
              <Search size={20} />
              <input
                type="text"
                placeholder="Procurar pelo nome ou cod. barras (Ctrl+F)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

            <div className="products-grid">
              {error ? (
                <div className="error" style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
                  <p>❌ {error}</p>
                  <button onClick={() => { setError(null); fetchCategories(); fetchProducts(); }} 
                          style={{ marginTop: '10px', padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Tentar novamente
                  </button>
                </div>
              ) : loading ? (
                <div className="loading">Carregando produtos...</div>
              ) : products.length === 0 ? (
                <div className="no-products">Nenhum produto encontrado</div>
              ) : (
                products.map((product) => {
                  const categoryName = product.category?.name || categories.find(c => c.id === product.category_id)?.name
                  return (
                    <div
                      key={product.id}
                      className="product-item"
                      style={{ 
                        '--category-color': getCategoryColor(categoryName)
                      }}
                    >
                      <div className="product-content">
                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <p className="product-price">{formatPrice(product.price)}</p>
                        </div>
                        <button 
                          className="add-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
        </div>

        {/* Carrinho Lateral */}
        <div className="pdv-cart">
          <div className="cart-header">
            <h2>PEDIDO</h2>
            <div className="cart-icon">
              <ShoppingCart size={24} />
              <span>{cart.length}</span>
            </div>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Carrinho vazio</p>
                <p>Selecione produtos para começar</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="item-price">{formatPrice(item.price)}</p>
                  </div>
                  <div className="item-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="remove-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="item-total">
                    {formatPrice(parseFloat(item.price) * item.quantity)}
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-totals">
                <div className="subtotal-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                
                {discount && (
                  <div className="discount-row">
                    <span>
                      Desconto ({discount.type === 'percentage' ? `${discount.value}%` : 
                               discount.type === 'coupon' ? discount.value : 
                               'Fixo'}):
                    </span>
                    <span className="discount-amount">
                      - {formatPrice(discount.amount)}
                      <button 
                        className="remove-discount-btn"
                        onClick={removeDiscount}
                        title="Remover desconto"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                )}
                
                <div className="total-row">
                  <h3>TOTAL:</h3>
                  <h3>{formatPrice(getTotal())}</h3>
                </div>
              </div>
              
              <div className="cart-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setCart([])
                    setDiscount(null)
                  }}
                >
                  Limpar
                </button>
                {!discount && (
                  <button 
                    className="btn-discount"
                    onClick={() => setShowDiscountModal(true)}
                  >
                    Desconto
                  </button>
                )}
                <button 
                  className="btn-primary"
                  onClick={() => setShowPaymentModal(true)}
                  disabled={cart.length === 0}
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Discount Modal */}
      <DiscountModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        orderTotal={getSubtotal()}
        onApplyDiscount={handleApplyDiscount}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderTotal={getTotal()}
        orderItems={cart}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  )
}

export default PDV
