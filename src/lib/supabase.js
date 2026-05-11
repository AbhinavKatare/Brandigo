import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── PRODUCTS (paginated, real DB) ─────────────────────────

export async function getProductsPaginated({ page = 1, pageSize = 50, search = '', category = '', inStock = null } = {}) {
  const from = (page - 1) * pageSize
  const to   = from + pageSize - 1

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (category) query = query.eq('category', category)
  if (search)   query = query.ilike('name', `%${search}%`)
  if (inStock !== null) query = query.eq('in_stock', inStock)

  const { data, error, count } = await query
  return { data: data || [], error, count, totalPages: Math.ceil((count || 0) / pageSize) }
}

// Admin: get ALL products (no is_active filter, for management)
export async function getAdminProducts({ page = 1, pageSize = 50, search = '', category = '' } = {}) {
  const from = (page - 1) * pageSize
  const to   = from + pageSize - 1

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (category) query = query.eq('category', category)
  if (search)   query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%`)

  const { data, error, count } = await query
  return { data: data || [], error, count, totalPages: Math.ceil((count || 0) / pageSize) }
}

export async function getProducts(filters = {}) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (filters.category) query = query.eq('category', filters.category)
  if (filters.search)   query = query.ilike('name', `%${filters.search}%`)
  if (filters.minPrice) query = query.gte('price', filters.minPrice)
  if (filters.maxPrice) query = query.lte('price', filters.maxPrice)

  const { data, error } = await query
  return { data: data || [], error }
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(8)
  return { data: data || [], error }
}

export async function getProductCategories() {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('is_active', true)
  const categories = [...new Set((data || []).map(p => p.category))].sort()
  return { data: categories, error }
}

// ─── PRODUCT CRUD ───────────────────────────────────────────

export async function uploadProductImage(file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
  return data.publicUrl
}

export async function createProduct(productData) {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      ...productData,
      price: Number(productData.price) || 0,
      original_price: productData.original_price ? Number(productData.original_price) : null,
      rating: productData.rating ? Number(productData.rating) : 4.5,
      reviews: 0,
      is_active: true,
    }])
    .select()
    .single()
  return { data, error }
}

export async function updateProduct(id, productData) {
  const { data, error } = await supabase
    .from('products')
    .update({
      ...productData,
      price: Number(productData.price) || 0,
      original_price: productData.original_price ? Number(productData.original_price) : null,
    })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteProduct(id) {
  // Soft delete: set is_active = false
  const { data, error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function hardDeleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  return { error }
}

export async function toggleProductStock(id, inStock) {
  const { data, error } = await supabase
    .from('products')
    .update({ in_stock: inStock })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// ─── ORDERS ─────────────────────────────────────────────────

export async function createOrder(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single()
  return { data, error }
}

export async function getOrders({ page = 1, pageSize = 20 } = {}) {
  const from = (page - 1) * pageSize
  const to   = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  return { data: data || [], error, count }
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// ─── QUOTES ─────────────────────────────────────────────────

export async function submitQuote(quoteData) {
  const { data, error } = await supabase
    .from('quotes')
    .insert([{ ...quoteData, status: 'pending' }])
    .select()
    .single()
  return { data, error }
}

export async function getQuotes() {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

export async function updateQuoteStatus(id, status, adminNotes = '') {
  const { data, error } = await supabase
    .from('quotes')
    .update({ status, admin_notes: adminNotes })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// ─── SUPPORT TICKETS ────────────────────────────────────────

export async function submitSupportTicket(ticketData) {
  const { data, error } = await supabase
    .from('support_tickets')
    .insert([{ ...ticketData, status: 'open' }])
    .select()
    .single()
  return { data, error }
}

export async function getSupportTickets() {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

export async function updateTicketStatus(id, status, adminResponse = '') {
  const { data, error } = await supabase
    .from('support_tickets')
    .update({ status, admin_response: adminResponse })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// ─── NEWSLETTER ─────────────────────────────────────────────

export async function subscribeNewsletter(email) {
  const { data, error } = await supabase
    .from('newsletter')
    .upsert([{ email }], { onConflict: 'email' })
  return { data, error }
}

// ─── REPORT GENERATION ──────────────────────────────────────

export async function getAllProductsForReport() {
  // Fetches ALL products in batches for CSV export (handles 3000+)
  const allProducts = []
  const batchSize   = 1000
  let page = 0
  let done = false

  while (!done) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, category, price, original_price, in_stock, is_featured, is_active, rating, reviews, created_at')
      .order('created_at', { ascending: false })
      .range(page * batchSize, (page + 1) * batchSize - 1)

    if (error) { done = true; break }
    if (!data || data.length === 0) { done = true; break }

    allProducts.push(...data)
    if (data.length < batchSize) done = true
    page++
  }

  return allProducts
}

export async function getDashboardStats() {
  const [products, orders, quotes, tickets] = await Promise.all([
    supabase.from('products').select('id, in_stock, is_featured, is_active', { count: 'exact' }),
    supabase.from('orders').select('id, total, status', { count: 'exact' }),
    supabase.from('quotes').select('id, status', { count: 'exact' }),
    supabase.from('support_tickets').select('id, status', { count: 'exact' }),
  ])

  const activeProducts  = (products.data || []).filter(p => p.is_active).length
  const lowStock        = (products.data || []).filter(p => p.is_active && !p.in_stock).length
  const totalRevenue    = (orders.data || []).reduce((s, o) => s + (o.total || 0), 0)
  const activeOrders    = (orders.data || []).filter(o => ['pending', 'processing'].includes(o.status)).length
  const pendingQuotes   = (quotes.data || []).filter(q => q.status === 'pending').length
  const openTickets     = (tickets.data || []).filter(t => t.status === 'open').length

  return { activeProducts, lowStock, totalRevenue, activeOrders, pendingQuotes, openTickets }
}
