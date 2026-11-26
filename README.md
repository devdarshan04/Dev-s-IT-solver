# FixTrail – Smart IT Problem Solver 🛠️✨

A modern, professional, fully functional AI-powered web application for developers, IT support specialists, and DevOps engineers to diagnose errors from screenshots, extract stack traces, and receive actionable step-by-step troubleshooting solutions.

---

## 🚀 Key Features

1. **User Registration & Login**
   - Role-based access control (`user` vs `admin` vs `technician`).
   - 1-Click Demo Profiles for instant testing:
     - **Alex Rivera**: Software Engineer / Frontend Developer.
     - **Sarah Chen**: Lead DevOps & IT Administrator.
   - User profile badge, session persistence, and custom account registration.

2. **AI-Powered Screenshot Error Detection & OCR**
   - Drag & drop screenshot upload or instant clipboard pasting with <kbd>Ctrl+V</kbd>.
   - Visual scanning animation with bounding box highlight overlays for detected error messages.
   - 6 Quick Test Presets:
     - Docker Daemon Socket Permission Denied (`/var/run/docker.sock`)
     - React 18 SSR Hydration Content Mismatch (`Error #418 / #423`)
     - PyTorch CUDA Out of Memory (`torch.cuda.OutOfMemoryError`)
     - Kubernetes Pod CrashLoopBackOff (`ExitCode 137 / OOMKilled`)
     - Windows BSOD Kernel Security Check Failure (`0x00000139`)
     - PostgreSQL Connection Limit Exceeded (`SQLSTATE 53300`)

3. **Intelligent Troubleshooting Recommendations**
   - Immediate **Quick Fix** highlighted remedy.
   - **Root Cause Analysis (RCA)** explaining underlying failure mechanisms.
   - **Interactive Step-by-Step Checklist**: Users can check off each step as they resolve the issue in real time.
   - Copyable shell/bash/PowerShell commands with 1-click copy buttons and syntax highlighting.
   - Long-term **Prevention & Best Practice Tips**.
   - One-click **Export as Markdown Report**.

4. **Similar Issue Detection**
   - Matches incoming error traces against known organizational playbooks.
   - Shows similarity percentage badges (e.g., `98% Match`, `89% Match`).
   - Instant modal preview to compare verified resolutions.

5. **Personal Problem-Solving History**
   - History registry with status badges (`Resolved`, `In Progress`, `Unresolved`).
   - Filter by status tabs and search by title, error code, or notes.
   - Inline technician note editor for recording environment-specific findings.
   - One-click JSON export.

6. **Admin Dashboard with Issue Analytics**
   - KPI metrics: Total Issues (1,842), Automated Resolution Rate (91.5%), Avg Resolution Time (14.2m), Open Critical Incidents.
   - **Weekly Trend Chart**: Custom responsive SVG bar/area chart showing reported errors vs. resolved playbooks.
   - **Category Distribution**: Visual breakdown across DevOps, Frontend, Backend, Databases, OS, and Security.
   - **Severity Meters**: Critical, High, Medium, Low breakdown.
   - **Top 7 Recurring Errors Table**: Frequency, category, severity, and resolution times.
   - **Incident Triage Queue**: Assign technicians and update ticket status.

7. **Knowledge Base of Previously Solved Issues**
   - Pre-populated with verified real-world playbooks.
   - Search by keyword, category, or operating system (Linux, Windows, macOS, Cross-Platform).
   - Interactive upvoting system.
   - Full article modal view with detailed step instructions.
   - "Contribute Solution" submission modal.

8. **Modern Responsive UI with Dark / Light Mode**
   - Cyberpunk-inspired dark mode palette (`#080b11`) with vibrant neon accents and crisp light mode.
   - Glassmorphic panels, animated status indicators, and mobile drawer navigation.

---

## 🎨 3D Hero Section & Spline Integration

FixTrail includes a dedicated, flexible 3D Hero Component (`src/components/Spline3DHero.tsx`):
- **Built-in 3D Demo Model**: High-performance interactive HTML5 Canvas 3D particle cyber-sphere with holographic orbital rings that responds smoothly to mouse tilt and hovering. Works out of the box with **zero external dependencies** and zero latency!
- **Spline 3D Integration Slot**:
  - Click the **"Spline Slot"** tab in the hero section to preview a Spline 3D scene.
  - Open **"3D Element Config"** to paste any custom Spline scene URL exported from your Spline editor (e.g. `https://prod.spline.design/.../scene.splinecode`).
  - Use the built-in "Copy Spline React Code" button to grab the exact snippet for custom components.

---

## 💻 Getting Started

### Prerequisites
- Node.js v18+ (tested on Node.js v20)
- npm v9+

### Installation & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server** (Vite with hot reload):
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Run Full-Stack Node Server**:
   ```bash
   npm start
   ```
   Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🏗️ Project Architecture

```
├── dist/                     # Optimized production bundle
├── server/
│   └── index.js              # Express API and static server
├── src/
│   ├── components/
│   │   ├── Navbar.tsx        # Responsive navigation & demo user switcher
│   │   ├── Footer.tsx        # Footer with status & links
│   │   ├── Spline3DHero.tsx  # Flexible 3D Demo Model & Spline viewer slot
│   │   ├── ErrorUploader.tsx # Drag/drop, clipboard paste, OCR scanner & presets
│   │   ├── DiagnosticResult.tsx # Interactive step checklist, RCA, copy buttons
│   │   ├── SimilarIssues.tsx # Semantic matching against KB
│   │   ├── HistoryView.tsx   # Personal problem history & notes
│   │   ├── KnowledgeBase.tsx # Searchable playbooks & contribution modal
│   │   ├── AdminDashboard.tsx# Analytics KPI cards & charts
│   │   └── AuthModal.tsx     # Sign-in / registration modal
│   ├── context/
│   │   ├── AuthContext.tsx   # Authentication and role switcher
│   │   └── ThemeContext.tsx  # Dark/light theme state
│   ├── data/
│   │   └── initialData.ts    # Seed playbooks, sample errors & analytics
│   ├── services/
│   │   ├── aiSolver.ts       # Intelligent multi-pattern IT diagnostic engine
│   │   ├── ocrService.ts     # Visual OCR simulator & bounding box generator
│   │   └── storage.ts        # LocalStorage persistence manager
│   ├── types.ts              # Full TypeScript interface definitions
│   ├── App.tsx               # Main application container
│   ├── main.tsx              # App entry point
│   └── index.css             # Tailwind CSS & custom design system
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```
