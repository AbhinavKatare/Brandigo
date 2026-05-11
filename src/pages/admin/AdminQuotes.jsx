import { useState, useEffect } from 'react'
import { MessageSquare, FileText, CheckCircle, Clock, X, Eye, RefreshCw } from 'lucide-react'
import AdminLayout from './AdminLayout'
import { getQuotes, getSupportTickets, updateQuoteStatus } from '../../lib/supabase'
import './AdminQuotes.css'

const MOCK_QUOTES = [
  { id: 'Q-001', full_name: 'Dr. Julian Vane', organization: 'Quantico Research Labs', email: 'j.vane@quantico.edu', budget_range: '$50k - $100k', delivery_timeline: 'Quarterly', specifications: 'PCR Thermocycler x4, Hematology Analyzer x2. Need CE certified units with on-site calibration.', status: 'pending', created_at: '2024-05-10T08:32:00Z' },
  { id: 'Q-002', full_name: 'Sarah Chen', organization: 'Metro Health Hospital', email: 's.chen@metro.health', budget_range: '$100k - $500k', delivery_timeline: '30-60 Days', specifications: 'Centrifuge X-400 x8, Pipette Sets x50, Microscopes Z-1 x12.', status: 'reviewing', created_at: '2024-05-09T15:21:00Z' },
  { id: 'Q-003', full_name: 'Marcus Thorne', organization: 'NovaBio Pharma', email: 'm.thorne@novabio.com', budget_range: 'Under $10k', delivery_timeline: 'Immediate', specifications: 'Calibration slides, NIST-traceable, set of 50.', status: 'approved', created_at: '2024-05-07T11:00:00Z' },
]

const MOCK_TICKETS = [
  { id: 'T-001', name: 'Alice Pearce', email: 'alice@labs.in', subject: 'Centrifuge X-400 rotor imbalance error', category: 'Technical Support', message: 'We are getting E-03 rotor imbalance alert on our Centrifuge unit despite balanced loads. Serial: CX-400-00291.', status: 'open', created_at: '2024-05-10T09:15:00Z' },
  { id: 'T-002', name: 'Raj Sharma', email: 'raj@diagnostics.co', subject: 'Invoice correction for PL-89211', category: 'Billing & Payments', message: 'Invoice amount shows $12,800 but purchase order was agreed at $11,900. Please issue a revised invoice.', status: 'in-progress', created_at: '2024-05-09T14:00:00Z' },
  { id: 'T-003', name: 'Emily Holt', email: 'emily@cbiolab.com', subject: 'Microscope Z-1 calibration certificate request', category: 'Calibration & Service', message: 'Requesting the ISO calibration certificate for our recently delivered Z-1 unit (serial MZ1-90344).', status: 'resolved', created_at: '2024-05-08T11:00:00Z' },
]

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState(MOCK_QUOTES)
  const [tickets, setTickets] = useState(MOCK_TICKETS)
  const [activeTab, setActiveTab] = useState('quotes')
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)

  const [replyText, setReplyText] = useState('')

  const refresh = async () => {
    setLoading(true)
    const { data: q } = await getQuotes()
    const { data: t } = await getSupportTickets()
    if (q && q.length > 0) setQuotes(q)
    if (t && t.length > 0) setTickets(t)
    setLoading(false)
  }

  const handleQuoteStatus = async (id, status) => {
    await updateQuoteStatus(id, status)
    setQuotes(qs => qs.map(q => q.id === id ? { ...q, status } : q))
    if (selectedItem?.id === id) setSelectedItem(s => ({ ...s, status }))
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedItem) return
    
    // In a real app, this might send an actual email via Edge Functions.
    // For now, we save it as admin notes/response in the DB and mark it resolved/completed.
    if (activeTab === 'quotes') {
      await updateQuoteStatus(selectedItem.id, 'completed', replyText)
      setQuotes(qs => qs.map(q => q.id === selectedItem.id ? { ...q, status: 'completed', admin_notes: replyText } : q))
      setSelectedItem(s => ({ ...s, status: 'completed', admin_notes: replyText }))
    } else {
      await updateTicketStatus(selectedItem.id, 'resolved', replyText)
      setTickets(ts => ts.map(t => t.id === selectedItem.id ? { ...t, status: 'resolved', admin_response: replyText } : t))
      setSelectedItem(s => ({ ...s, status: 'resolved', admin_response: replyText }))
    }
    
    setReplyText('')
    alert('Response sent and marked as completed/resolved!')
  }

  const STATUS_COLORS = {
    pending: 'badge-gold',
    completed: 'badge-green',
    ignored: 'badge-gray',
    open: 'badge-red',
    'in-progress': 'badge-blue',
    resolved: 'badge-green',
  }

  const formatDate = (dt) => new Date(dt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <AdminLayout>
      <div className="admin-quotes page-enter">
        {/* Header */}
        <div className="admin-quotes__header">
          <div>
            <h1>Quotes & Support</h1>
            <p className="admin-quotes__sub">Manage institutional quote requests and customer support tickets.</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={refresh} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'spin' : ''}/>
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="admin-quotes-stats">
          <div className="aq-stat">
            <div className="aq-stat__val">{quotes.filter(q => q.status === 'pending').length}</div>
            <div className="aq-stat__label">Pending Quotes</div>
          </div>
          <div className="aq-stat">
            <div className="aq-stat__val">{quotes.filter(q => q.status === 'completed').length}</div>
            <div className="aq-stat__label">Completed Quotes</div>
          </div>
          <div className="aq-stat" style={{ borderColor: '#FCA5A5' }}>
            <div className="aq-stat__val" style={{ color: '#DC2626' }}>{tickets.filter(t => t.status === 'open').length}</div>
            <div className="aq-stat__label">Open Tickets</div>
          </div>
          <div className="aq-stat">
            <div className="aq-stat__val">{tickets.filter(t => t.status === 'resolved').length}</div>
            <div className="aq-stat__label">Resolved Tickets</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="aq-tabs">
          <button className={`aq-tab ${activeTab === 'quotes' ? 'aq-tab--active' : ''}`} onClick={() => setActiveTab('quotes')}>
            <FileText size={16}/> Custom Quotes
          </button>
          <button className={`aq-tab ${activeTab === 'tickets' ? 'aq-tab--active' : ''}`} onClick={() => setActiveTab('tickets')}>
            <MessageSquare size={16}/> Support Tickets
          </button>
        </div>

        {/* Content */}
        <div className="aq-body">
          {/* List */}
          <div className="aq-list">
            {(activeTab === 'quotes' ? quotes : tickets).map(item => (
              <div
                key={item.id}
                className={`aq-list-item ${selectedItem?.id === item.id ? 'aq-list-item--active' : ''}`}
                onClick={() => { setSelectedItem(item); setReplyText(''); }}
              >
                <div className="aq-list-item__top">
                  <span className="aq-list-item__id">{item.id}</span>
                  <span className={`badge ${STATUS_COLORS[item.status] || 'badge-teal'}`}>{item.status}</span>
                </div>
                <div className="aq-list-item__name">{item.full_name || item.name}</div>
                <div className="aq-list-item__org">{item.organization || item.category}</div>
                <div className="aq-list-item__date">{formatDate(item.created_at)}</div>
              </div>
            ))}

            {(activeTab === 'quotes' ? quotes : tickets).length === 0 && (
              <div className="aq-empty">
                {activeTab === 'quotes' ? <FileText size={36}/> : <MessageSquare size={36}/>}
                <p>No {activeTab === 'quotes' ? 'quote requests' : 'support tickets'} yet.</p>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="aq-detail">
            {!selectedItem ? (
              <div className="aq-detail__empty">
                <Eye size={40}/>
                <p>Select an item from the list to view details</p>
              </div>
            ) : (
              <div className="aq-detail__content">
                <div className="aq-detail__header">
                  <div>
                    <div className="aq-detail__id">{selectedItem.id}</div>
                    <div className="aq-detail__name">{selectedItem.full_name || selectedItem.name}</div>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="aq-detail__close">
                    <X size={18}/>
                  </button>
                </div>

                <div className="aq-detail__fields">
                  <div className="aq-field">
                    <div className="aq-field__label">Organization / Category</div>
                    <div className="aq-field__val">{selectedItem.organization || selectedItem.category || '—'}</div>
                  </div>
                  <div className="aq-field">
                    <div className="aq-field__label">Email</div>
                    <div className="aq-field__val">
                      <a href={`mailto:${selectedItem.email}`} style={{ color: 'var(--accent)' }}>{selectedItem.email}</a>
                    </div>
                  </div>
                  {selectedItem.budget_range && (
                    <div className="aq-field">
                      <div className="aq-field__label">Budget Range</div>
                      <div className="aq-field__val">{selectedItem.budget_range}</div>
                    </div>
                  )}
                  {selectedItem.delivery_timeline && (
                    <div className="aq-field">
                      <div className="aq-field__label">Delivery Timeline</div>
                      <div className="aq-field__val">{selectedItem.delivery_timeline}</div>
                    </div>
                  )}
                  <div className="aq-field aq-field--full">
                    <div className="aq-field__label">{activeTab === 'quotes' ? 'Specifications' : 'Message'}</div>
                    <div className="aq-field__val aq-field__message">{selectedItem.specifications || selectedItem.message}</div>
                  </div>
                  <div className="aq-field">
                    <div className="aq-field__label">Submitted</div>
                    <div className="aq-field__val">{formatDate(selectedItem.created_at)}</div>
                  </div>
                  <div className="aq-field">
                    <div className="aq-field__label">Current Status</div>
                    <div className="aq-field__val">
                      <span className={`badge ${STATUS_COLORS[selectedItem.status] || 'badge-teal'}`}>
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>
                  {(selectedItem.admin_notes || selectedItem.admin_response) && (
                    <div className="aq-field aq-field--full">
                      <div className="aq-field__label">Previous Admin Response</div>
                      <div className="aq-field__val aq-field__message" style={{ background: 'var(--bg-off)', padding: '0.75rem', borderRadius: 6 }}>
                        {selectedItem.admin_notes || selectedItem.admin_response}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {activeTab === 'quotes' && (
                  <div className="aq-actions">
                    <div className="aq-actions__label">Update Status</div>
                    <div className="aq-actions__btns">
                      {['pending', 'completed', 'ignored'].map(s => (
                        <button
                          key={s}
                          className={`btn btn-sm ${selectedItem.status === s ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => handleQuoteStatus(selectedItem.id, s)}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="aq-reply">
                  <div className="aq-actions__label">Send Reply</div>
                  <textarea 
                    className="form-input form-textarea" 
                    rows={4} 
                    placeholder="Type your response to this customer..." 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button 
                    className="btn btn-primary btn-sm" 
                    style={{ marginTop: '0.75rem' }}
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    Send Response
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
