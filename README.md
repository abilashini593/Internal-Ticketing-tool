# Internal Ticketing Tool

A web-based AI-powered support management platform that enables employees to raise, track, and manage internal support tickets. The system streamlines issue resolution through automated ticket routing, status tracking, analytics, and AI-assisted ticket categorization.

## Features

* Create and manage support tickets across departments (HR, Finance, Admin, etc.)
* Track ticket lifecycle (Open → In Progress → Resolved → Closed)
* Agent dashboard for ticket assignment and status updates
* AI-powered ticket categorization and routing suggestions
* Similar ticket recommendations to reduce duplicate requests
* AI-generated response suggestions for support agents
* Analytics dashboard with ticket insights and performance metrics

## Tech Stack

* **Frontend:** React, Vite, JavaScript, CSS
* **State Management:** React Context API
* **AI Integration:** Custom AI Engine
* **Build Tools:** npm, Vite

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/abilashini593/Internal-Ticketing-tool.git
cd Internal-Ticketing-tool
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Application

```bash
npm run dev
```

### 4. Open the Application

Visit:

```text
http://localhost:5173
```

## 🚀 Usage Instructions

1. Open the application in your browser.
2. Navigate to the Employee Portal.
3. Create a new support ticket by providing a title, description, category, and priority level.
4. Submit the ticket for processing.
5. Track ticket progress through status updates.
6. Support agents can view assigned tickets from the Agent Dashboard and update ticket statuses.
7. Use AI-assisted suggestions for ticket categorization and response generation.
8. View ticket analytics and performance insights through the Analytics Dashboard.

## Project Structure

```text
src/
├── assets/
├── components/
│   ├── EmployeePortal.jsx
│   ├── AgentDashboard.jsx
│   ├── AnalyticsInsights.jsx
│   └── Sidebar.jsx
├── context/
│   └── TicketContext.jsx
├── utils/
│   └── aiEngine.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Future Enhancements

* User authentication and role-based access control
* Email and push notifications
* File attachment support
* Database integration for persistent ticket storage
* Advanced AI-powered ticket resolution recommendations
* Real-time chat between employees and support agents
