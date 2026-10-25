# DueWise — Smart Academic Task & Deadline Manager
> **College Minor Project | B.Tech Engineering Project Presentation**  
> An intelligent cross-platform solution designed to streamline academic submissions, eradicate late deadlines, and elevate student productivity with Google Stitch design system integration.

<p align="center">
  <img src="frontend/public/logo.svg" alt="DueWise Logo" width="120" />
</p>

---

## 📌 1. Project Overview & Problem Statement

College and university students routinely manage diverse academic deliverables across multiple subjects simultaneously—ranging from lab records, technical reports, homework sets, daily practice problems (DPPs), to mini-projects. Traditional methods, such as handwritten diaries, notebooks, and static calendar entries, suffer from:
- **Memory Reliance:** Forgetting deadlines due to cognitive overload.
- **Fragmented Systems:** Lack of centralized, automated alerts before deadlines.
- **Organizational Chaos:** Multi-subject friction without academic categorization.
- **Zero Tracking Analytics:** Inability to differentiate completed vs. pending tasks at a glance.

**DueWise** acts as an **automated digital secretary** that bridges these gaps through **Proactive Reminders**, **Subject Categorization**, and **Dual-Tracking Analytics**.

---

## 🛠️ 2. Technology Stack

### Frontend
- **Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Glassmorphic Modern Dark Theme (`#0b0f19`)
- **Icons & UI:** Lucide React, accessible custom dialogs, Sonner toast notifications
- **Routing:** React Router v6
- **Server State & Validation:** TanStack Query, React Hook Form, Zod
- **Data Visualization:** Recharts (Timeline velocity, Donut course workload, Horizontal bar types)
- **Interactive Calendar:** Monthly and weekly responsive academic calendar with color-coded course deadlines
- **Delight Effects:** Canvas Confetti & Web Audio API synthesized alert chimes

### Backend
- **Runtime & Framework:** Node.js, Express.js, TypeScript
- **Architecture:** RESTful API with modular routes, middleware, and services
- **ORM & Database:** Prisma ORM, persistent SQLite (`dev.db`) with zero-configuration setup (ready for PostgreSQL production switch via `DATABASE_URL`)
- **Authentication:** JWT (JSON Web Tokens) with Bearer headers and HTTP-only cookies, bcryptjs password hashing
- **Request Validation:** Zod schema validation middleware
- **Automated Scheduler:** `node-cron` background worker evaluating impending deadlines, updating overdue states, and generating in-app and desktop notifications

---

## ✨ 3. Unique Selling Propositions (USPs)

1. **Smart Proactive Notifications:**
   - Dynamically generated alerts based on impending deadlines (< 24h urgent warnings, < 72h upcoming preparation reminders).
   - Database-backed in-app notification center with read/unread tracking and clear-all actions.
   - Desktop Web Browser Notifications integration via the Web Notifications API.
2. **Dual Tracking & Analytics:**
   - Instant visual differentiation between completed academic deliverables and active pending tasks.
   - Real-time completion rate percentages, study hours invested (estimated vs. actual), and velocity trends.
3. **Multi-Subject Categorization:**
   - Color-coded academic course tags with instructor names, course codes (e.g. `CS601`, `CS602`), and department info.
4. **Interactive Academic Calendar:**
   - Full monthly grid with color-coded deadline badges, daily deliverable counts, and quick inspection modals.
5. **Project Presentation Slide Deck Modal:**
   - Built-in presentation viewer directly displaying the B.Tech project slides (Problem Statement, Existing System Limitations, Proposed Architecture, Tech Stack, USP, Target Users, and Viva Q&A).
6. **Academic Export:**
   - 1-click CSV report export for college submission logs and accreditation records.

---

## 🚀 4. Quick Start & Execution Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 🌐 Live Application Links (Active Now)

Click either link below to access the running system in your browser:

- **🚀 Open DueWise Web App:** **[http://localhost:5173](http://localhost:5173)**
- **📡 Backend API Status:** **[http://localhost:5000/api/health](http://localhost:5000/api/health)**

---

### Option A: Run Pre-configured Setup

1. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   *Runs on [http://localhost:5000](http://localhost:5000) with active SQLite database and automated cron scheduler.*

2. **Start Frontend Client:**
   ```bash
   cd frontend
   npm run dev
   ```
   *Runs on [http://localhost:5173](http://localhost:5173) with Vite proxy configured to backend.*

---

## 🔑 5. Demo Credentials (For Evaluation & Defense)

The database includes a pre-seeded student profile configured for presentations:
- **Email:** `demo@student.edu`
- **Password:** `password123`
- **Fast Access:** Simply click the **"1-Click Demo Student Login"** button on the Login page!

### Pre-loaded Academic Courses & Deliverables:
- **CS601: Distributed Systems & Cloud Computing** (Kubernetes Lab Record, Raft Consensus Homework)
- **CS602: Machine Learning & Deep Learning** (CNN Retinal Scan Technical Report)
- **CS603: Software Engineering & Project Management** (SRS IEEE 830 Review)
- **EC604: IoT & Embedded Hardware Systems** (ESP32 MQTT Telemetry Practical)
- **CS605: Cryptography & Network Security** (RSA DPP Problem Set)
- **PR601: B.Tech Minor Project Presentation** (Assignment Reminder App Blueprint)

---

## 📁 6. Repository Structure

```
assignment-reminder-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Prisma ORM models (User, Subject, Assignment, Notification, UserSettings)
│   │   ├── seed.ts            # Realistic B.Tech coursework seed script
│   │   └── dev.db             # Persistent SQLite database
│   ├── src/
│   │   ├── middleware/        # JWT Auth and Zod validation middleware
│   │   ├── routes/            # Auth, Subjects, Assignments, Notifications, Analytics, Settings
│   │   ├── services/          # Node-cron deadline evaluation engine
│   │   ├── prisma.ts          # PrismaClient singleton
│   │   └── index.ts           # Express server entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Sidebar, AppLayout
│   │   │   ├── dashboard/     # DualTrackingSummary, UrgentDeadlinesAlert, WorkloadCharts
│   │   │   ├── assignments/   # AssignmentList, AssignmentModal
│   │   │   ├── subjects/      # SubjectGrid, SubjectModal
│   │   │   ├── calendar/      # AcademicCalendarView
│   │   │   └── presentation/  # ProjectShowcaseModal (B.Tech Slide Deck)
│   │   ├── context/           # AuthContext (JWT session management)
│   │   ├── lib/               # api.ts (API client), notifications.ts (Web Push & Web Audio)
│   │   ├── pages/             # Dashboard, Assignments, Subjects, Calendar, Analytics, Settings, Login, Register
│   │   ├── types/             # TypeScript definitions
│   │   ├── App.tsx            # Routes and TanStack Query provider
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## 🎯 7. College Viva / Project Evaluation Checklist

- [x] **Full-Stack Implementation:** End-to-end working Frontend (React, Vite, Tailwind), Backend (Node.js, Express), and persistent Database (Prisma ORM, SQLite/PostgreSQL).
- [x] **Authentication:** Secure JWT sessions, HTTP-only cookie support, password hashing with bcryptjs, and 1-click Demo Student login.
- [x] **CRUD Operations:** Complete Create, Read, Update, and Delete operations for both Academic Subjects and Assignment Deliverables.
- [x] **Dual-Tracking Dashboard:** Real-time KPI counters (Total, Pending, In Progress, Completed, Overdue, Study Hours) and visual completion progress.
- [x] **Automated Reminders:** Background cron scheduler continuously evaluating deadlines, dispatching in-app alerts, and triggering browser push notifications.
- [x] **Academic Calendar:** Full interactive monthly and weekly submission view with subject color tags.
- [x] **College Presentation Showcase:** Integrated interactive slide viewer directly aligned with the presentation requirements.
- [x] **Export Capability:** Export assignment schedule to CSV for student records.
