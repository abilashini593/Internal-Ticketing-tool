import React, { useState, useEffect } from 'react';
import { useTickets } from '../context/TicketContext';
import { draftAIResponse } from '../utils/aiEngine';
import { 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  AlertTriangle,
  FolderOpen,
  Filter
} from 'lucide-react';

export default function AgentDashboard() {
  const {
    tickets,
    agentDepartment,
    setAgentDepartment,
    updateTicketStatus,
    addCommentToTicket
  } = useTickets();

  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [replyText, setReplyText] = useState('');
  const [isAiUsedForReply, setIsAiUsedForReply] = useState(false);

  // Filter tickets by department and status
  const departmentTickets = tickets.filter(t => t.category === agentDepartment);
  const filteredTickets = departmentTickets.filter(t => {
    if (statusFilter === 'All') return true;
    return t.status === statusFilter;
  });

  // Get active selected ticket
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;

  // Set default selected ticket if current selection is not in the filtered queue
  useEffect(() => {
    if (filteredTickets.length > 0) {
      if (!selectedTicketId || !filteredTickets.some(t => t.id === selectedTicketId)) {
        setSelectedTicketId(filteredTickets[0].id);
      }
    } else {
      setSelectedTicketId(null);
    }
  }, [agentDepartment, statusFilter, tickets]);

  const handleStatusChange = (newStatus) => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, newStatus);
  };

  const handleApplyDraft = () => {
    if (!selectedTicket) return;
    const draft = draftAIResponse(selectedTicket);
    setReplyText(draft);
    setIsAiUsedForReply(true);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    addCommentToTicket(
      selectedTicket.id,
      `Agent (${agentDepartment})`,
      replyText,
      isAiUsedForReply
    );

    // If ticket was Open, transition to In Progress on reply
    if (selectedTicket.status === 'Open') {
      updateTicketStatus(selectedTicket.id, 'In Progress');
    }

    setReplyText('');
    setIsAiUsedForReply(false);
  };

  return (
    <div className="agent-layout" style={{ height: '100%' }}>
      {/* QUEUE SIDEBAR */}
      <div className="queue-column glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
        {/* Department Switcher */}
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FolderOpen size={14} color="var(--primary)" />
            Active Queue Department
          </label>
          <select 
            className="form-select"
            value={agentDepartment}
            onChange={(e) => setAgentDepartment(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="IT">IT Support</option>
            <option value="HR">HR People Ops</option>
            <option value="Finance">Finance & Expense</option>
            <option value="Admin">Admin & Facilities</option>
          </select>
        </div>

        {/* Status Filters */}
        <div style={{ marginBottom: '14px' }}>
          <div className="form-label" style={{ fontSize: '12px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={12} />
            Filter Queue
          </div>
          <div className="queue-filter-bar">
            {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(status => {
              const count = departmentTickets.filter(t => status === 'All' ? true : t.status === status).length;
              return (
                <div 
                  key={status}
                  className={`queue-pill ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status} ({count})
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticket List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredTickets.map(t => (
            <div 
              key={t.id}
              className={`ticket-item ${selectedTicketId === t.id ? 'active' : ''}`}
              onClick={() => setSelectedTicketId(t.id)}
              style={{ borderRadius: 'var(--border-radius-sm)', marginBottom: '4px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <strong style={{ color: 'var(--text-muted)' }}>{t.id}</strong>
                <span className={`badge-status ${t.status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                  {t.status}
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.title}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span className={`badge-urgency ${t.urgency.toLowerCase()}`}>
                  {t.urgency}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {filteredTickets.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No tickets in queue
            </div>
          )}
        </div>
      </div>

      {/* DETAIL WORKSPACE */}
      <div className="glass-card ticket-detail-view" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)',
    overflow: 'hidden' }}>
        {selectedTicket ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Header: Ticket details & Actions */}
            <div style={{ borderBottom: '1px solid var(--bg-card-border)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
                    {selectedTicket.id}
                  </span>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-highlight)' }}>
                    {selectedTicket.title}
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    className="form-select"
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{ height: '36px', padding: '6px 12px', fontSize: '13px' }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Meta Tags */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <User size={13} />
                  Requester: <strong style={{ color: 'var(--text-main)' }}>{selectedTicket.requester}</strong>
                </span>
                <span style={{ height: '12px', width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></span>
                <span className={`badge-urgency ${selectedTicket.urgency.toLowerCase()}`}>
                  {selectedTicket.urgency}
                </span>
                <span style={{ height: '12px', width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Content Body (Split layout: Left = description & comments, Right = AI Co-pilot) */}
            <div style={{ display: 'flex',  height: '450px', overflow: 'hidden', gap: '20px' }}>
              
              {/* Left Column: Description & Comments */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', paddingRight: '8px' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                  <strong style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    TICKET DESCRIPTION:
                  </strong>
                  <p style={{ fontSize: '14px', color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
                    {selectedTicket.description}
                  </p>
                </div>

                {/* Timeline */}
                <div style={{ flex: 2 }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Conversation timeline
                  </h4>
                  
                  {selectedTicket.comments && selectedTicket.comments.map(c => (
                    <div 
                      key={c.id} 
                      className={`comment-bubble ${c.author.includes('Agent') || c.author.includes('AI') ? 'system' : ''}`}
                      style={{ maxWidth: '90%' }}
                    >
                      <div className="comment-author">
                        {c.author} • {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                        {c.text}
                      </div>
                    </div>
                  ))}
                  
                  {(!selectedTicket.comments || selectedTicket.comments.length === 0) && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '13px' }}>
                      <MessageSquare size={20} style={{ marginBottom: '6px', opacity: 0.5 }} />
                      No messages exchanged yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: AI Co-pilot Console */}
              <div style={{ width: '320px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '20px' }}>
                <div className="ai-agent-draft" style={{ margin: 0, display: 'flex', flexDirection: 'column', height: '380px', overflow: 'hidden' }}>
                  <div className="ai-glow-heading" style={{ marginBottom: '12px' }}>
                    <Sparkles size={16} />
                    AI Copilot Draft
                  </div>
                  
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Auto-generated response based on ticket description and knowledge base:
                  </div>

                  <div className="ai-draft-body" style={{ maxHeight: '180px', overflowY: 'auto',marginBottom: '12px' }}>
                    {draftAIResponse(selectedTicket)}
                  </div>

                  <button 
                    className="btn btn-primary"
                    onClick={handleApplyDraft}
                    style={{ width: '100%', gap: '6px', fontSize: '13px', padding: '10px' }}
                  >
                    <Sparkles size={14} />
                    Apply Draft to Editor
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Reply Box */}
            <div style={{ borderTop: '1px solid var(--bg-card-border)', paddingTop: '16px', marginTop: '16px' }}>
              <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <textarea 
                    className="form-textarea"
                    placeholder="Type your response to the employee... (Use AI Draft on the right to auto-fill)"
                    value={replyText}
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      if (isAiUsedForReply) setIsAiUsedForReply(false);
                    }}
                    style={{ minHeight: '60px', height: '60px', width: '100%', margin: 0 }}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: '44px', padding: '0 20px' }}>
                  <Send size={16} />
                  Send
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            <FolderOpen size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
            <h3>Select a Ticket</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Choose a support ticket from the active queue to start working.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
