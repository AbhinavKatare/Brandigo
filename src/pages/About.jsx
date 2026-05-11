import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Download } from 'lucide-react'
import { CERTIFICATIONS } from '../lib/mockData'
import './About.css'

const TIMELINE = [
  { year: '2002', title: 'The Foundation', desc: 'Founded as a boutique precision instruments supplier in New Delhi, specializing in diagnostic lab equipment.' },
  { year: '2010', title: 'Clinical Expansion', desc: 'Opened our first ISO-certified distribution center, enabling nationwide delivery to hospitals and research institutes.' },
  { year: '2017', title: 'Digital Integration', desc: 'Launched the Brandingo digital platform enabling real-time inventory management and online procurement.' },
  { year: '2024', title: 'Precision Era', desc: 'Serving 500+ institutions with AI-assisted procurement, predictive maintenance, and end-to-end lab ecosystem solutions.' },
]

const TEAM = [
  {
    name: 'Dr. Elena Volkov',
    role: 'Chief Executive Officer',
    bio: 'Former Head of Biomedical Engineering, IIT Delhi. Elena brings 20+ years of research-led leadership to Brandingo.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  },
  {
    name: 'Marcus Thorne',
    role: 'Chief Technology Officer',
    bio: 'Marcus leads our Noida facility, specializing in nanomaterials and high-frequency milling technologies.',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
  },
  {
    name: 'Sarah Chen',
    role: 'Operations Director',
    bio: 'A specialist in global supply chain logistics and lean manufacturing. Sarah ensures our 48-hour delivery commitment is met.',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  },
]

export default function About() {
  return (
    <div className="about page-enter">
      {/* Hero */}
      <section className="about-hero">
        <div className="container about-hero__inner">
          <div className="about-hero__content">
            <span className="section-label">Engineered Integrity</span>
            <h1>
              Our Mission:<br />
              Precision in{' '}
              <span className="text-accent">Healthcare.</span>
            </h1>
            <p>
              At Brandingo, we believe medical outcomes depend on the integrity of every single component. Our mission is to bridge the gap between advanced engineering and clinical excellence, providing the hardware that drives life-saving innovations.
            </p>
            <div className="about-hero__stats">
              <div className="about-hero__stat">
                <div className="stat-number">99.99%</div>
                <div className="about-hero__stat-label">Product Accuracy</div>
              </div>
              <div className="about-hero__stat">
                <div className="stat-number">150k+</div>
                <div className="about-hero__stat-label">Labs Supplied</div>
              </div>
            </div>
          </div>
          <div className="about-hero__img-wrap">
            <img
              src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80"
              alt="Precision medical instruments"
            />
          </div>
        </div>
      </section>

      {/* Manufacturing Excellence */}
      <section className="section-py mfg-sec">
        <div className="container mfg-inner">
          <div>
            <h2>Manufacturing Excellence</h2>
            <p style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
              Operating out of our ISO-certified facility in Noida, we utilize state-of-the-art CNC machining and additive manufacturing to produce parts that exceed medical-grade standards. Every batch undergoes ultrasonic testing and laser-guided measurement before dispatch.
            </p>
            <div className="mfg-points">
              <div className="mfg-point">
                <CheckCircle size={18} color="var(--accent)" />
                <div>
                  <strong>Climate Controlled Environment</strong>
                  <p>Maintaining constant 22°C with ±1% humidity variance.</p>
                </div>
              </div>
              <div className="mfg-point">
                <CheckCircle size={18} color="var(--accent)" />
                <div>
                  <strong>Automated Optical Inspection (AOI)</strong>
                  <p>Sub-micron level defect detection across all product lines.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mfg-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1565008440039-3e28484eb98a?w=600&q=80"
              alt="ISO certified manufacturing facility"
            />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-py timeline-sec">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2>Our Heritage</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Two Decades of Technical Evolution
            </p>
          </div>
          <div className="timeline">
            {TIMELINE.map((t, i) => (
              <div key={t.year} className={`timeline-item ${i === TIMELINE.length - 1 ? 'timeline-item--active' : ''}`}>
                <div className="timeline-item__year">{t.year}</div>
                <div className="timeline-item__title">{t.title}</div>
                <div className="timeline-item__desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-py team-sec" id="team">
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
            <div>
              <h2>Leadership Team</h2>
            </div>
            <span className="team-tag">Governed by engineers,<br/>driven by healthcare specialists.</span>
          </div>
          <div className="team-grid">
            {TEAM.map(member => (
              <div key={member.name} className="team-card">
                <img src={member.img} alt={member.name} className="team-card__img" />
                <div className="team-card__body">
                  <div className="team-card__name">{member.name}</div>
                  <div className="team-card__role">{member.role}</div>
                  <p className="team-card__bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-py certs-sec" id="certifications">
        <div className="container certs-inner">
          <div className="certs-content">
            <h2>Certifications & Compliance</h2>
            <p style={{ marginTop: '0.75rem', marginBottom: '1.5rem' }}>
              Our processes are audited annually to ensure compliance with global healthcare standards. We don't just meet requirements; we set them.
            </p>
            <a href="#" className="btn btn-primary">
              <Download size={16}/>
              Download Audit Reports
            </a>
          </div>
          <div className="certs-grid">
            {CERTIFICATIONS.map(c => (
              <div key={c.label} className="cert-card">
                <div className="cert-card__icon">{c.icon}</div>
                <div className="cert-card__label">{c.label}</div>
                <div className="cert-card__desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <h2 className="cta-banner__title">Partner with Brandingo</h2>
            <p className="cta-banner__sub">Whether you're setting up a new lab or scaling an existing one, we have the precision tools you need.</p>
          </div>
          <div className="cta-banner__actions">
            <Link to="/catalogue" className="btn btn-accent btn-lg">Browse Catalogue <ArrowRight size={18}/></Link>
            <Link to="/custom-quote" className="btn btn-outline-white btn-lg">Request Quote</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
