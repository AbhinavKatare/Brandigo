import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { RequireAdmin } from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Public pages
import Home        from './pages/Home'
import Catalogue   from './pages/Catalogue'
import ProductDetail from './pages/ProductDetail'
import Cart        from './pages/Cart'
import About       from './pages/About'
import CustomQuote from './pages/CustomQuote'
import Support     from './pages/Support'

// Auth pages
import { LoginPage, SignupPage, ForgotPasswordPage } from './pages/AuthPages'
import AdminLogin  from './pages/AdminLogin'

// Admin pages (protected)
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminQuotes    from './pages/admin/AdminQuotes'

import './index.css'

function Layout() {
  const location = useLocation()
  const isAdmin  = location.pathname.startsWith('/admin')
  const isAuth   = ['/login', '/signup', '/forgot-password', '/admin-login'].includes(location.pathname)

  return (
    <>
      {/* No Navbar on auth pages or admin panel */}
      {!isAdmin && !isAuth && <Navbar />}

      <main style={{ minHeight: (isAdmin || isAuth) ? undefined : 'calc(100vh - 68px)' }}>
        <Routes>
          {/* ─── Public Routes ─── */}
          <Route path="/"              element={<Home />} />
          <Route path="/catalogue"     element={<Catalogue />} />
          <Route path="/product/:id"   element={<ProductDetail />} />
          <Route path="/cart"          element={<Cart />} />
          <Route path="/about"         element={<About />} />
          <Route path="/custom-quote"  element={<CustomQuote />} />
          <Route path="/support"       element={<Support />} />

          {/* ─── Auth Routes ─── */}
          <Route path="/login"            element={<LoginPage />} />
          <Route path="/signup"           element={<SignupPage />} />
          <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
          <Route path="/admin-login"      element={<AdminLogin />} />

          {/* ─── Admin Routes (protected) ─── */}
          <Route path="/admin" element={
            <RequireAdmin><AdminDashboard /></RequireAdmin>
          } />
          <Route path="/admin/products" element={
            <RequireAdmin><AdminDashboard /></RequireAdmin>
          } />
          <Route path="/admin/quotes" element={
            <RequireAdmin><AdminQuotes /></RequireAdmin>
          } />
          <Route path="/admin/customers" element={
            <RequireAdmin><AdminDashboard /></RequireAdmin>
          } />
          <Route path="/admin/settings" element={
            <RequireAdmin><AdminDashboard /></RequireAdmin>
          } />

          {/* ─── 404 ─── */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
              <h1 style={{ fontSize: '5rem', color: 'var(--border)' }}>404</h1>
              <h2>Page Not Found</h2>
              <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                Go Home
              </a>
            </div>
          } />
        </Routes>
      </main>

      {/* No Footer on auth or admin pages */}
      {!isAdmin && !isAuth && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
