import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, ArrowLeft, Shield, Download, ChevronRight,
  Star, Package, Truck, Award, CheckCircle
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { MOCK_PRODUCTS } from '../lib/mockData'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [selectedImg, setSelectedImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState('specs')

  const product = MOCK_PRODUCTS.find(p => p.id === id)
  const related = MOCK_PRODUCTS.filter(p => p.id !== id && p.category === product?.category).slice(0, 4)

  if (!product) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/catalogue" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Catalogue
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return (
    <div className="product-detail page-enter">
      <div className="container">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> <ChevronRight size={14}/>
          <Link to="/catalogue">Catalogue</Link> <ChevronRight size={14}/>
          <Link to={`/catalogue?category=${encodeURIComponent(product.category)}`}>{product.category}</Link> <ChevronRight size={14}/>
          <span>{product.name}</span>
        </div>

        <div className="pd-main">
          {/* Image Gallery */}
          <div className="pd-gallery">
            <div className="pd-gallery__main">
              <img
                src={product.images?.[selectedImg] || product.image_url}
                alt={product.name}
              />
              {!product.in_stock && (
                <div className="pd-out-of-stock">Out of Stock</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="pd-gallery__thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd-gallery__thumb ${selectedImg === i ? 'pd-gallery__thumb--active' : ''}`}
                    onClick={() => setSelectedImg(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="pd-info">
            {product.in_stock
              ? <span className="badge badge-green"><CheckCircle size={12}/> In Stock</span>
              : <span className="badge badge-red">Out of Stock</span>
            }
            {product.badge && <span className="badge badge-gold" style={{ marginLeft: '0.5rem' }}>{product.badge}</span>}

            <h1 className="pd-title">{product.name}</h1>
            <p className="pd-desc">{product.description}</p>

            <div className="pd-rating">
              <div className="stars" style={{ fontSize: '1rem' }}>
                {'★'.repeat(Math.floor(product.rating))}
              </div>
              <span className="pd-rating-val">{product.rating}</span>
              <span className="pd-rating-count">({product.reviews} reviews)</span>
            </div>

            {/* Certifications */}
            <div className="pd-certs">
              {product.certifications?.map(c => (
                <div key={c} className="pd-cert-badge">
                  <Shield size={13} />
                  {c}
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="pd-price-block">
              <span className="pd-price">${product.price.toLocaleString()}</span>
              {product.original_price && (
                <>
                  <span className="pd-price-orig">${product.original_price.toLocaleString()}</span>
                  <span className="badge badge-green">{discount}% OFF</span>
                </>
              )}
              <span className="pd-excl">Excl. VAT & Calibration</span>
            </div>

            {/* Quantity & Add to Cart */}
            {product.in_stock && (
              <div className="pd-purchase">
                <div className="pd-qty">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="pd-qty-btn">−</button>
                  <span className="pd-qty-val">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="pd-qty-btn">+</button>
                </div>
                <button
                  className={`btn btn-primary btn-lg pd-add-btn ${added ? 'btn-added' : ''}`}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={18} />
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            )}

            <Link to="/custom-quote" className="btn btn-outline pd-quote-btn">
              <Package size={16} />
              Request Bulk Quote
            </Link>

            {/* Guarantees */}
            <div className="pd-guarantees">
              <div className="pd-guarantee">
                <Award size={16} />
                <span>24-month calibration guarantee</span>
              </div>
              <div className="pd-guarantee">
                <Truck size={16} />
                <span>Free shipping on orders over $500</span>
              </div>
              <div className="pd-guarantee">
                <Shield size={16} />
                <span>ISO-9001 certification papers included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Specs / Tech Docs */}
        <div className="pd-tabs-section">
          <div className="pd-tabs">
            {['specs', 'docs'].map(tab => (
              <button
                key={tab}
                className={`pd-tab ${activeTab === tab ? 'pd-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'specs' ? 'Core Specifications' : 'Technical Documentation'}
              </button>
            ))}
          </div>

          <div className="pd-tab-content">
            {activeTab === 'specs' && product.specs && (
              <div className="pd-specs-grid">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="pd-spec-row">
                    <div className="pd-spec-key">{key}</div>
                    <div className="pd-spec-val">{val}</div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'docs' && (
              <div className="pd-docs">
                <a href="#" className="pd-doc-link">
                  <Download size={16} />
                  <div>
                    <div className="pd-doc-name">Full Data Sheet (PDF)</div>
                    <div className="pd-doc-desc">Technical Specs & Dimensions</div>
                  </div>
                </a>
                <a href="#" className="pd-doc-link">
                  <Download size={16} />
                  <div>
                    <div className="pd-doc-name">Integration Guide</div>
                    <div className="pd-doc-desc">LIMS & HL7 Connectivity</div>
                  </div>
                </a>
                <a href="#" className="pd-doc-link">
                  <Shield size={16} />
                  <div>
                    <div className="pd-doc-name">Compliance Certificate</div>
                    <div className="pd-doc-desc">ISO/CE Certifications</div>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="pd-related">
            <h2 className="pd-related-title">Precision Accessories</h2>
            <div className="pd-related-grid">
              {related.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="product-card">
                  <img src={p.image_url} alt={p.name} className="product-card-img" />
                  <div className="product-card-body">
                    <div className="product-category">{p.category}</div>
                    <div className="product-name">{p.name}</div>
                    <div className="product-price">${p.price.toLocaleString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
