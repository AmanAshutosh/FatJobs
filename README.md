#  FATJOBS.IN | AI-Powered Career Deck

**FatJobs** is a high-performance, full-stack job aggregation engine designed to bypass the noise of traditional job boards. It leverages automated scraping, cloud-native storage, and a real-time "Trump Card" UI to deliver fresh SDE and Data roles directly from top-tier tech firms.

---

##  Tech Stack

### **Frontend (The Deck)**
* **React 18**: Component-based UI with hooks (`useMemo`, `useCallback`) for performance optimization.
* **Axios**: Centralized API client with custom interceptors for Railway backend communication.
* **CSS3 (Neon-Glassmorphism)**: Custom-built design system featuring dynamic "Glow States" based on data freshness.
* **Remix Icon**: High-density iconography for a technical aesthetic.

### **Backend (The Hunter)**
* **Node.js & Express**: Scalable REST API architecture.
* **MongoDB & Mongoose**: Document-based storage with **TTL (Time-To-Live)** indices for automated data pruning.
* **Cheerio & Axios**: Headless scraping logic optimized for Greenhouse boards and Lever.
* **Cron Jobs**: Automated "Mega-Sync" cycles to ensure the database never goes stale.

---

##  System Architecture

The project follows a decoupled architecture ensuring high availability and clean separation of concerns:

1.  **The Hunter (Scraper Engine)**: Periodically crawls primary ATS boards (Greenhouse/Lever) and job aggregators.
2.  **The Vault (Database)**: Stores unique jobs with a uniqueness constraint on the application link to prevent duplicates.
3.  **The API Gateway**: A filtered RESTful interface that provides data based on category (SDE/DA) and recency (24h to 7 days).
4.  **The Deck (Frontend)**: A real-time dashboard that visually categorizes jobs using a "Traffic Light" freshness system.

---

## Key Features

### **1. Real-Time "Trump Card" UI**
Every job is rendered as a premium card with dynamic visual feedback:
* 🟢 **NEW (0–24h)**: Neon Green Glow – High-priority applicant status.
* 🟠 **RECENT (24–72h)**: Electric Orange Glow – Active status.
* ⚪ **STABLE (3–7 Days)**: Slate Gray Border – Verified status.

### **2. Instant Multi-Filter System**
* **Search**: Real-time client-side filtering by Company or Role.
* **Location**: Geospatial filtering (Remote, Bangalore, Noida, USA).
* **Recency Toggle**: Backend-driven time window adjustments (24h/3d/7d).

### **3. Automated Lifecycle Management**
* **Auto-Cleaning**: The system automatically deletes jobs older than 7 days to ensure users only spend time on active roles.
* **Smart Syncing**: The frontend re-syncs with the server every time the user focuses on the tab.

---

📈 Roadmap
[ ] AI Resume Matcher: Upload a resume to see a match percentage for each card.

[ ] Email Alerts: Opt-in for "Green Glow" (0-24h) role notifications.

[ ] One-Click Apply: Integration with common ATS forms to fill details automatically.

Developed with ⚡ by Ashutosh Aman

Full-Stack Developer | Noida, India
