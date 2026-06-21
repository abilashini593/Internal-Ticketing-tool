import React, { createContext, useState, useEffect, useContext } from 'react';
import { classifyTicket, findSimilarTickets } from '../utils/aiEngine';

const TicketContext = createContext();

// Seed data to make the dashboard feel alive immediately
const SEED_TICKETS = [
  {
    id: 'TKT-1001',
    title: 'Monitor flickering and showing green lines',
    description: 'My secondary Dell monitor has started flickering today and displays horizontal green lines. IT desk, please assist.',
    category: 'IT',
    urgency: 'Medium',
    status: 'Open',
    requester: 'Rahul Sharma',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
    comments: [],
    aiConfidence: 0.95,
    aiAutoSelected: true,
  },
  {
    id: 'TKT-1002',
    title: 'Error in Pf account linking on portal',
    description: 'My UAN number is correct but PF contribution details are not updating on the official EPFO integration. HR portal throws a server error.',
    category: 'HR',
    urgency: 'Medium',
    status: 'In Progress',
    requester: 'Priya Nair',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
    comments: [
      {
        id: 'c1',
        author: 'Sarah HR (Agent)',
        text: 'Hi Priya, I have forwarded your UAN details to our PF trust team. We are checking if there is a mismatch in your Aadhaar spelling.',
        createdAt: new Date(Date.now() - 18 * 3600000).toISOString()
      }
    ],
    aiConfidence: 0.88,
    aiAutoSelected: true,
  },
  {
    id: 'TKT-1003',
    title: 'Stuck reimbursement claim for client lunch',
    description: 'Raised mobile bill and client lunch expense claim (#EXP-403) last week. It has been approved by manager but payment is still pending.',
    category: 'Finance',
    urgency: 'Low',
    status: 'Open',
    requester: 'Amit Patel',
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 hours ago
    comments: [],
    aiConfidence: 0.92,
    aiAutoSelected: true,
  },
  {
    id: 'TKT-1004',
    title: 'Access card deactivated for Bengaluru Office',
    description: 'I was working remotely for 3 weeks. Today my ID badge does not unlock the main reception gate or glass doors. Please activate.',
    category: 'Admin',
    urgency: 'High',
    status: 'Open',
    requester: 'Vikram Singh',
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(), // 1 hour ago
    comments: [],
    aiConfidence: 0.91,
    aiAutoSelected: true,
  },
  {
    id: 'TKT-1005',
    title: 'Office desk drawer lock is stuck',
    description: 'The lock of my drawer at Desk 104 is jammed. My notepad and charger are locked inside.',
    category: 'Admin',
    urgency: 'Medium',
    status: 'In Progress',
    requester: 'Anjali Gupta',
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
    comments: [
      {
        id: 'c2',
        author: 'Ramesh Admin (Agent)',
        text: 'Hi Anjali, the locksmith is on-site today. He will stop by Desk 104 in the afternoon to drill or unlock the drawer.',
        createdAt: new Date(Date.now() - 10 * 3600000).toISOString()
      }
    ],
    aiConfidence: 0.85,
    aiAutoSelected: true,
  },
  // Some Resolved Tickets
  {
    id: 'TKT-1006',
    title: 'Git push blocked due to ssh key issue',
    description: 'Getting Permission Denied (publickey) error when pulling or pushing to corporate github repository.',
    category: 'IT',
    urgency: 'High',
    status: 'Resolved',
    requester: 'Neha Sen',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    resolvedAt: new Date(Date.now() - 46 * 3600000).toISOString(),
    comments: [
      {
        id: 'c3',
        author: 'System AI',
        text: 'Draft auto-applied: Please verify if your SSH public key is added to Github under Settings -> SSH Keys and matches your active corporate key.',
        createdAt: new Date(Date.now() - 47.9 * 3600000).toISOString()
      },
      {
        id: 'c4',
        author: 'Neha Sen',
        text: 'Yes! Re-adding the key resolved my git connection. Thanks!',
        createdAt: new Date(Date.now() - 46 * 3600000).toISOString()
      }
    ],
    aiConfidence: 0.94,
    aiAutoSelected: true,
  },
  {
    id: 'TKT-1007',
    title: 'Clarification regarding medical policy coverage limit',
    description: 'What is the corporate coverage limit for immediate family under health insurance?',
    category: 'HR',
    urgency: 'Medium',
    status: 'Resolved',
    requester: 'Kunal Verma',
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    resolvedAt: new Date(Date.now() - 70 * 3600000).toISOString(),
    comments: [
      {
        id: 'c5',
        author: 'Sarah HR (Agent)',
        text: 'Hi Kunal, the total float coverage is ₹5,00,000 per family unit. Additional top-up option up to ₹10,000,000 can be opted with self-payment.',
        createdAt: new Date(Date.now() - 71 * 3600000).toISOString()
      }
    ],
    aiConfidence: 0.87,
    aiAutoSelected: true,
  }
];

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('nudge_tickets');
    return saved ? JSON.parse(saved) : SEED_TICKETS;
  });

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to Nudge Support Portal!', time: new Date().toISOString(), type: 'system' },
    { id: 2, text: 'Ticket TKT-1004 raised under Admin department.', time: new Date(Date.now() - 3600000).toISOString(), type: 'info' }
  ]);

  const [activeTab, setActiveTab] = useState('employee');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [agentDepartment, setAgentDepartment] = useState('IT');

  // AI Metrics state for Analytics
  const [aiMetrics, setAiMetrics] = useState(() => {
    const saved = localStorage.getItem('nudge_ai_metrics');
    return saved ? JSON.parse(saved) : {
      deflections: 4,      // Tickets resolved by the employee using similar tickets suggestions
      aiAccuracyCorrect: 9, // Times AI auto-categorized correctly (agreed by employee or agent)
      aiAccuracyTotal: 10,  // Total ticket categorization checks
      draftAppliedCount: 3 // Times agent used AI response draft
    };
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('nudge_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('nudge_ai_metrics', JSON.stringify(aiMetrics));
  }, [aiMetrics]);

  // Raise standard ticket
  const raiseTicket = (title, description, category, urgency, requester = 'Rahul Sharma', isAutoSelected = true, aiConf = 1.0) => {
    const newId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: newId,
      title,
      description,
      category,
      urgency,
      status: 'Open',
      requester,
      createdAt: new Date().toISOString(),
      comments: [],
      aiConfidence: aiConf,
      aiAutoSelected: isAutoSelected
    };

    setTickets(prev => [newTicket, ...prev]);

    // Record notification
    addNotification(`New Ticket ${newId} raised successfully in ${category}.`, 'success');

    // Update AI total count if it went through AI classification
    setAiMetrics(prev => ({
      ...prev,
      aiAccuracyTotal: prev.aiAccuracyTotal + 1,
      // If AI category wasn't overridden, count it as correct
      aiAccuracyCorrect: prev.aiAccuracyCorrect + 1
    }));

    return newTicket;
  };

  // Raise ticket with custom category (e.g. employee manually changed it from AI recommendation)
  const raiseTicketManualCategory = (title, description, finalCategory, recommendedCategory, urgency, requester = 'Rahul Sharma', aiConf = 1.0) => {
    const newId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const wasCorrect = finalCategory === recommendedCategory;

    const newTicket = {
      id: newId,
      title,
      description,
      category: finalCategory,
      urgency,
      status: 'Open',
      requester,
      createdAt: new Date().toISOString(),
      comments: [],
      aiConfidence: aiConf,
      aiAutoSelected: wasCorrect
    };

    setTickets(prev => [newTicket, ...prev]);
    addNotification(`New Ticket ${newId} raised under ${finalCategory} department.`, 'success');

    setAiMetrics(prev => ({
      ...prev,
      aiAccuracyTotal: prev.aiAccuracyTotal + 1,
      aiAccuracyCorrect: wasCorrect ? prev.aiAccuracyCorrect + 1 : prev.aiAccuracyCorrect
    }));

    return newTicket;
  };

  // Add notification
  const addNotification = (text, type = 'info') => {
    const newNotification = {
      id: Math.random(),
      text,
      time: new Date().toISOString(),
      type
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 30)); // Cap at 30 items
  };

  // Update Status
  const updateTicketStatus = (ticketId, newStatus, agentComment = null) => {
    setTickets(prev => prev.map(tkt => {
      if (tkt.id === ticketId) {
        const updatedComments = [...tkt.comments];
        if (agentComment) {
          updatedComments.push({
            id: `c-${Math.random()}`,
            author: 'Support Agent',
            text: agentComment,
            createdAt: new Date().toISOString()
          });
        }
        
        const isResolution = newStatus === 'Resolved' && tkt.status !== 'Resolved';
        
        return {
          ...tkt,
          status: newStatus,
          comments: updatedComments,
          resolvedAt: isResolution ? new Date().toISOString() : tkt.resolvedAt
        };
      }
      return tkt;
    }));

    addNotification(`Ticket ${ticketId} status updated to ${newStatus}.`, 'info');
  };

  // Add custom comment
  const addCommentToTicket = (ticketId, author, text, isAiApplied = false) => {
    setTickets(prev => prev.map(tkt => {
      if (tkt.id === ticketId) {
        return {
          ...tkt,
          comments: [
            ...tkt.comments,
            {
              id: `c-${Math.random()}`,
              author,
              text,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return tkt;
    }));

    addNotification(`New comment added to Ticket ${ticketId}.`, 'info');

    if (isAiApplied) {
      setAiMetrics(prev => ({
        ...prev,
        draftAppliedCount: prev.draftAppliedCount + 1
      }));
    }
  };

  // Trigger deflection (Self-service resolution via warning panel)
  const triggerDeflection = () => {
    setAiMetrics(prev => ({
      ...prev,
      deflections: prev.deflections + 1
    }));
    addNotification('Ticket deflected: Employee resolved issue using self-service KB suggestions.', 'success');
  };

  // Reset demo
  const resetDemo = () => {
    setTickets(SEED_TICKETS);
    setAiMetrics({
      deflections: 4,
      aiAccuracyCorrect: 9,
      aiAccuracyTotal: 10,
      draftAppliedCount: 3
    });
    setNotifications([
      { id: 1, text: 'Demo database reset successfully.', time: new Date().toISOString(), type: 'success' }
    ]);
    setSelectedTicketId(null);
  };

  return (
    <TicketContext.Provider value={{
      tickets,
      notifications,
      activeTab,
      setActiveTab,
      selectedTicketId,
      setSelectedTicketId,
      agentDepartment,
      setAgentDepartment,
      aiMetrics,
      raiseTicket,
      raiseTicketManualCategory,
      updateTicketStatus,
      addCommentToTicket,
      triggerDeflection,
      addNotification,
      resetDemo
    }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => useContext(TicketContext);
