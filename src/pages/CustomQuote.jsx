import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, MessageSquare, Package, Clock, CheckCircle } from 'lucide-react'
import { submitQuote } from '../lib/supabase'
import './CustomQuote.css'

const FEATURED_ITEMS = [
  {
    icon: <Package size={22}/>,
    name: 'Cryo-Genesis Elite',
    desc: 'Next-gen cryogenic storage system for biological specimens.',
    badge: 'NEW SERIES',
    bg: 'var(--primary)',
    color: 'white',
  },
  {
    icon: <FileText size={22}/>,
    name: 'Spectroscopy Modules',
    desc: 'High-throughput analysis systems for large institutions.',
    bg: '#EEF5F0',
    color: 'var(--text-primary)',
  },
  {
    icon: <Package size={22}/>,
    name: 'Precision Optics',
    desc: 'Advanced microscopy with automated sample handling.',
    bg: '#EBF5FF',
    color: 'var(--text-primary)',
  },
]

const PROCESS_STEPS = [
  {
    icon: <FileText size={20}/>,
    title: 'Technical Review',
    desc: 'Our clinical engineers evaluate your list for compatibility and optimized workflow integration.',
  },
  {
    icon: <MessageSquare size={20}/>,
    title: 'Expert Consultation',
    desc: 'A dedicated account manager contacts you within 2 hours to refine details and service level agreements.',
  },
  {
    icon: <Package size={20}/>,
    title: 'Custom Pricing Matrix',
    desc: 'Receive a multi-tiered bulk pricing proposal including logistics and setup incentives.',
  },
]

export default function CustomQuote() {
  const [form, setForm] = useState({
    full_name: '',
    organization: '',
    professional_role: '',
    email: '',
    budget_range: '',
    delivery_timeline: '30-60 Days',
    specifications: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.full_name || !form.email || !form.organization) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError('')
    const { error: err } = await submitQuote(form)
    if (err) {
      setError('Failed to submit. Please try again or contact us directly.')
    } else {
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="quote-success page-enter">
        <div className="quote-success__box">
          <CheckCircle size={56} color="var(--accent)" />
          <h2>Quote Request Submitted!</h2>
          <p>Our team will review your specifications and contact you within <strong>2 hours</strong> with a tailored proposal.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Link to="/catalogue" className="btn btn-primary">Browse More Products</Link>
            <Link to="/" className="btn btn-outline">Go Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="custom-quote page-enter">
      {/* Header */}
      <div className="quote-header">
        <div className="container">
          <span className="section-label">Institutional Procurement</span>
          <div className="quote-header__inner">
            <div>
              <h1>Bulk Inquiry &<br /><span className="text-accent">Custom Quotes</span></h1>
              <p>
                Facilitating large-scale laboratory transitions with precision-engineered procurement workflows. Request tailored pricing for bulk instrumentation and consumables.
              </p>
            </div>
            <div className="quote-header__stat">
              <div className="quote-header__stat-label">PRIORITY SUPPORT</div>
              <div className="quote-header__stat-title">Average Response Time</div>
              <div className="quote-header__stat-val">2.4 <span>Hours</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container quote-body">
        <div className="quote-main">
          {/* Form */}
          <div className="quote-form-card">
            <form onSubmit={handleSubmit}>
              {/* Section 01 */}
              <div className="quote-form-section">
                <div className="quote-form-section-title">
                  <span className="quote-form-section-num">01</span>
                  Requester Information
                </div>
                <div className="quote-form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input name="full_name" value={form.full_name} onChange={handleChange} className="form-input" placeholder="Dr. Julian Vane" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Organization *</label>
                    <input name="organization" value={form.organization} onChange={handleChange} className="form-input" placeholder="BioMetric Research Group" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Professional Role</label>
                    <input name="professional_role" value={form.professional_role} onChange={handleChange} className="form-input" placeholder="Lead Clinical Engineer" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="form-input" placeholder="j.vane@biometric.edu" required />
                  </div>
                </div>
              </div>

              {/* Section 02 */}
              <div className="quote-form-section">
                <div className="quote-form-section-title">
                  <span className="quote-form-section-num">02</span>
                  Order Parameters
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Budget (USD)</label>
                  <select name="budget_range" value={form.budget_range} onChange={handleChange} className="form-select">
                    <option value="">Select Budget Range</option>
                    <option>Under $10k</option>
                    <option>$10k - $50k</option>
                    <option>$50k - $100k</option>
                    <option>$100k - $500k</option>
                    <option>$500k+</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Delivery Timeline</label>
                  <div className="quote-timeline-options">
                    {['Immediate', '30-60 Days', 'Quarterly'].map(t => (
                      <button
                        key={t}
                        type="button"
                        className={`quote-timeline-btn ${form.delivery_timeline === t ? 'quote-timeline-btn--active' : ''}`}
                        onClick={() => setForm(f => ({ ...f, delivery_timeline: t }))}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Items & Technical Specifications</label>
                  <textarea
                    name="specifications"
                    value={form.specifications}
                    onChange={handleChange}
                    className="form-input form-textarea"
                    placeholder="Please list model numbers, quantities, and any specific environmental calibration requirements..."
                    rows={5}
                  />
                </div>
              </div>

              {error && <div className="quote-error">{error}</div>}

              <button type="submit" className="btn btn-primary btn-lg quote-submit-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Quote Request'}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="quote-sidebar">
          <div className="quote-process">
            <h3>The Precision Quote Process</h3>
            <div className="quote-process-steps">
              {PROCESS_STEPS.map(step => (
                <div key={step.title} className="quote-process-step">
                  <div className="quote-process-step__icon">{step.icon}</div>
                  <div>
                    <div className="quote-process-step__title">{step.title}</div>
                    <p className="quote-process-step__desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured banner */}
          <div className="quote-featured-banner">
            <img
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=500&q=80"
              alt="Engineering the future of clinical research"
            />
            <div className="quote-featured-banner__overlay">
              <div className="quote-featured-banner__label">SERIES-X INSTRUMENTATION</div>
              <div className="quote-featured-banner__title">Engineering the future of clinical research.</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Featured Procurement Assets */}
      <section className="section-py quote-assets">
        <div className="container">
          <div className="section-label text-center" style={{ marginBottom: '1.5rem' }}>
            Featured Procurement Assets
          </div>
          <div className="quote-assets-grid">
            {FEATURED_ITEMS.map(item => (
              <div key={item.name} className="quote-asset-card" style={{ background: item.bg }}>
                {item.badge && <span className="badge badge-green quote-asset-badge">{item.badge}</span>}
                <div className="quote-asset-card__icon" style={{ color: item.color }}>{item.icon}</div>
                <div className="quote-asset-card__name" style={{ color: item.color }}>{item.name}</div>
                <div className="quote-asset-card__desc" style={{ color: item.bg === 'var(--primary)' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
