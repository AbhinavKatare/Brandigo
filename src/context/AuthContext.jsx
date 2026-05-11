import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// ─── ADMIN CREDENTIALS ──────────────────────────────────────
// Change these to your desired admin email/password
export const ADMIN_EMAIL = 'jijaji@brandingo.in'
export const ADMIN_PASSWORD = 'AbhinavKatare'
// ────────────────────────────────────────────────────────────

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdmin = (u) => {
    if (!u) return false
    return u.email === ADMIN_EMAIL
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      setIsAdmin(checkAdmin(u))
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      setIsAdmin(checkAdmin(u))
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Sign up a new user
  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    })
    return { data, error }
  }

  // Sign in with email/password
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  // Reset password
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { data, error }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
