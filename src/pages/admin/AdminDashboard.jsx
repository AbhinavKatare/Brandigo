import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, ShoppingCart, AlertTriangle, Package,
  Edit3, Trash2, Plus, Search, X, Check, Download, ChevronLeft, ChevronRight
} from 'lucide-react'
import AdminLayout from './AdminLayout'
import { 
  getAdminProducts, 
  updateProduct, 
  deleteProduct, 
  createProduct,
  getAllProductsForReport,
  getDashboardStats,
  uploadProductImage
} from '../../lib/supabase'
import './AdminProducts.css'

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({ activeProducts: 0, lowStock: 0, totalRevenue: 0, activeOrders: 0 })
  const [loading, setLoading] = useState(true)
  const [reportLoading, setReportLoading] = useState(false)
  
  // Pagination & Search
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  
  const initialProductState = {
    name: '', category: '', price: '', original_price: '', description: '', image_url: '', in_stock: true, is_active: true, is_featured: false
  }
  const [currentProduct, setCurrentProduct] = useState(initialProductState)
  const [imageFile, setImageFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [productsRes, statsRes] = await Promise.all([
        getAdminProducts({ page, pageSize: 20, search: searchQuery, category }),
        getDashboardStats()
      ])
      setProducts(productsRes?.data || [])
      setTotalPages(productsRes?.totalPages || 1)
      if (statsRes) setStats(statsRes)
    } catch (err) {
      console.error("Dashboard fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [page, searchQuery, category])

  // Handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setPage(1)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    await deleteProduct(id)
    fetchDashboardData()
  }

  const handleToggleStock = async (p) => {
    await updateProduct(p.id, { in_stock: !p.in_stock })
    setProducts(products.map(prod => prod.id === p.id ? { ...prod, in_stock: !p.in_stock } : prod))
  }

  const handleSaveProduct = async () => {
    setIsSubmitting(true)
    try {
      let finalImageUrl = currentProduct.image_url

      if (imageFile) {
        finalImageUrl = await uploadProductImage(imageFile)
      }

      const payload = { ...currentProduct, image_url: finalImageUrl }

      if (showEditModal && currentProduct.id) {
        await updateProduct(currentProduct.id, payload)
      } else {
        await createProduct(payload)
      }

      setShowAddModal(false)
      setShowEditModal(false)
      setCurrentProduct(initialProductState)
      setImageFile(null)
      fetchDashboardData()
    } catch (err) {
      console.error(err)
      alert('Failed to save product. If uploading an image, ensure you created the product-images storage bucket.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditModal = (product) => {
    setCurrentProduct({ ...product })
    setImageFile(null)
    setShowEditModal(true)
  }

  const generateReport = async () => {
    setReportLoading(true)
    try {
      const allProducts = await getAllProductsForReport()
      if (!allProducts.length) return alert('No products found.')

      const headers = ['ID', 'Name', 'Category', 'Price', 'Original Price', 'In Stock', 'Active', 'Created At']
      const csvContent = [
        headers.join(','),
        ...allProducts.map(p => [
          p.id, 
          `"${p.name.replace(/"/g, '""')}"`, 
          `"${p.category}"`, 
          p.price, 
          p.original_price || '', 
          p.in_stock, 
          p.is_active,
          new Date(p.created_at).toLocaleDateString()
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `brandingo_inventory_report_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error(err)
      alert('Failed to generate report')
    }
    setReportLoading(false)
  }

  const STATS_DATA = [
    { label: 'Active Products', value: stats.activeProducts, icon: <Package size={20}/>, color: '#0D5C3A' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <TrendingUp size={20}/>, color: '#1D4ED8' },
    { label: 'Low Stock Alerts', value: stats.lowStock, icon: <AlertTriangle size={20}/>, color: '#DC2626', alert: stats.lowStock > 0 },
    { label: 'Active Orders', value: stats.activeOrders, icon: <ShoppingCart size={20}/>, color: '#D4A843' }
  ]

  return (
    <AdminLayout>
      <div className="admin-dashboard page-enter">
        {/* Header */}
        <div className="admin-dashboard__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="admin-dashboard__title">Executive Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="admin-dashboard__date">
              📅 {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <button 
              className="btn btn-outline btn-sm" 
              onClick={generateReport}
              disabled={reportLoading}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {reportLoading ? <span className="auth-spinner" style={{width: 14, height: 14, borderColor: 'var(--primary)', borderTopColor: 'transparent'}}></span> : <Download size={16} />}
              {reportLoading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {STATS_DATA.map(s => (
            <div key={s.label} className={`admin-stat-card ${s.alert ? 'admin-stat-card--alert' : ''}`}>
              <div className="admin-stat-card__label">{s.label}</div>
              <div className="admin-stat-card__row">
                <div className="admin-stat-card__value">{s.value}</div>
                <div className="admin-stat-card__icon" style={{ color: s.color }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== PRODUCT MANAGEMENT ===== */}
        <div className="admin-products-section">
          <div className="admin-section__header">
            <h2>Product Inventory</h2>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div className="admin-search-wrap">
                <Search size={14} className="admin-search-icon"/>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="admin-search"
                />
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => { setCurrentProduct(initialProductState); setShowAddModal(true); }}>
                <Plus size={15}/> Add Product
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>Loading inventory...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No products found.</td></tr>
                ) : (
                  products.map(p => (
                    <tr key={p.id} style={{ opacity: p.is_active ? 1 : 0.5 }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={p.image_url || 'https://via.placeholder.com/44'} alt={p.name} style={{ width: 44, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                          <div>
                            <div className="admin-table__product">{p.name}</div>
                            {p.is_active && (
                              <Link target="_blank" to={`/product/${p.id}`} className="admin-table__sku" style={{ color: 'var(--accent)' }}>
                                View Live →
                              </Link>
                            )}
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-teal">{p.category}</span></td>
                      <td className="admin-table__amount">${p.price?.toLocaleString()}</td>
                      <td>
                        <button
                          onClick={() => handleToggleStock(p)}
                          className={`badge ${p.in_stock ? 'badge-green' : 'badge-red'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                        >
                          {p.in_stock ? '✓ In Stock' : '✗ Out of Stock'}
                        </button>
                      </td>
                      <td>
                        <span className={`badge ${p.is_active ? 'badge-blue' : 'badge-red'}`}>
                          {p.is_active ? 'Active' : 'Archived'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="admin-action-btn admin-action-btn--edit" title="Edit" onClick={() => openEditModal(p)}>
                            <Edit3 size={14}/>
                          </button>
                          {p.is_active && (
                            <button className="admin-action-btn admin-action-btn--delete" title="Delete" onClick={() => handleDelete(p.id)}>
                              <Trash2 size={14}/>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Page {page} of {totalPages}</span>
              <button className="btn btn-outline btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {(showAddModal || showEditModal) && (
          <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && (setShowAddModal(false), setShowEditModal(false))}>
            <div className="admin-modal">
              <div className="admin-modal__header">
                <h3>{showEditModal ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => {setShowAddModal(false); setShowEditModal(false);}}><X size={18}/></button>
              </div>
              <div className="admin-modal__body">
                <div className="admin-modal__grid">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Product Name</label>
                    <input className="form-input" value={currentProduct.name} onChange={e => setCurrentProduct(p => ({...p, name: e.target.value}))} placeholder="e.g., Precision Microscope X1" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input className="form-input" value={currentProduct.category} onChange={e => setCurrentProduct(p => ({...p, category: e.target.value}))} placeholder="e.g., Optics & Imaging" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (USD)</label>
                    <input type="number" className="form-input" value={currentProduct.price} onChange={e => setCurrentProduct(p => ({...p, price: e.target.value}))} placeholder="e.g., 2499" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Price (USD) - Optional</label>
                    <input type="number" className="form-input" value={currentProduct.original_price} onChange={e => setCurrentProduct(p => ({...p, original_price: e.target.value}))} placeholder="e.g., 2999" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Product Image (JPG, PNG)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="form-input" 
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0])
                        }
                      }} 
                    />
                    {currentProduct.image_url && !imageFile && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        Current image: <a href={currentProduct.image_url} target="_blank" rel="noreferrer">View</a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-input form-textarea" rows={3} value={currentProduct.description || ''} onChange={e => setCurrentProduct(p => ({...p, description: e.target.value}))} placeholder="Product description..." />
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', padding: '1rem', background: 'var(--bg-off)', borderRadius: 'var(--radius-md)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                    <input type="checkbox" checked={currentProduct.is_featured} onChange={e => setCurrentProduct(p => ({...p, is_featured: e.target.checked}))} />
                    Featured
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                    <input type="checkbox" checked={currentProduct.in_stock} onChange={e => setCurrentProduct(p => ({...p, in_stock: e.target.checked}))} />
                    In Stock
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                    <input type="checkbox" checked={currentProduct.is_active} onChange={e => setCurrentProduct(p => ({...p, is_active: e.target.checked}))} />
                    Active
                  </label>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button className="btn btn-outline" onClick={() => {setShowAddModal(false); setShowEditModal(false);}} disabled={isSubmitting}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveProduct} disabled={isSubmitting || !currentProduct.name || !currentProduct.price}>
                  {isSubmitting ? <span className="auth-spinner" style={{width: 16, height: 16}}></span> : <Check size={15}/>} 
                  {showEditModal ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
