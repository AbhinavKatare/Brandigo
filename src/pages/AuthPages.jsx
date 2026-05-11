import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, FlaskConical, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './AuthPages.css'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = location.state?.from?.pathname || '/'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await signIn(email, password)
    if (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Incorrect email or password. Please try again.'
        : err.message)
      setLoading(false)
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <Link to="/" className="auth-brand">
          <div className="auth-brand__icon"><FlaskConical size={20} /></div>
          <span>brand<span className="auth-brand__accent">ingo</span></span>
        </Link>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your Brandingo account to continue.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email */}
          <div className="auth-field">
            <label className="form-label">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-input auth-input"
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label className="form-label">Password</label>
              <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
            </div>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input auth-input auth-input--pw"
                placeholder="Enter your password"
                required
              />
              <button type="button" className="auth-eye" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-lg auth-submit"
            disabled={loading}
          >
            {loading ? <span className="auth-spinner" /> : null}
            {loading ? 'Signing in…' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create one →</Link>
        </p>

      </div>

      {/* Background visual */}
      <div className="auth-visual">
        <img
          src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=80"
          alt="Brandingo laboratory"
        />
        <div className="auth-visual__overlay">
          <div className="auth-visual__quote">
            "Precision instruments for<br/>life-saving discoveries."
          </div>
          <div className="auth-visual__brand">— Brandingo Healthcare</div>
        </div>
      </div>
    </div>
  )
}

export function SignupPage() {
  const { signUp } = useAuth()
  const navigate   = useNavigate()

  const [form, setForm]       = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError('')
    const { error: err } = await signUp(form.email, form.password, form.fullName)
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="auth-page auth-page--center">
        <div className="auth-card auth-card--narrow">
          <div className="auth-success-icon"><CheckCircle size={48} color="var(--accent)" /></div>
          <h2>Check your email!</h2>
          <p className="auth-sub">
            We sent a confirmation link to <strong>{form.email}</strong>.<br />
            Click it to verify your account and get started.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <div className="auth-brand__icon"><FlaskConical size={20} /></div>
          <span>brand<span className="auth-brand__accent">ingo</span></span>
        </Link>

        <h1 className="auth-title">Create an account</h1>
        <p className="auth-sub">Join Brandingo to access lab equipment and exclusive pricing.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="form-label">Full Name</label>
            <div className="auth-input-wrap">
              <User size={16} className="auth-input-icon" />
              <input
                type="text"
                value={form.fullName}
                onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                className="form-input auth-input"
                placeholder="Dr. Jane Doe"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="form-label">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="form-input auth-input"
                placeholder="you@organization.com"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="form-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="form-input auth-input auth-input--pw"
                placeholder="Minimum 6 characters"
                required
              />
              <button type="button" className="auth-eye" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Password strength */}
            {form.password && (
              <div className="auth-strength">
                <div className="auth-strength-bars">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="auth-strength-bar"
                      style={{
                        background: strength >= i
                          ? ['#EF4444', '#F59E0B', '#10B981'][strength - 1]
                          : 'var(--border)',
                      }}
                    />
                  ))}
                </div>
                <span className="auth-strength-label">
                  {['', 'Weak', 'Good', 'Strong'][strength]}
                </span>
              </div>
            )}
          </div>

          <div className="auth-field">
            <label className="form-label">Confirm Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                className="form-input auth-input"
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : null}
            {loading ? 'Creating account…' : 'Create Account'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in →</Link>
        </p>
      </div>

      <div className="auth-visual">
        <img
          src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&q=80"
          alt="Laboratory research"
        />
        <div className="auth-visual__overlay">
          <div className="auth-visual__quote">
            "Trusted by 500+ healthcare<br/>institutions across India."
          </div>
          <div className="auth-visual__brand">— Brandingo Healthcare</div>
        </div>
      </div>
    </div>
  )
}

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await resetPassword(email)
    if (err) { setError(err.message); setLoading(false) }
    else { setSent(true) }
  }

  return (
    <div className="auth-page auth-page--center">
      <div className="auth-card auth-card--narrow">
        <Link to="/" className="auth-brand">
          <div className="auth-brand__icon"><FlaskConical size={20} /></div>
          <span>brand<span className="auth-brand__accent">ingo</span></span>
        </Link>
        <h1 className="auth-title">Reset Password</h1>

        {sent ? (
          <>
            <div className="auth-success-icon"><CheckCircle size={48} color="var(--accent)" /></div>
            <p className="auth-sub">Reset link sent to <strong>{email}</strong>. Check your inbox.</p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
              Back to Login
            </Link>
          </>
        ) : (
          <>
            <p className="auth-sub">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label className="form-label">Email Address</label>
                <div className="auth-input-wrap">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input auth-input"
                    placeholder="you@example.com"
                    required autoFocus
                  />
                </div>
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
            <p className="auth-switch"><Link to="/login">← Back to Login</Link></p>
          </>
        )}
      </div>
    </div>
  )
}
