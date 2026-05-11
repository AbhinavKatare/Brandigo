import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Requires the user to be logged in (any role)
export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="auth-loading"><div className="spinner" /></div>
  if (!user)   return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

// Requires the user to be the admin
export function RequireAdmin({ children }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="auth-loading"><div className="spinner" /></div>
  if (!user)   return <Navigate to="/admin-login" state={{ from: location }} replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
