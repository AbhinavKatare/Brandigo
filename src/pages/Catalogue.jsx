import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, Star, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { MOCK_PRODUCTS, CATEGORIES } from '../lib/mockData'
import './Catalogue.css'

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()

  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [addedId, setAddedId] = useState(null)

  useEffect(() => {
    let filtered = [...MOCK_PRODUCTS]

    if (activeCategory && activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory)
    }
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice))
    if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice))
    if (minRating) filtered = filtered.filter(p => p.rating >= minRating)

    switch (sortBy) {
      case 'price-asc':  filtered.sort((a, b) => a.price - b.price); break
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break
      case 'rating':     filtered.sort((a, b) => b.rating - a.rating); break
      default:           filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    }

    setProducts(filtered)
  }, [activeCategory, searchQuery, sortBy, minPrice, maxPrice, minRating])

  const handleAdd = (product, e) => {
    e.preventDefault()
    addItem(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1800)
  }

  const clearFilters = () => {
    setActiveCategory('all')
    setSearchQuery('')
    setMinPrice('')
    setMaxPrice('')
    setMinRating(0)
    setSortBy('popular')
  }

  return (
    <div className="catalogue page-enter">
      {/* Header */}
      <div className="catalogue__header">
        <div className="container">
          <div className="catalogue__breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Catalogue</span>
          </div>
          <h1 className="catalogue__title">Product Catalogue</h1>
          <p className="catalogue__sub">
            ISO-certified diagnostic instruments, lab equipment, and precision consumables for healthcare professionals.
          </p>
        </div>
      </div>

      <div className="container catalogue__body">
        {/* ===== SIDEBAR ===== */}
        <aside className={`catalogue__sidebar ${showFilters ? 'catalogue__sidebar--open' : ''}`}>
          <div className="catalogue__sidebar-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="catalogue__clear-btn">Clear All</button>
          </div>

          {/* Categories */}
          <div className="filter-group">
            <div className="filter-group__title">Category</div>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`filter-cat-btn ${activeCategory === cat.id ? 'filter-cat-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <div className="filter-group__title">Price Range (USD)</div>
            <div className="filter-price-row">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="form-input"
              />
              <span className="filter-price-sep">–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Min Rating */}
          <div className="filter-group">
            <div className="filter-group__title">Minimum Rating</div>
            {[4, 3, 2].map(r => (
              <button
                key={r}
                className={`filter-cat-btn ${minRating === r ? 'filter-cat-btn--active' : ''}`}
                onClick={() => setMinRating(minRating === r ? 0 : r)}
              >
                {'★'.repeat(r)} & above
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="filter-cta">
            <p>Need bulk pricing?</p>
            <Link to="/custom-quote" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              Request Custom Quote
            </Link>
          </div>
        </aside>

        {/* ===== MAIN ===== */}
        <main className="catalogue__main">
          {/* Toolbar */}
          <div className="catalogue__toolbar">
            <div className="catalogue__search-wrap">
              <Search size={16} className="catalogue__search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="catalogue__search"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="catalogue__search-clear">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="catalogue__toolbar-right">
              <span className="catalogue__count">{products.length} Products</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="form-select catalogue__sort"
              >
                <option value="popular">Popularity</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <button
                className="catalogue__filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="catalogue__empty">
              <div className="catalogue__empty-icon">🔬</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term.</p>
              <button onClick={clearFilters} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="catalogue__grid">
              {products.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} className="product-card">
                  <div className="product-card-img-wrap">
                    <img src={p.image_url} alt={p.name} className="product-card-img" />
                    {p.badge && <span className="badge badge-green product-card-badge">{p.badge}</span>}
                    {!p.in_stock && <div className="product-card-oos">Out of Stock</div>}
                  </div>
                  <div className="product-card-body">
                    <div className="product-category">{p.category}</div>
                    <div className="product-name">{p.name}</div>
                    <div className="stars">
                      {'★'.repeat(Math.floor(p.rating))}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                        ({p.reviews})
                      </span>
                    </div>
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
                          <ShoppingCart size={14} />
                          {addedId === p.id ? 'Added' : 'Add'}
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
