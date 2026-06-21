import React, { useEffect, useState } from 'react';
import { TicketProvider, useTickets } from './context/TicketContext';
import Sidebar from './components/Sidebar';
import EmployeePortal from './components/EmployeePortal';
import AgentDashboard from './components/AgentDashboard';
import AnalyticsInsights from './components/AnalyticsInsights';
import { Sparkles, Bell, User } from 'lucide-react';

function DashboardContent() {
  const { activeTab, notifications, agentDepartment } = useTickets();
  const [toast, setToast] = useState(null);

  // Trigger temporary toasts when new notifications arrive
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      setToast(latest);
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Determine title based on tab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'employee':
        return 'Employee Support Portal';
      case 'agent':
        return `Agent Dashboard (${agentDepartment} Queue)`;
      case 'analytics':
        return 'Analytics & AI Insights';
      default:
        return 'Nudge Support';
    }
  };

  // Determine user profile role badge
  const getUserProfile = () => {
    if (activeTab === 'employee') {
      return { name: 'Rahul Sharma', role: 'Employee', initial: 'RS' };
    }
    return { name: 'Sarah Jenkins', role: `Support Agent (${agentDepartment})`, initial: 'SJ' };
  };

  const user = getUserProfile();

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Content */}
      <div className="main-content">
        {/* Top Header Bar */}
        <header className="top-bar">
          <h1 className="page-title">{getPageTitle()}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="user-profile">
              <div className="user-avatar">{user.initial}</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.2' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '600' }}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Tab View */}
        <main className="content-pane">
          {activeTab === 'employee' && <EmployeePortal />}
          {activeTab === 'agent' && <AgentDashboard />}
          {activeTab === 'analytics' && <AnalyticsInsights />}
        </main>
      </div>

      {/* Interactive Toast Notifications */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type || 'info'}`}>
            <Bell size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-highlight)' }}>
                Notification
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {toast.text}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <TicketProvider>
      <DashboardContent />
    </TicketProvider>
  );
}

export default App;
