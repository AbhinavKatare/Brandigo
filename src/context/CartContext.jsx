import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'brandingo_cart'

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.id === action.payload.id)
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
      }
    case 'UPDATE_QTY':
      if (action.payload.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.qty } : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'LOAD_CART':
      return { ...state, items: action.payload }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) })
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product })
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const tax = subtotal * 0.18  // 18% GST
  const total = subtotal + tax

  return (
    <CartContext.Provider value={{
      items: state.items,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      totalItems,
      subtotal,
      tax,
      total,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
