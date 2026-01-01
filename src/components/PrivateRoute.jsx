import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function PrivateRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-loader">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
