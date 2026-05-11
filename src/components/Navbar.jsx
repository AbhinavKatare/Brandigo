import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Menu, X, FlaskConical, User, LogOut, ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { totalItems }              = useCart()
  const { user, isAdmin, signOut }  = useAuth()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/catalogue', label: 'Catalogue' },
    { to: '/about', label: 'About Us' },
    { to: '/custom-quote', label: 'Custom Quote' },
    { to: '/support', label: 'Support' },
  ]

  // Get user display name
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account'
  const initials    = displayName.charAt(0).toUpperCase()

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <FlaskConical size={22} />
          </div>
          <span className="navbar__logo-text">
            brand<span className="navbar__logo-accent">ingo</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar__links">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="navbar__actions">
          <button
            className="navbar__icon-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          <Link to="/cart" className="navbar__icon-btn navbar__cart-btn">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="navbar__cart-badge">{totalItems}</span>
            )}
          </Link>

          {/* Auth section */}
          {user ? (
            // Logged-in user avatar + dropdown
            <div className="navbar__user-menu" ref={userMenuRef}>
              <button
                className="navbar__user-btn"
                onClick={() => setUserMenuOpen(v => !v)}
              >
                <div className="navbar__user-avatar">{initials}</div>
                <span className="navbar__user-name">{displayName.split(' ')[0]}</span>
                <ChevronDown size={14} className={`navbar__user-chevron ${userMenuOpen ? 'navbar__user-chevron--open' : ''}`} />
              </button>
              {userMenuOpen && (
                <div className="navbar__user-dropdown">
                  <div className="navbar__user-dropdown-header">
                    <div className="navbar__user-dropdown-name">{displayName}</div>
                    <div className="navbar__user-dropdown-email">{user.email}</div>
                    {isAdmin && <span className="navbar__user-admin-badge">ADMIN</span>}
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="navbar__user-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      🛠️ Admin Panel
                    </Link>
                  )}
                  <button
                    className="navbar__user-dropdown-item navbar__user-dropdown-logout"
                    onClick={handleSignOut}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Not logged in: show Login button only
            <>
              <Link to="/login" className="btn btn-primary btn-sm navbar__cta">
                Sign In
              </Link>
            </>
          )}

          <button
            className="navbar__mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="navbar__search-bar">
          <div className="container">
            <form onSubmit={handleSearch} className="navbar__search-form">
              <Search size={18} className="navbar__search-icon" />
              <input
                type="text"
                placeholder="Search for microscopes, analyzers, consumables..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="navbar__search-input"
                autoFocus
              />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="navbar__search-close"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className="navbar__mobile-link"
              onClick={() => setMenuOpen(false)}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                  🛠️ Admin Panel
                </Link>
              )}
              <button className="navbar__mobile-link navbar__mobile-logout" onClick={handleSignOut}>
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
