import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ShieldCheck, Truck, Headphones, Award,
  FlaskConical, Microscope, Activity, Star, ChevronRight
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { MOCK_PRODUCTS, CERTIFICATIONS } from '../lib/mockData'
import './Home.css'

export default function Home() {
  const { addItem } = useCart()
  const [addedId, setAddedId] = useState(null)
  const featured = MOCK_PRODUCTS.filter(p => p.is_featured).slice(0, 4)

  const handleAdd = (product, e) => {
    e.preventDefault()
    addItem(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1800)
  }

  const stats = [
    { label: 'Institutions Served', value: '500+' },
    { label: 'Products Available', value: '1,200+' },
    { label: 'Quality Accuracy', value: '99.99%' },
    { label: 'Support Response', value: '<2 hrs' },
  ]

  const features = [
    {
      icon: <ShieldCheck size={24} />,
      title: 'ISO Certified',
      desc: 'Every product meets ISO 9001:2015 & ISO 13485 medical device standards.',
    },
    {
      icon: <Truck size={24} />,
      title: 'Pan-India Delivery',
      desc: 'Fast, secure delivery with real-time tracking and calibration support.',
    },
    {
      icon: <Headphones size={24} />,
      title: '24/7 Support',
      desc: 'Dedicated clinical engineers available around the clock for all queries.',
    },
    {
      icon: <Award size={24} />,
      title: 'Warranty Assured',
      desc: 'All instruments carry a minimum 12-month on-site warranty guarantee.',
    },
  ]

  const categories = [
    { icon: <Microscope size={28}/>, name: 'Optics & Imaging', count: '80+ Products', cat: 'Optics & Imaging' },
    { icon: <Activity size={28}/>, name: 'Diagnostics', count: '120+ Products', cat: 'Diagnostics' },
    { icon: <FlaskConical size={28}/>, name: 'Lab Equipment', count: '200+ Products', cat: 'Lab Equipment' },
    { icon: <Star size={28}/>, name: 'Consumables', count: '400+ Products', cat: 'Consumables' },
  ]

  return (
    <div className="home page-enter">
      {/* ====== HERO ====== */}
      <section className="hero">
        <div className="hero__bg-grid" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="section-label">Precision Healthcare Equipment</span>
            <h1 className="hero__headline">
              Engineered for<br />
              <span className="hero__headline-green">Clinical Excellence</span>
            </h1>
            <p className="hero__sub">
              Brandingo delivers ISO-certified diagnostic instruments, lab equipment, and precision consumables to hospitals, research labs, and clinical facilities across India.
            </p>
            <div className="hero__actions">
              <Link to="/catalogue" className="btn btn-primary btn-lg">
                Explore Catalogue <ArrowRight size={18} />
              </Link>
              <Link to="/custom-quote" className="btn btn-outline btn-lg">
                Request Custom Quote
              </Link>
            </div>
            {/* Trust badges */}
            <div className="hero__trust">
              {CERTIFICATIONS.map(c => (
                <div key={c.label} className="hero__trust-badge">
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__img-wrapper">
              <img
                src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=700&q=80"
                alt="Precision Digital Microscope"
                className="hero__img"
              />
              <div className="hero__img-badge">
                <ShieldCheck size={16} />
                <span>ISO 9001:2015 Certified</span>
              </div>
            </div>
            {/* Floating stat card */}
            <div className="hero__stat-card">
              <div className="hero__stat-number">500+</div>
              <div className="hero__stat-label">Healthcare Institutions</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="stats-bar">
        <div className="container stats-bar__inner">
          {stats.map(s => (
            <div key={s.label} className="stats-bar__item">
              <div className="stats-bar__value">{s.value}</div>
              <div className="stats-bar__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== CATEGORIES ====== */}
      <section className="section-py categories-sec">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="section-label">Product Lines</span>
            <h2>Shop by Category</h2>
          </div>
          <div className="categories-grid">
            {categories.map(c => (
              <Link
                key={c.name}
                to={`/catalogue?category=${encodeURIComponent(c.cat)}`}
                className="category-card"
              >
                <div className="category-card__icon">{c.icon}</div>
                <div>
                  <div className="category-card__name">{c.name}</div>
                  <div className="category-card__count">{c.count}</div>
                </div>
                <ChevronRight size={18} className="category-card__arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURED PRODUCTS ====== */}
      <section className="section-py featured-sec">
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <div>
              <span className="section-label">Top Picks</span>
              <h2>Featured Products</h2>
            </div>
            <Link to="/catalogue" className="btn btn-outline btn-sm">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <div className="featured-grid">
            {featured.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="product-card">
                <div className="product-card-img-wrap">
                  <img src={p.image_url} alt={p.name} className="product-card-img" />
                  {p.badge && <span className={`badge badge-green product-card-badge`}>{p.badge}</span>}
                  {!p.in_stock && <div className="product-card-oos">Out of Stock</div>}
                </div>
                <div className="product-card-body">
                  <div className="product-category">{p.category}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="stars">{'★'.repeat(Math.floor(p.rating))} <span className="text-muted" style={{fontSize:'0.75rem', marginLeft:'4px'}}>({p.reviews})</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                    <div>
                      <span className="product-price">${p.price.toLocaleString()}</span>
                      {p.original_price && (
                        <span className="product-price-original">${p.original_price.toLocaleString()}</span>
                      )}
                    </div>
                    {p.in_stock && (
                      <button
                        className={`btn btn-primary btn-sm ${addedId === p.id ? 'btn-added' : ''}`}
                        onClick={e => handleAdd(p, e)}
                      >
                        {addedId === p.id ? '✓ Added' : 'Add'}
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== WHY BRANDINGO ====== */}
      <section className="section-py why-sec">
        <div className="container">
          <div className="why-inner">
            <div className="why-content">
              <span className="section-label">Why Choose Us</span>
              <h2>Precision You Can Trust</h2>
              <p style={{ marginBottom: '2rem', marginTop: '0.75rem' }}>
                At Brandingo, we believe medical outcomes depend on the integrity of every component. Our mission is to bridge the gap between advanced engineering and clinical excellence.
              </p>
              <div className="why-features">
                {features.map(f => (
                  <div key={f.title} className="why-feature">
                    <div className="why-feature-icon">{f.icon}</div>
                    <div>
                      <div className="why-feature-title">{f.title}</div>
                      <div className="why-feature-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Our Story <ArrowRight size={16} />
              </Link>
            </div>
            <div className="why-visual">
              <img
                src="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80"
                alt="Modern laboratory facility"
                className="why-img"
              />
              <div className="why-cert-row">
                {CERTIFICATIONS.slice(0, 2).map(c => (
                  <div key={c.label} className="why-cert">
                    <span style={{fontSize:'1.5rem'}}>{c.icon}</span>
                    <div>
                      <div className="why-cert-name">{c.label}</div>
                      <div className="why-cert-desc">{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA BANNER ====== */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <h2 className="cta-banner__title">Need Bulk Procurement?</h2>
            <p className="cta-banner__sub">Get custom pricing for institutional orders with dedicated support and priority delivery.</p>
          </div>
          <div className="cta-banner__actions">
            <Link to="/custom-quote" className="btn btn-accent btn-lg">
              Request Custom Quote <ArrowRight size={18} />
            </Link>
            <Link to="/support" className="btn btn-outline-white btn-lg">
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
