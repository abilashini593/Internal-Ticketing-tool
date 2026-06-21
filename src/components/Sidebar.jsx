import React from 'react';
import { useTickets } from '../context/TicketContext';
import { User, ShieldAlert, BarChart3, RefreshCw, Radio } from 'lucide-react';

export default function Sidebar() {
  const { 
    tickets, 
    notifications, 
    activeTab, 
    setActiveTab, 
    resetDemo 
  } = useTickets();

  // Count open/in-progress tickets for agent queue badge
  const activeTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;

  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">
          <ShieldAlert size={20} color="#090d16" strokeWidth={2.5} />
        </div>
        <div>
          <span className="logo-text">NudgeSupport</span>
          <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '600', marginTop: '-2px' }}>
            AI TICKETING CO-PILOT
          </div>
        </div>
      </div>

      <div className="nav-links">
        <div 
          className={`nav-item ${activeTab === 'employee' ? 'active' : ''}`}
          onClick={() => setActiveTab('employee')}
        >
          <User size={18} />
          <span>Employee Portal</span>
        </div>

        <div 
          className={`nav-item ${activeTab === 'agent' ? 'active' : ''}`}
          onClick={() => setActiveTab('agent')}
        >
          <ShieldAlert size={18} />
          <span style={{ flex: 1 }}>Agent Dashboard</span>
          {activeTicketsCount > 0 && (
            <span style={{ 
              fontSize: '11px', 
              backgroundColor: 'rgba(239, 68, 68, 0.15)', 
              color: '#f87171', 
              padding: '2px 8px', 
              borderRadius: '9999px',
              fontWeight: '700',
              border: '1px solid rgba(239, 68, 68, 0.25)'
            }}>
              {activeTicketsCount}
            </span>
          )}
        </div>

        <div 
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={18} />
          <span>Analytics & Insights</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="badge-live">
          <div className="badge-live-dot"></div>
          <span style={{ letterSpacing: '0.5px' }}>LIVE STATUS MONITOR</span>
        </div>
        
        <div className="notification-history-pane">
          {notifications.slice(0, 3).map((n) => {
            const timeStr = new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={n.id} className={`notification-row ${n.type}`}>
                <div style={{ flex: 1, wordBreak: 'break-word', lineHeight: '1.3' }}>
                  <strong style={{ color: 'var(--text-main)' }}>[{timeStr}]</strong> {n.text}
                </div>
              </div>
            );
          })}
          {notifications.length === 0 && (
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>
              No recent notifications
            </div>
          )}
        </div>

        <button 
          className="btn btn-secondary btn-danger" 
          onClick={resetDemo}
          style={{ width: '100%', padding: '8px 12px', fontSize: '12px', gap: '6px', marginTop: '8px' }}
        >
          <RefreshCw size={12} />
          Reset Mock Database
        </button>
      </div>
    </div>
  );
}
