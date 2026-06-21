// Local Natural Language Processing Engine for Internal Ticketing Tool

export const RESOLVED_KNOWLEDGE_BASE = [
  {
    id: 'kb-1',
    title: 'VPN Connection Failed - Error 809',
    description: 'Cannot connect to company VPN from home. Getting error 809 security settings mismatch.',
    category: 'IT',
    urgency: 'High',
    resolution: 'Go to VPN settings, select Cisco IPsec or L2TP/IPsec, and input the pre-shared key "NUDGE2026". Check your home router firewall if port 500 UDP is blocked.',
  },
  {
    id: 'kb-2',
    title: 'How to download salary slip / Form 16',
    description: 'Where do I find my monthly payslip and yearly tax Form 16 for verification?',
    category: 'Finance',
    urgency: 'Low',
    resolution: 'Log into the Finance Portal (finance.nudge.org). Navigate to "My Payroll" -> "Tax Documents" to download Form 16, or "Payslips" for monthly slips.',
  },
  {
    id: 'kb-3',
    title: 'Request for Laptop Upgrade',
    description: 'My laptop is running very slow and has 8GB RAM. I need an upgrade for development/data work.',
    category: 'IT',
    urgency: 'Medium',
    resolution: 'Raise an hardware upgrade request in IT Asset system. Make sure you get manager approval first. Standard developer upgrade is 16GB/512GB ThinkPad.',
  },
  {
    id: 'kb-4',
    title: 'Maternity/Paternity Leave Policy details',
    description: 'What is the parental leave policy for employees? How many days are paid leaves?',
    category: 'HR',
    urgency: 'Low',
    resolution: 'The Nudge Institute offers 26 weeks of paid maternity leave and 4 weeks of paid paternity leave. Submit your application in HRMS at least 30 days in advance.',
  },
  {
    id: 'kb-5',
    title: 'WiFi is not working in Bengaluru Office',
    description: 'Cannot connect to Nudge-Staff WiFi network in Bengaluru office branch.',
    category: 'IT',
    urgency: 'High',
    resolution: 'Forget the "Nudge-Staff" network, restart your WiFi adapter, and reconnect using your official nudge.org email login credentials. Do not use Guest network.',
  },
  {
    id: 'kb-6',
    title: 'Reimbursement Claim Rejected',
    description: 'My travel reimbursement expense claim was rejected. How do I correct and resubmit?',
    category: 'Finance',
    urgency: 'Medium',
    resolution: 'Claims are rejected if receipts are missing or illegible. Go to Claims Portal, open the rejected claim, upload clear receipts showing GST details, and click Resubmit.',
  },
  {
    id: 'kb-7',
    title: 'Medical Insurance Policy Enrollment',
    description: 'How do I add my dependents (spouse/parents) to the corporate health insurance plan?',
    category: 'HR',
    urgency: 'Medium',
    resolution: 'Dependent enrollment happens during annual renewal (April) or within 30 days of a life event (marriage, childbirth). Send details to insurance-team@nudge.org.',
  },
  {
    id: 'kb-8',
    title: 'Office Access Card Blocked',
    description: 'My entry ID card is not working at the main door reader. It flashes red.',
    category: 'Admin',
    urgency: 'Medium',
    resolution: 'ID cards are suspended after 14 days of inactivity. Visit the Admin Desk at Ground Floor to reactivate your ID badge. Bring secondary ID.',
  },
  {
    id: 'kb-9',
    title: 'Conference Room Projector Broken',
    description: 'The display projector in Conference Room Alpha is not turning on or showing blue screen.',
    category: 'Admin',
    urgency: 'Medium',
    resolution: 'The projector lamp has reached end-of-life. The Admin team has placed a temporary TV screen on the table. Projector replacement is scheduled for next Tuesday.',
  }
];

// Stop words to filter out before analysis
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
  'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its', 'itself', 'more', 'most', 'mustnt',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'shant', 'she', 'should', 'shouldnt', 'so', 'some', 'such', 'than',
  'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'were', 'werent', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'wont', 'would', 'wouldnt', 'you', 'your', 'yours',
  'yourself', 'yourselves', 'please', 'need', 'want', 'help', 'get', 'having', 'working', 'not'
]);

// Helper to tokenize and clean text
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

// Category keyword mappings for classification
const CATEGORY_KEYWORDS = {
  IT: ['vpn', 'laptop', 'wifi', 'internet', 'monitor', 'keyboard', 'password', 'software', 'install', 'slow', 'hardware', 'macbook', 'login', 'email', 'outlook', 'access', 'reset', 'mouse', 'screen', 'zoom', 'teams', 'network', 'router', 'cisco', 'pc', 'computer'],
  HR: ['leave', 'policy', 'holiday', 'maternity', 'paternity', 'insurance', 'medical', 'hospital', 'recruitment', 'offer', 'onboarding', 'probation', 'appraisal', 'performance', 'exit', 'resign', 'referral', 'benefits', 'workday', 'nudge', 'parental', 'health', 'hr', 'casual', 'sick'],
  Finance: ['salary', 'payslip', 'tax', 'reimbursement', 'invoice', 'expense', 'payment', 'claim', 'tds', 'form 16', 'bank', 'account', 'pf', 'provident', 'bonus', 'payroll', 'finance', 'bill', 'receipt', 'travel', 'allowance', 'money', 'payout'],
  Admin: ['card', 'badge', 'access', 'desk', 'chair', 'office', 'canteen', 'projector', 'ac', 'cooling', 'cleaning', 'cafeteria', 'parking', 'key', 'door', 'building', 'maintenance', 'courier', 'stationery', 'seat', 'fan', 'light', 'meeting', 'water']
};

/**
 * Predict Category of a ticket based on title and description
 * Returns sorted categories with confidence scores
 */
export function classifyTicket(title, description) {
  const words = tokenize(`${title} ${description}`);
  if (words.length === 0) {
    return {
      category: 'IT', // Default fallback
      confidences: { IT: 0.25, HR: 0.25, Finance: 0.25, Admin: 0.25 },
      isLowConfidence: true
    };
  }

  const scores = { IT: 0, HR: 0, Finance: 0, Admin: 0 };
  
  // Count keyword match frequency, applying TF-IDF weights conceptually
  words.forEach(word => {
    Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
      if (keywords.includes(word)) {
        // High-value keywords get more weights
        scores[category] += 1;
      }
    });
  });

  const sum = Object.values(scores).reduce((a, b) => a + b, 0);
  
  if (sum === 0) {
    return {
      category: 'IT',
      confidences: { IT: 0.25, HR: 0.25, Finance: 0.25, Admin: 0.25 },
      isLowConfidence: true
    };
  }

  // Calculate percentage confidence
  const confidences = {};
  Object.keys(scores).forEach(cat => {
    confidences[cat] = Math.round((scores[cat] / sum) * 100) / 100;
  });

  // Sort categories by score descending
  const sorted = Object.entries(confidences).sort((a, b) => b[1] - a[1]);
  const bestCategory = sorted[0][0];
  const maxConfidence = sorted[0][1];

  return {
    category: bestCategory,
    confidences,
    isLowConfidence: maxConfidence < 0.4
  };
}

/**
 * Computes Jaccard Similarity between two token sets
 */
function jaccardSimilarity(setA, setB) {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Finds similar resolved tickets in the Knowledge Base
 * Returns array of matches with similarity scores
 */
export function findSimilarTickets(title, description) {
  if (!title && !description) return [];
  
  const queryTitleWords = new Set(tokenize(title));
  const queryDescWords = new Set(tokenize(description));
  const queryCombined = new Set([...queryTitleWords, ...queryDescWords]);

  const matches = RESOLVED_KNOWLEDGE_BASE.map(kb => {
    const kbTitleWords = new Set(tokenize(kb.title));
    const kbDescWords = new Set(tokenize(kb.description));
    const kbCombined = new Set([...kbTitleWords, ...kbDescWords]);

    // Title match has double weights
    const titleSim = jaccardSimilarity(queryTitleWords, kbTitleWords);
    const descSim = jaccardSimilarity(queryDescWords, kbDescWords);
    const overallSim = jaccardSimilarity(queryCombined, kbCombined);

    const similarity = (titleSim * 0.5) + (descSim * 0.2) + (overallSim * 0.3);

    return {
      ...kb,
      similarity: Math.round(similarity * 100) / 100
    };
  });

  // Filter out poor matches and sort by similarity descending
  return matches
    .filter(m => m.similarity >= 0.25)
    .sort((a, b) => b.similarity - a.similarity);
}

/**
 * Drafts an AI response template for an agent
 */
export function draftAIResponse(ticket) {
  const category = ticket.category;
  const title = ticket.title.toLowerCase();
  const desc = ticket.description.toLowerCase();
  const requester = ticket.requester || 'Employee';

  let draft = `Hi ${requester},\n\n`;

  if (category === 'IT') {
    if (title.includes('vpn') || desc.includes('vpn')) {
      draft += `Thank you for reaching out regarding your VPN connection issues. I understand this is blocking your work.

To resolve VPN Error 809 or general failures, please try the following steps:
1. Ensure your home internet router firewall is not blocking UDP ports 500 and 4500.
2. In your connection settings, verify that the type of VPN is set to L2TP/IPsec or Cisco IPsec.
3. Use the corporate pre-shared security key: "NUDGE2026".

If you continue to face issues, please reply here with a screenshot of your configuration, and we can schedule a quick screen-share session.`;
    } else if (title.includes('wifi') || desc.includes('wifi')) {
      draft += `Thanks for reporting the WiFi issue. 

Please note that for security compliance, our "Nudge-Staff" network requires authentication with your active @nudge.org credentials rather than a shared passcode. Please:
1. Go to WiFi Settings and select "Forget Network" for "Nudge-Staff".
2. Turn your device's WiFi off and back on.
3. Connect again and log in using your Google Workspace username (without @nudge.org) and your password.

If you are a guest, please connect to "Nudge-Guest" and complete the portal login.`;
    } else if (title.includes('slow') || title.includes('upgrade') || desc.includes('laptop') || desc.includes('ram')) {
      draft += `Thank you for requesting a laptop review. 

Slow laptops can indeed hinder productivity. To initiate a hardware upgrade:
1. Please run a quick diagnostics check (Activity Monitor on macOS or Task Manager on Windows) and upload a screenshot showing your CPU/Memory usage.
2. We require email approval from your manager confirming the operational need for a higher spec machine (e.g., 16GB RAM upgrade).
3. Once you submit the approval under this ticket, our IT Asset team will schedule a slot for device handover at the IT desk.`;
    } else {
      draft += `Thank you for raising this IT support ticket. 

We have logged your issue concerning "${ticket.title}". An IT support representative has been assigned and is reviewing the details. We generally resolve standard IT requests within 2-4 hours. 

If this is an emergency blocking critical operations, please ping us directly on Slack #it-support.`;
    }
  } else if (category === 'HR') {
    if (title.includes('leave') || desc.includes('leave') || desc.includes('holiday') || title.includes('parental')) {
      draft += `Thank you for writing to HR. 

Regarding your query on leaves:
- Our standard maternity leave policy provides 26 weeks of paid leave.
- Paternity leave offers 4 weeks of paid leave.
- Casual and sick leaves are credited at the start of every quarter.

Please log into the HRMS Portal to apply for leaves and view your current balance. Remember to submit leave applications at least 30 days in advance for long leaves to allow proper handovers.`;
    } else if (title.includes('insurance') || desc.includes('medical') || desc.includes('hospital')) {
      draft += `Thank you for contacting the HR Operations team.

Our corporate group medical insurance policy covers employees, spouses, and up to two children automatically. To add parents or parents-in-law:
1. Enrollment window is open during annual policy renewal in April.
2. Mid-term additions are permitted only for life events (marriage, birth) within 30 days of the event.
3. Please send a copy of the marriage/birth certificate to benefits@nudge.org.

You can download your E-card from the MediBuddy portal using your Employee ID.`;
    } else {
      draft += `Thank you for reaching out to HR Support. 

We have received your query about "${ticket.title}". The HR Ops team will review this and respond within 24 business hours. If you need policy documents immediately, they are available in the Shared Drive -> HR Policies folder.`;
    }
  } else if (category === 'Finance') {
    if (title.includes('payslip') || title.includes('salary') || desc.includes('payslip') || title.includes('form 16') || desc.includes('tax')) {
      draft += `Hi ${requester},\n\nThank you for reaching out to the Finance Desk.

For security and privacy, payslips and Form 16 tax summaries are distributed directly through our secure self-service portal:
1. Please navigate to: https://finance.nudge.org
2. Log in using your Google Single Sign-On (SSO).
3. Go to "My Payroll" -> "Tax Forms" (for Form 16) or "Payslips" (for monthly summaries).

Note that Form 16 for the latest financial year is uploaded by June 15th annually. If you find any discrepancy in your PAN details, please let us know.`;
    } else if (title.includes('reimburse') || title.includes('claim') || desc.includes('expense') || desc.includes('receipt')) {
      draft += `Thank you for your inquiry about reimbursement claims.

To ensure fast processing of travel, mobile, or client expense claims:
1. Ensure all uploaded receipts show the vendor's GSTIN and are itemized.
2. Ensure you have selected the correct cost center and expense head in the Claims Portal.
3. If your claim was rejected, the reason is typically listed in the remarks (e.g., "missing receipts"). You can edit the rejected claim directly in the portal and click 'Resubmit'.

Finance claims are processed on the 10th and 25th of every month.`;
    } else {
      draft += `Thank you for contacting the Finance Department.

We have received your ticket regarding "${ticket.title}" and routed it to our accounts team. We aim to respond to all finance and payroll inquiries within 1 business day.`;
    }
  } else if (category === 'Admin') {
    if (title.includes('card') || title.includes('badge') || desc.includes('access') || desc.includes('gate')) {
      draft += `Thank you for notifying the Admin desk.

Access badges are automatically disabled for security if they are not scanned at any office scanner for 14 consecutive days.
To reactivate your card:
1. Please drop by the Admin/Facilities desk on the Ground Floor.
2. Bring a government-issued photo ID (Aadhaar or Driving License) for identity verification.
3. It takes approximately 5 minutes to reactivate the RFID badge.

If your card is physically damaged or lost, a replacement card can be issued for a nominal fee of ₹200.`;
    } else if (title.includes('projector') || title.includes('room') || title.includes('broken') || desc.includes('ac')) {
      draft += `Thank you for alerting us about the facility maintenance request.

Our Admin team works to keep the office running smoothly. We have logged a ticket with our facilities team to inspect the issue: "${ticket.title}".
A technician will visit the location within the hour. 

If this is a meeting room emergency, please call Extension 404 from any desk phone.`;
    } else {
      draft += `Thank you for contacting the Facilities and Admin Desk.

We have received your service request for "${ticket.title}". Our facilities supervisor will update this ticket once the task is scheduled. We aim to address physical workspace tickets within 4 hours.`;
    }
  }

  draft += `\n\nBest regards,\nInternal Support Assistant (AI Powered)`;
  return draft;
}
