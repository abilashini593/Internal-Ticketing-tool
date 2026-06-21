import React from 'react';
import { useTickets } from '../context/TicketContext';
import { 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  HelpCircle, 
  CheckCircle,
  Clock,
  Layers,
  Activity
} from 'lucide-react';

export default function AnalyticsInsights() {
  const { tickets, aiMetrics } = useTickets();

  // General ticket metrics
  const totalRaisedTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'Open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

  // Department counts
  const depts = ['IT', 'HR', 'Finance', 'Admin'];
  const deptCounts = depts.reduce((acc, dept) => {
    acc[dept] = tickets.filter(t => t.category === dept).length;
    return acc;
  }, {});

  // Urgency counts
  const urgencies = ['Low', 'Medium', 'High', 'Urgent'];
  const urgencyCounts = urgencies.reduce((acc, urg) => {
    acc[urg] = tickets.filter(t => t.urgency === urg).length;
    return acc;
  }, {});

  // AI Co-pilot calculation
  const deflectionCount = aiMetrics.deflections;
  const totalAIInteractions = totalRaisedTickets + deflectionCount;
  const deflectionRate = totalAIInteractions > 0 
    ? Math.round((deflectionCount / totalAIInteractions) * 100) 
    : 0;

  const classificationAccuracy = aiMetrics.aiAccuracyTotal > 0
    ? Math.round((aiMetrics.aiAccuracyCorrect / aiMetrics.aiAccuracyTotal) * 100)
    : 0;

  // Max value for scaling charts
  const maxDeptCount = Math.max(...Object.values(deptCounts), 1);
  const maxUrgencyCount = Math.max(...Object.values(urgencyCounts), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingRight: '8px' }}>
      
      {/* 1. TOP METRICS ROW: AI Co-pilot Performance */}
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--primary)" />
          AI Co-Pilot Efficiency Metrics
        </h3>
        <div className="grid-3">
          {/* KPI 1: Deflection Rate */}
          <div className="glass-card kpi-card">
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={14} color="var(--primary)" />
              Self-Service Deflections
            </span>
            <div className="kpi-value">{deflectionCount}</div>
            <div className="kpi-trend positive">
              <TrendingUp size={12} />
              {deflectionRate}% Deflection Rate
            </div>
          </div>

          {/* KPI 2: AI Routing Accuracy */}
          <div className="glass-card kpi-card">
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="var(--primary)" />
              Auto-routing Accuracy
            </span>
            <div className="kpi-value">{classificationAccuracy}%</div>
            <div className="kpi-trend positive">
              <CheckCircle size={12} />
              {aiMetrics.aiAccuracyCorrect} of {aiMetrics.aiAccuracyTotal} correct
            </div>
          </div>

          {/* KPI 3: Co-pilot Draft Adoption */}
          <div className="glass-card kpi-card">
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--primary)" />
              AI Draft Responses Applied
            </span>
            <div className="kpi-value">{aiMetrics.draftAppliedCount}</div>
            <div className="kpi-trend neutral" style={{ color: 'var(--text-muted)' }}>
              Applied by support agents
            </div>
          </div>
        </div>
      </div>

      {/* 2. GENERAL QUEUE OVERVIEW ROW */}
      <div className="grid-2">
        {/* KPI: Queue Summary Card */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} />
            Support Queue Summary
          </h4>
          <div className="grid-3" style={{ gap: '12px' }}>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>OPEN</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--status-open-text)', margin: '4px 0' }}>{openTickets}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>IN PROGRESS</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--status-progress-text)', margin: '4px 0' }}>{inProgressTickets}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>RESOLVED</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--status-resolved-text)', margin: '4px 0' }}>{resolvedTickets}</div>
            </div>
          </div>
          <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
            Total Tickets Raised: <strong style={{ color: 'var(--text-main)' }}>{totalRaisedTickets}</strong>
          </div>
        </div>

        {/* Chart: Ticket Volume by Urgency */}
        <div className="glass-card chart-container">
          <div className="chart-header" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} />
            Queue Distribution by Urgency
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
            {urgencies.map(urg => {
              const count = urgencyCounts[urg] || 0;
              const pct = maxUrgencyCount > 0 ? (count / maxUrgencyCount) * 100 : 0;
              return (
                <div key={urg} className="chart-bar-row">
                  <span className="chart-bar-label">{urg}</span>
                  <div className="chart-bar-bg">
                    <div 
                      className="chart-bar-fill" 
                      style={{ 
                        width: `${pct}%`,
                        background: urg === 'Urgent' || urg === 'High' 
                          ? 'linear-gradient(90deg, #fb923c, #f87171)' 
                          : 'linear-gradient(90deg, var(--primary), #3b82f6)'
                      }}
                    ></div>
                  </div>
                  <span className="chart-bar-val">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. CHARTS ROW: Tickets by Department */}
      <div className="glass-card chart-container" style={{ height: 'auto', padding: '24px' }}>
        <div className="chart-header" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
          <Layers size={14} />
          Incoming Ticket Volume by Department
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {depts.map(dept => {
            const count = deptCounts[dept] || 0;
            const pct = maxDeptCount > 0 ? (count / maxDeptCount) * 100 : 0;
            return (
              <div key={dept} className="chart-bar-row">
                <span className="chart-bar-label" style={{ width: '120px' }}>
                  {dept === 'IT' && 'IT Support'}
                  {dept === 'HR' && 'HR People Ops'}
                  {dept === 'Finance' && 'Finance & Exp'}
                  {dept === 'Admin' && 'Admin & Facility'}
                </span>
                <div className="chart-bar-bg" style={{ height: '16px' }}>
                  <div 
                    className="chart-bar-fill" 
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <span className="chart-bar-val" style={{ fontSize: '13px' }}>{count} tickets</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
