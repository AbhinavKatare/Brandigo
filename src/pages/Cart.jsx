import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Shield, Package } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { createOrder } from '../lib/supabase'
import { useState } from 'react'
import './Cart.css'

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, subtotal, tax, total, totalItems } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(false)

  const handleCheckout = async () => {
    setPlacing(true)
    await createOrder({
      items: JSON.stringify(items),
      subtotal,
      tax,
      total,
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    clearCart()
    setPlaced(true)
    setPlacing(false)
  }

  if (placed) {
    return (
      <div className="cart-success page-enter">
        <div className="cart-success__box">
          <div className="cart-success__icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. Our team will contact you within 2 hours to confirm delivery and calibration details.</p>
          <div className="cart-success__actions">
            <Link to="/catalogue" className="btn btn-primary">Continue Shopping</Link>
            <Link to="/" className="btn btn-outline">Go to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty page-enter">
        <ShoppingCart size={64} className="cart-empty__icon" />
        <h2>Your cart is empty</h2>
        <p>Explore our catalogue of precision lab instruments and add items to your cart.</p>
        <Link to="/catalogue" className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem' }}>
          Browse Catalogue <ArrowRight size={16}/>
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page page-enter">
      <div className="container">
        {/* Header */}
        <div className="cart-header">
          <div>
            <p className="section-label">System Inventory</p>
            <h1>Your Selection</h1>
          </div>
          <span className="cart-count-badge">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-body">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__img">
                  <img src={item.image_url} alt={item.name} />
                </div>
                <div className="cart-item__info">
                  <div className="cart-item__category">{item.category}</div>
                  <div className="cart-item__name">{item.name}</div>
                  <div className="cart-item__desc">{item.description?.slice(0, 80)}...</div>
                </div>
                <div className="cart-item__controls">
                  <div className="cart-item__price-label">UNIT PRICE</div>
                  <div className="cart-item__unit-price">${item.price.toLocaleString()}</div>
                  <div className="cart-item__qty-row">
                    <span className="cart-item__qty-label">QUANTITY</span>
                    <div className="cart-item__qty">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="cart-qty-btn">
                        <Minus size={14}/>
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="cart-qty-btn">
                        <Plus size={14}/>
                      </button>
                    </div>
                  </div>
                  <div className="cart-item__total">
                    <span className="cart-item__total-label">TOTAL LINE ITEM</span>
                    <span className="cart-item__total-val">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
                <button className="cart-item__remove" onClick={() => removeItem(item.id)}>
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>

            <div className="cart-summary__rows">
              <div className="cart-summary__row">
                <span>SUBTOTAL</span>
                <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="cart-summary__row">
                <span>ESTIMATED SHIPPING</span>
                <span>Calculated at Checkout</span>
              </div>
              <div className="cart-summary__row">
                <span>TAX (GST 18%)</span>
                <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="cart-summary__total">
              <span>ESTIMATED TOTAL</span>
              <div>
                <span className="cart-summary__total-val">
                  ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="badge badge-teal" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>INR</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg cart-checkout-btn"
              onClick={handleCheckout}
              disabled={placing}
            >
              {placing ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <Link to="/catalogue" className="cart-continue-link">
              Continue Researching
            </Link>

            <div className="cart-precision-note">
              <Shield size={16}/>
              <div>
                <div className="cart-precision-title">PRECISION ASSURANCE</div>
                <div className="cart-precision-desc">All equipment includes a 24-month calibration guarantee and ISO-9001 certification papers.</div>
              </div>
            </div>

            <Link to="/custom-quote" className="btn btn-outline cart-quote-btn">
              <Package size={16}/>
              Request Bulk Quote Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
