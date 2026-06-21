import React, { useState, useEffect } from 'react';
import { useTickets } from '../context/TicketContext';
import { classifyTicket, findSimilarTickets } from '../utils/aiEngine';
import { AlertCircle, HelpCircle, CheckCircle2, ChevronRight, MessageSquare, Search, Send, Sparkles } from 'lucide-react';

export default function EmployeePortal() {
  const { 
    tickets, 
    raiseTicket, 
    raiseTicketManualCategory, 
    triggerDeflection 
  } = useTickets();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Medium');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryOverridden, setCategoryOverridden] = useState(false);

  // AI states
  const [aiRecommendation, setAiRecommendation] = useState({ category: 'IT', confidences: {}, isLowConfidence: true });
  const [similarTickets, setSimilarTickets] = useState([]);
  
  // UI feedback states
  const [expandedKbId, setExpandedKbId] = useState(null);
  const [activeHistoryTicket, setActiveHistoryTicket] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Trigger AI classification & similarity matching on text input
  useEffect(() => {
    if (!title && !description) {
      setAiRecommendation({ category: 'IT', confidences: {}, isLowConfidence: true });
      setSimilarTickets([]);
      if (!categoryOverridden) setSelectedCategory('');
      return;
    }

    // Run classification
    const classification = classifyTicket(title, description);
    setAiRecommendation(classification);
    
    // Automatically set the category if the user hasn't manually overridden it
    if (!categoryOverridden) {
      setSelectedCategory(classification.category);
    }

    // Search for duplicates
    const matches = findSimilarTickets(title, description);
    setSimilarTickets(matches);
  }, [title, description, categoryOverridden]);

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    let ticket;
    if (categoryOverridden) {
      ticket = raiseTicketManualCategory(
        title,
        description,
        selectedCategory,
        aiRecommendation.category,
        urgency,
        'Rahul Sharma', // Current User
        aiRecommendation.confidences[selectedCategory] || 0.1
      );
    } else {
      ticket = raiseTicket(
        title,
        description,
        aiRecommendation.category,
        urgency,
        'Rahul Sharma',
        true,
        aiRecommendation.confidences[aiRecommendation.category] || 1.0
      );
    }

    // Reset form
    setTitle('');
    setDescription('');
    setUrgency('Medium');
    setSelectedCategory('');
    setCategoryOverridden(false);
    
    // Show newly created ticket in history view
    setActiveHistoryTicket(ticket);
  };

  // Deflection handler (User found self-service answer)
  const handleDeflection = (kbItem) => {
    triggerDeflection();
    // Reset Form
    setTitle('');
    setDescription('');
    setUrgency('Medium');
    setSelectedCategory('');
    setCategoryOverridden(false);
    setSimilarTickets([]);
    
    alert(`Success!\nWe logged your issue as resolved using details from "${kbItem.title}".\n\nNo support ticket was raised. Thank you for using Nudge self-service!`);
  };

  // Filtered tickets history
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="grid-2">
      {/* LEFT COLUMN: Create Ticket & AI Deflection Panel */}
      <div className="flex-col-container">
        <div className="glass-card" style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--primary)" />
            Raise a Support Ticket
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Issue Summary (Title)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g., VPN connection drops frequently"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Describe the details</label>
              <textarea 
                className="form-textarea" 
                placeholder="Describe what is wrong, error codes, and steps to reproduce. AI will auto-categorize and search self-service solutions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* AI Auto-Categorization Meter */}
            {(title || description) && (
              <div className="ai-copilot-badge">
                <div className="ai-glow-heading">
                  <Sparkles size={14} style={{ animation: 'pulse-glow 1.5s infinite' }} />
                  AI routing engine active
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span>
                    Auto-categorized as: <strong style={{ color: 'var(--text-highlight)' }}>{aiRecommendation.category}</strong>
                  </span>
                  <span style={{ 
                    fontSize: '11px', 
                    padding: '2px 8px', 
                    borderRadius: '9999px',
                    backgroundColor: aiRecommendation.isLowConfidence ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: aiRecommendation.isLowConfidence ? '#f87171' : 'var(--primary)',
                    fontWeight: '600'
                  }}>
                    {aiRecommendation.isLowConfidence ? 'Low Confidence' : `Confidence: ${Math.round(aiRecommendation.confidences[aiRecommendation.category] * 100)}%`}
                  </span>
                </div>
                
                {/* Visual confidence bars */}
                <div style={{ marginTop: '6px' }}>
                  {Object.entries(aiRecommendation.confidences).map(([cat, conf]) => (
                    <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', margin: '3px 0' }}>
                      <span style={{ width: '55px', color: 'var(--text-muted)' }}>{cat}</span>
                      <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${conf * 100}%`, 
                          height: '100%', 
                          backgroundColor: cat === aiRecommendation.category ? 'var(--primary)' : 'rgba(255,255,255,0.2)' 
                        }}></div>
                      </div>
                      <span style={{ width: '25px', textAlign: 'right', color: 'var(--text-muted)' }}>{Math.round(conf * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid-2" style={{ marginTop: '14px' }}>
              <div className="form-group">
                <label className="form-label">Urgency Level</label>
                <div className="urgency-selector">
                  {['Low', 'Medium', 'High', 'Urgent'].map(level => (
                    <div 
                      key={level} 
                      className={`urgency-pill ${urgency === level ? `active ${level.toLowerCase()}` : ''}`}
                      onClick={() => setUrgency(level)}
                    >
                      {level}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Routed Department</label>
                <select 
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCategoryOverridden(true);
                  }}
                  required
                >
                  <option value="" disabled>Select Department</option>
                  <option value="IT">IT (Tech Support)</option>
                  <option value="HR">HR (People Ops)</option>
                  <option value="Finance">Finance & Expense</option>
                  <option value="Admin">Admin & Facilities</option>
                </select>
                {categoryOverridden && (
                  <span style={{ fontSize: '10px', color: '#fb923c', fontWeight: '500', marginTop: '2px' }}>
                    ⚠️ Category overridden manually from AI suggestion
                  </span>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              <Send size={16} />
              Submit Ticket
            </button>
          </form>

          {/* AI Self-Service Deflection Widget */}
          {similarTickets.length > 0 && (
            <div className="ai-deflection-pane">
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <HelpCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-highlight)' }}>
                    Can we solve this right now?
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    We found resolved historical cases matching your description. Check their resolutions to resolve this instantly:
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {similarTickets.slice(0, 2).map((kb) => (
                  <div key={kb.id} className="ai-kb-item">
                    <div 
                      style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', alignItems: 'center' }}
                      onClick={() => setExpandedKbId(expandedKbId === kb.id ? null : kb.id)}
                    >
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>
                        👉 {kb.title}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {expandedKbId === kb.id ? 'Collapse' : 'View Resolution'}
                      </span>
                    </div>

                    {expandedKbId === kb.id && (
                      <div style={{ marginTop: '8px', fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '6px' }}>
                          " {kb.description} "
                        </div>
                        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.06)', borderLeft: '2px solid var(--primary)', padding: '8px 10px', borderRadius: '4px', fontSize: '12px', color: '#e2e8f0' }}>
                          <strong>AI Resolution:</strong> {kb.resolution}
                        </div>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => handleDeflection(kb)}
                          style={{ width: '100%', padding: '6px', fontSize: '11px', marginTop: '8px', gap: '4px', backgroundColor: 'var(--primary)', color: 'var(--bg-main)' }}
                        >
                          <CheckCircle2 size={12} />
                          Yes, this resolved my issue! (Cancel Ticket)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: My Ticket History & Conversation Log */}
      <div className="flex-col-container">
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          
          {/* Header & Filters */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bg-card-border)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>My Tickets History</h3>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search tickets..." 
                  className="form-input" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '34px', width: '100%', height: '36px' }}
                />
              </div>
              
              <select 
                className="form-select" 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ height: '36px', padding: '6px 12px', width: '120px' }}
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Main Body */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* List */}
            <div style={{ width: '230px', borderRight: '1px solid var(--bg-card-border)', overflowY: 'auto' }}>
              {filteredTickets.map((t) => (
                <div 
                  key={t.id}
                  className={`ticket-item ${activeHistoryTicket?.id === t.id ? 'active' : ''}`}
                  onClick={() => setActiveHistoryTicket(t)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-muted)' }}>{t.id}</span>
                    <span className={`badge-status ${t.status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                      {t.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.title}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '1px 4px', borderRadius: '2px' }}>
                      {t.category}
                    </span>
                    <span className={`badge-urgency ${t.urgency.toLowerCase()}`}>
                      {t.urgency}
                    </span>
                  </div>
                </div>
              ))}
              {filteredTickets.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  No tickets found
                </div>
              )}
            </div>

            {/* Conversation Log & Details */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {activeHistoryTicket ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {activeHistoryTicket.id}
                      </span>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-highlight)' }}>
                        {activeHistoryTicket.title}
                      </h4>
                    </div>
                    <span className={`badge-status ${activeHistoryTicket.status.toLowerCase().replace(' ', '-')}`}>
                      {activeHistoryTicket.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#cbd5e1', backgroundColor: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '18px' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      EMPLOYEE DESCRIPTION:
                    </strong>
                    {activeHistoryTicket.description}
                  </div>

                  {/* Comment Timeline */}
                  <div>
                    <h5 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Conversation History
                    </h5>
                    
                    {activeHistoryTicket.comments && activeHistoryTicket.comments.map((c) => (
                      <div key={c.id} className={`comment-bubble ${c.author.includes('Agent') || c.author.includes('AI') ? 'system' : ''}`}>
                        <div className="comment-author">
                          {c.author} • {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                          {c.text}
                        </div>
                      </div>
                    ))}
                    
                    {(!activeHistoryTicket.comments || activeHistoryTicket.comments.length === 0) && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '10px 0' }}>
                        No replies yet. Agent queue response pending.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', textAlign: 'center' }}>
                  <MessageSquare size={36} style={{ marginBottom: '12px', opacity: '0.4' }} />
                  <span style={{ fontSize: '13px' }}>Select a ticket from the left column to view conversations and updates.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
