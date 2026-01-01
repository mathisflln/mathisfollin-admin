import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/login.css'

function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email.trim(), password)
      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      
      let errorMessage = "Une erreur est survenue. Veuillez réessayer."
      
      if (err.message.includes('Invalid login credentials')) {
        errorMessage = "Identifiants incorrects."
      } else if (err.message.includes('Email not confirmed')) {
        errorMessage = "Veuillez confirmer votre adresse email."
      } else if (err.message.includes('non autorisé')) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <img src="/assets/logos/fah-icon-white.png" alt="FAH" />
        <h1>Espace Admin</h1>
        <p className="subtitle">Connectez-vous pour accéder au panneau d'administration</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Mot de passe</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Afficher le mot de passe"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button type="submit" className={`btn-submit ${loading ? 'loading' : ''}`} disabled={loading}>
            Se connecter
            {loading && <span className="loading-spinner"></span>}
          </button>
        </form>
        
        {error && (
          <p id="error-message" className="show">{error}</p>
        )}
        
        <div className="login-footer">
          <p>Pas administrateur ? <a href="https://app.mathisfollin.fr">Espace membre</a></p>
        </div>
      </div>
    </div>
  )
}

export default Login