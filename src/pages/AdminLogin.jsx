import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, FlaskConical } from 'lucide-react'
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext'
import './AdminLogin.css'

export default function AdminLogin() {
  const { signIn, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Only allow admin email
    if (email !== ADMIN_EMAIL) {
      setError('Access denied. This portal is for administrators only.')
      setLoading(false)
      return
    }

    const { error: err } = await signIn(email, password)
    if (err) {
      setError('Invalid admin credentials. Please try again.')
      setLoading(false)
    } else {
      navigate('/admin', { replace: true })
    }
  }

  return (
    <div className="admin-login-page">
      {/* Left: form */}
      <div className="admin-login-left">
        {/* Brand bar */}
        <div className="admin-login-brand">
          <FlaskConical size={18} />
          <span>brand<strong>ingo</strong></span>
          <span className="admin-login-brand__sep" />
          <span className="admin-login-brand__tag">Admin Portal</span>
        </div>

        <div className="admin-login-form-wrap">
          {/* Shield icon */}
          <div className="admin-login-icon">
            <ShieldCheck size={28} />
          </div>

          <div className="admin-login-badge">🔒 RESTRICTED ACCESS</div>
          <h1 className="admin-login-title">Admin Sign In</h1>
          <p className="admin-login-sub">
            This portal is restricted to authorized personnel only. All access attempts are logged.
          </p>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="auth-field">
              <label className="form-label">Admin Email</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input auth-input"
                  placeholder="admin@brandingo.in"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="form-label">Admin Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input auth-input auth-input--pw"
                  placeholder="Enter admin password"
                  required
                />
                <button type="button" className="auth-eye" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="admin-login-error">
                <ShieldCheck size={14} /> {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg admin-login-btn"
              disabled={loading}
            >
              {loading ? <span className="auth-spinner" /> : <ShieldCheck size={17} />}
              {loading ? 'Authenticating…' : 'Access Admin Panel'}
            </button>
          </form>

          <p className="admin-login-back">
            Not an admin? <a href="/">Return to Store →</a>
          </p>

          {/* Security note */}
          <div className="admin-login-security">
            <div className="admin-login-security__row">
              <span className="admin-login-security__dot" />
              <span>Session encrypted with TLS 1.3</span>
            </div>
            <div className="admin-login-security__row">
              <span className="admin-login-security__dot" />
              <span>All logins are time-stamped and recorded</span>
            </div>
            <div className="admin-login-security__row">
              <span className="admin-login-security__dot" />
              <span>Admin email: {ADMIN_EMAIL}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: dark branding panel */}
      <div className="admin-login-right">
        <div className="admin-login-right__content">
          <div className="admin-login-right__logo">
            <FlaskConical size={36} />
          </div>
          <h2>Executive Control Center</h2>
          <p>
            Full oversight of Brandingo's product inventory, institutional orders, custom quote pipeline, and customer support operations.
          </p>
          <div className="admin-login-right__stats">
            <div className="admin-login-right__stat">
              <div className="admin-login-right__stat-val">500+</div>
              <div className="admin-login-right__stat-label">Institutions</div>
            </div>
            <div className="admin-login-right__stat">
              <div className="admin-login-right__stat-val">1,200+</div>
              <div className="admin-login-right__stat-label">Products</div>
            </div>
            <div className="admin-login-right__stat">
              <div className="admin-login-right__stat-val">24/7</div>
              <div className="admin-login-right__stat-label">Monitored</div>
            </div>
          </div>
          <div className="admin-login-right__modules">
            <div className="admin-login-right__module">📦 Product Inventory</div>
            <div className="admin-login-right__module">📋 Quote Management</div>
            <div className="admin-login-right__module">🎧 Support Tickets</div>
            <div className="admin-login-right__module">📊 Analytics</div>
          </div>
        </div>
      </div>
    </div>
  )
}
