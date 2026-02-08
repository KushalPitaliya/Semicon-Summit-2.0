# Semiconductor Summit 2.0

A professional event website for Semiconductor Summit 2.0 with Google Form-based registration, role-based dashboards, and email automation.

## 🚀 Features

- **Landing Page**: Premium dark-themed design with hero section, events showcase, and registration CTA
- **Google Form Registration**: External registration via Google Form with payment proof upload
- **Email Automation**: Auto-generated credentials and confirmation emails via Apps Script
- **Role-Based Dashboards**:
  - **Participant**: View profile, registered events, announcements, and gallery
  - **Coordinator**: Upload photos, documents, and manage announcements
  - **Faculty**: View all registrations with filtering and Excel export

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Vanilla CSS with custom design system
- **Backend**: Express.js (lightweight)
- **Database**: Google Sheets (via Apps Script)
- **Email**: Google Apps Script automation

## 📁 Project Structure

```
Semicon_summit2.0/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── index.css        # Design system
├── server/              # Express backend
├── docs/apps-script/    # Google Apps Script code
└── public/              # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google account (for Forms & Sheets)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start server
npm run dev
```

### Google Apps Script Setup

1. Create a Google Form with required fields (see docs)
2. Link form to a Google Sheet
3. Open Extensions > Apps Script
4. Copy code from `docs/apps-script/Code.gs`
5. Update CONFIG section with your details
6. Run `createTrigger()` function once
7. Deploy as Web App for API access

## 🔐 Demo Login

| Role | Email | Password |
|------|-------|----------|
| Participant | participant@demo.com | demo123 |
| Coordinator | coordinator@demo.com | demo123 |
| Faculty | faculty@demo.com | demo123 |

## 📧 Registration Flow

1. User clicks "Register Now" → Google Form
2. User fills details + uploads payment proof
3. Apps Script generates credentials
4. User receives:
   - Email 1: Login credentials
   - Email 2: Registration confirmation
5. User logs in to access dashboard

## 🎨 Customization

Update these files to customize:

- `src/pages/Landing.jsx` - Event details, dates, venue
- `src/index.css` - Colors and design tokens
- `docs/apps-script/Code.gs` - Email templates and config

## 📝 License

MIT License - Feel free to use for your events!
