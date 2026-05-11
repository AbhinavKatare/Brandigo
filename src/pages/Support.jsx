import { useState } from 'react'
import { MessageSquare, Phone, Mail, Clock, ChevronDown, CheckCircle } from 'lucide-react'
import { submitSupportTicket } from '../lib/supabase'
import './Support.css'

const FAQS = [
  {
    q: 'How long does delivery take for lab instruments?',
    a: 'Standard delivery within India takes 5-7 business days. Expedited shipping is available for critical instruments within 48 hours. Calibration and installation support is included.',
  },
  {
    q: 'Do your products come with warranty?',
    a: 'All Brandingo instruments carry a minimum 12-month on-site warranty. High-value instruments like PCR systems and mass spectrometers include a 24-month calibration guarantee.',
  },
  {
    q: 'Can I request a product demonstration?',
    a: 'Yes! We offer virtual and on-site demonstrations for bulk orders. Contact our technical team to schedule a demo session with a certified clinical engineer.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept NEFT/RTGS, demand drafts, purchase orders from institutions, and credit cards for online orders. Custom payment terms available for institutional contracts.',
  },
  {
    q: 'Are your products certified for clinical use in India?',
    a: 'Yes. All our diagnostic and medical-grade instruments comply with CDSCO guidelines, NABH standards, and relevant ISO certifications. Compliance certificates are provided with every shipment.',
  },
]

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError('')
    const { error: err } = await submitSupportTicket(form)
    if (err) {
      setError('Failed to submit. Please email us directly at support@brandingo.in')
    } else {
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  const CHANNELS = [
    {
      icon: <Phone size={24}/>,
      title: 'Phone Support',
      desc: '+91 98765 43210',
      sub: 'Mon–Sat, 9AM–7PM IST',
      color: 'var(--primary)',
    },
    {
      icon: <Mail size={24}/>,
      title: 'Email Support',
      desc: 'support@brandingo.in',
      sub: 'Response within 4 hours',
      color: 'var(--teal)',
    },
    {
      icon: <MessageSquare size={24}/>,
      title: 'Live Chat',
      desc: 'Chat with an expert',
      sub: 'Available 24/7',
      color: 'var(--accent)',
    },
    {
      icon: <Clock size={24}/>,
      title: 'Emergency Line',
      desc: '+91 98765 00000',
      sub: 'Critical equipment, 24/7',
      color: '#EF4444',
    },
  ]

  return (
    <div className="support page-enter">
      {/* Header */}
      <div className="support-header">
        <div className="container">
          <span className="section-label">Customer Support</span>
          <h1>How can we help you?</h1>
          <p>Our clinical support team is available 24/7 for critical equipment issues and business hours for general inquiries.</p>
        </div>
      </div>

      <div className="container support-body">
        {/* Support Channels */}
        <div className="support-channels">
          {CHANNELS.map(c => (
            <div key={c.title} className="support-channel">
              <div className="support-channel__icon" style={{ background: `${c.color}18`, color: c.color }}>
                {c.icon}
              </div>
              <div className="support-channel__title">{c.title}</div>
              <div className="support-channel__desc">{c.desc}</div>
              <div className="support-channel__sub">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="support-main">
          {/* Ticket Form */}
          <div className="support-form-section">
            <h2>Submit a Support Ticket</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Describe your issue and our team will respond within 4 hours.
            </p>

            {submitted ? (
              <div className="support-submitted">
                <CheckCircle size={40} color="var(--accent)" />
                <h3>Ticket Submitted!</h3>
                <p>We've received your request and will respond within 4 hours. Check your email for a confirmation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="support-form">
                <div className="support-form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input name="name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="form-input" placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="form-input" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="support-form-row">
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input name="subject" value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} className="form-input" placeholder="Brief description of your issue" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select name="category" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="form-select">
                      <option value="">Select Category</option>
                      <option>Order & Delivery</option>
                      <option>Technical Support</option>
                      <option>Calibration & Service</option>
                      <option>Returns & Warranty</option>
                      <option>Billing & Payments</option>
                      <option>Custom Quote</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea name="message" value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} className="form-input form-textarea" rows={5} placeholder="Describe your issue in detail. Include order numbers, product SKUs, or error messages if applicable." required />
                </div>
                {error && <div className="support-error">{error}</div>}
                <button type="submit" className="btn btn-primary btn-lg support-submit-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Support Ticket'}
                </button>
              </form>
            )}
          </div>

          {/* FAQs */}
          <div className="support-faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list" style={{ marginTop: '1.5rem' }}>
              {FAQS.map((faq, i) => (
                <div key={i} className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`}>
                  <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className="faq-chevron" />
                  </button>
                  {openFaq === i && (
                    <div className="faq-answer">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
