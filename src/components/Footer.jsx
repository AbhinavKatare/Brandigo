import { Link } from 'react-router-dom'
import { FlaskConical, Mail, Phone, MapPin, Twitter, Linkedin, Youtube } from 'lucide-react'
import { useState } from 'react'
import { subscribeNewsletter } from '../lib/supabase'
import './Footer.css'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState(null)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setSubStatus('loading')
    await subscribeNewsletter(email)
    setSubStatus('success')
    setEmail('')
    setTimeout(() => setSubStatus(null), 4000)
  }

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <FlaskConical size={20} />
              </div>
              <span className="footer__logo-text">brand<span>ingo</span></span>
            </div>
            <p className="footer__tagline">
              Precision healthcare lab instrumentation. ISO-certified. Trusted by 500+ institutions across India.
            </p>
            <div className="footer__social">
              <a href="#" aria-label="Twitter" className="footer__social-link"><Twitter size={16}/></a>
              <a href="#" aria-label="LinkedIn" className="footer__social-link"><Linkedin size={16}/></a>
              <a href="#" aria-label="YouTube" className="footer__social-link"><Youtube size={16}/></a>
            </div>
          </div>

          {/* Solutions */}
          <div className="footer__col">
            <h4 className="footer__col-title">Solutions</h4>
            <ul className="footer__links">
              <li><Link to="/catalogue">Diagnostics</Link></li>
              <li><Link to="/catalogue?category=Optics+%26+Imaging">Optics & Imaging</Link></li>
              <li><Link to="/catalogue?category=Molecular+Biology">Molecular Biology</Link></li>
              <li><Link to="/catalogue?category=Consumables">Consumables</Link></li>
              <li><Link to="/custom-quote">Custom Procurement</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer__col">
            <h4 className="footer__col-title">Company</h4>
            <ul className="footer__links">
              <li><Link to="/about">About Brandingo</Link></li>
              <li><Link to="/about#team">Leadership Team</Link></li>
              <li><Link to="/about#certifications">Certifications</Link></li>
              <li><Link to="/support">Customer Support</Link></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <ul className="footer__contact">
              <li><MapPin size={14}/> B-42, Industrial Estate, New Delhi – 110020</li>
              <li><Phone size={14}/> +91 98765 43210</li>
              <li><Mail size={14}/> support@brandingo.in</li>
            </ul>
            <div className="footer__newsletter">
              <p className="footer__newsletter-label">Stay updated</p>
              <form onSubmit={handleSubscribe} className="footer__newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="footer__newsletter-input"
                  required
                />
                <button type="submit" className="footer__newsletter-btn">
                  {subStatus === 'loading' ? '...' : subStatus === 'success' ? '✓' : 'Join'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© 2024 Brandingo Healthcare Solutions. All rights reserved. ISO 9001:2015 Certified.</span>
          <div className="footer__bottom-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
