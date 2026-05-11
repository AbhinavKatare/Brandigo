import { useState, useEffect } from 'react'
import { Link, useLocation, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, MessageSquare, Users,
  Settings, FlaskConical, TrendingUp, ShoppingCart,
  AlertTriangle, RefreshCw, LogOut
} from 'lucide-react'
import { getOrders, getProducts } from '../../lib/supabase'
import { MOCK_PRODUCTS } from '../../lib/mockData'
import './AdminLayout.css'

export default function AdminLayout({ children, activeTab }) {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState(MOCK_PRODUCTS)

  const stats = [
    { label: 'Total Sales (Monthly)', value: '$142,500', change: '+12.4% vs last month', icon: <TrendingUp size={20}/>, color: 'green' },
    { label: 'Active Orders', value: '84', sub: '12 requiring immediate attention', icon: <ShoppingCart size={20}/>, color: 'blue' },
    { label: 'Low Stock Alerts', value: '07', sub: 'Critical replenishment needed', icon: <AlertTriangle size={20}/>, color: 'red' },
  ]

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18}/> },
    { to: '/admin/quotes', label: 'Quotes & Support', icon: <MessageSquare size={18}/> },
  ]

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__brand-icon"><FlaskConical size={18}/></div>
          <div>
            <div className="admin-sidebar__brand-name">brandingo</div>
            <div className="admin-sidebar__brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `admin-nav__item ${isActive ? 'admin-nav__item--active' : ''}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__generate-btn">Generate Report</button>
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__user-avatar">A</div>
            <div>
              <div className="admin-sidebar__user-name">Admin Profile</div>
              <div className="admin-sidebar__user-role">System Controller</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* System status bar */}
        <div className="admin-status-bar">
          <span className="admin-status-dot"/> SYSTEM STATUS: OPERATIONAL
        </div>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}
