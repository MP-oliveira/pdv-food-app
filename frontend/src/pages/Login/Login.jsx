import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, ChefHat } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import './Login.css'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, loading } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password)
    } catch (error) {
      console.error('Erro no login:', error)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Fazendo login..." />
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <ChefHat size={48} />
          </div>
          <h1>PDV Food App</h1>
          <p>Sistema de Ponto de Venda para Restaurantes</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="seu@email.com"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
            />
            {errors.email && (
              <span className="form-error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Sua senha"
                {...register('password', {
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                    message: 'Senha deve ter pelo menos 6 caracteres'
                  }
                })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner spinner-small"></div>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            <a href="#" className="forgot-password-link">
              Esqueceu sua senha?
            </a>
          </p>
        </div>

        <div className="login-demo">
          <h3>Conta de Teste</h3>
          <div className="demo-accounts">
            <div className="demo-account">
              <strong>Admin:</strong> admin@teste.com
            </div>
            <p className="demo-password">Senha: <strong>123456</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
