import { useState, useEffect, createContext, useContext } from 'react'
import { createClient } from '@supabase/supabase-js'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há token salvo
    const token = Cookies.get('auth_token')
    if (token) {
      // Verificar token com a API
      fetchUserData(token)
    } else {
      setLoading(false)
    }

    // Escutar mudanças de autenticação do Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await handleSignIn(session.access_token)
        } else if (event === 'SIGNED_OUT') {
          handleSignOut()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.data)
      } else {
        // Token inválido, remover
        Cookies.remove('auth_token')
        setUser(null)
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      Cookies.remove('auth_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (supabaseToken) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          supabase_token: supabaseToken
        })
      })

      if (response.ok) {
        const data = await response.json()
        const { token, user: userData } = data.data
        
        // Salvar token
        Cookies.set('auth_token', token, { expires: 1 })
        
        setUser(userData)
        toast.success(`Bem-vindo, ${userData.name}!`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error('Erro ao conectar com o servidor')
    }
  }

  const handleSignOut = () => {
    Cookies.remove('auth_token')
    setUser(null)
    toast.success('Logout realizado com sucesso')
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      if (response.ok) {
        const data = await response.json()
        const { token, user: userData } = data.data
        
        // Salvar token
        Cookies.set('auth_token', token, { expires: 1 })
        
        setUser(userData)
        toast.success(`Bem-vindo, ${userData.name}!`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao fazer login')
        throw new Error(error.error || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error(error.message || 'Erro ao fazer login')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      const token = Cookies.get('auth_token')
      if (token) {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
      
      handleSignOut()
    } catch (error) {
      console.error('Erro no logout:', error)
      handleSignOut() // Forçar logout local mesmo com erro
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
