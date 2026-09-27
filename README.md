# EcoCollect

> **Dispose responsibly. We'll help with the pickup.**
> A modern, intuitive civic-tech web platform for waste category education, pickup scheduling, real-time request tracking, and collection operations management.

---

## 1. Project Overview

**EcoCollect** is a software-only hackathon MVP designed to streamline municipal and private household waste pickups. It provides a simple, transparent interface where residents can quickly discover how to classify waste, schedule a pickup, and monitor collection status in real time. For collection teams, a secure administrative portal offers request filtering, status transition tracking, and live collection analytics calculated directly from actual database records.

---

## 2. Problem

* **Resident Confusion**: People frequently struggle to understand which waste categories can be recycled or safely disposed of (e.g. distinguishing electronic waste and hazardous batteries from dry recyclables).
* **Scheduling Friction**: Arranging waste pickups often involves complicated phone calls, confusing government portals, or opaque collection times.
* **Lack of Visibility**: Once waste is left outside, residents have no way to verify whether the pickup was received, scheduled, or collected.
* **Operational Disconnect**: Small collection crews and dispatchers lack lightweight digital dashboards to track active pickups, manage route states, and measure completion rates.

---

## 3. Solution

EcoCollect delivers an approachable, civic-minded platform focused on:
* **Clarity First**: Human-friendly language ("Request a Pickup", "What do you want collected?", "Where should we collect it?") instead of confusing administrative jargon.
* **3-Step Guided Scheduling**: A frictionless wizard (Waste Category &rarr; Pickup Location/Time &rarr; Review & Confirm) that completes in under 2 minutes.
* **Live Status Tracking**: Instant unique tracking codes (`EC-2026-00482`) and a vertical status timeline powered by real-time database state.
* **Operational Staff Portal**: A separated `/admin` dashboard for staff to search, filter, update statuses (`Pending` &rarr; `Confirmed` &rarr; `Scheduled` &rarr; `Collected` / `Cancelled`), and view real-time statistics.

---

## 4. Key Features

### For Residents & Public Users
* **Civic Waste Guide**: Practical sorting tips and item examples for 6 key categories: Plastic, Dry Waste, Organic, E-Waste, Hazardous, and Other.
* **3-Step Pickup Wizard**:
  * **Step 1 (Waste)**: Interactive category selection cards with Lucide icons.
  * **Step 2 (Pickup Details)**: Complete address entry, future date restriction (past dates strictly disallowed), and preferred 2-hour collection windows.
  * **Step 3 (Review & Confirm)**: Full summary check with inline edit shortcuts and instant confirmation.
* **Instant Confirmation & Copyable ID**: Clean success screen with single-click clipboard copying.
* **My Requests & Device Persistence**: Automatically logs submitted requests to local storage for quick access without forcing users to register accounts.
* **Live Status Timeline**: Visual progress steps (`Request received` &rarr; `Pickup confirmed` &rarr; `Pickup scheduled` &rarr; `Waste collected`).

### For Staff & Collection Dispatchers
* **Separated Admin Area**: Accessible via `/admin/login`.
* **Live Dashboard Statistics**: Real-time KPI cards (Total Requests, Pending, Scheduled, Collected).
* **Database-Driven Charts**: Requests overview by date and percentage distribution across waste categories.
* **Request Management & Search**: Real-time search by Request ID or street address, with filters for categories, statuses, and collection dates.
* **Safe Status Workflow**: Enforced progression modal allowing dispatchers to update orders from `Pending` to `Confirmed`, `Scheduled`, and `Collected` (or `Cancelled`).
* **Pickup History Archive**: Dedicated view for completed (`Collected`) and `Cancelled` requests.
* **Collection Analytics**: Accurate completion rates, top requested category, and time-series metrics calculated dynamically from SQLite.

---

## 5. Technology Stack

### Frontend
* **React 18** (TypeScript)
* **Vite** (Next-generation frontend tooling and fast HMR)
* **Tailwind CSS** (Custom civic-tech design system)
* **Lucide React** (Consistent, accessible iconography)
* **React Router v6** (Client-side routing with public and admin separation)

### Backend
* **Python 3.11+ / 3.14**
* **FastAPI** (Modern, high-performance async REST framework)
* **Pydantic v2** (Strict data validation and friendly error handling)
* **SQLAlchemy 2.0** (Relational ORM with model abstractions)
* **Uvicorn** (Lightning-fast ASGI server)

### Database
* **SQLite (for Hackathon MVP)**: Zero-configuration local database (`ecocollect.db`).
* *PostgreSQL Ready*: Database connection utilizes SQLAlchemy abstractions, allowing a drop-in transition to PostgreSQL / Google Cloud SQL simply by setting the `DATABASE_URL` environment variable.

---

## 6. Design System & Accessibility

* **Deep Forest Green** (`#14532D`): Branding highlights, solid navigation headers, and hero accents.
* **Primary Green** (`#16A34A`): Primary action buttons, active indicators, and links.
* **Soft Mint** (`#DCFCE7`): Badge backgrounds, progress bars, and subtle highlights.
* **Background** (`#F7FAF8`): Clean, low-glare canvas with ample whitespace.
* **Main Text** (`#17211B`) & **Muted Text** (`#6B756E`): High contrast readability.
* **Consistent Status Colors**:
  * `Pending`: Amber (`#F59E0B` / `#FEF3C7`)
  * `Confirmed`: Sky/Blue (`#0284C7` / `#E0F2FE`)
  * `Scheduled`: Green (`#16A34A` / `#DCFCE7`)
  * `Collected`: Deep Forest (`#14532D` / `#D1FAE5`)
  * `Cancelled`: Red (`#EF4444` / `#FEE2E2`)
* **Accessibility**: Dual signaling (e.g. `● Scheduled`, `✓ Collected`) ensuring status does not rely solely on color.

---

## 7. Project Structure

```
SmartWaste/
├── Dockerfile                  # Multi-stage production container for Google Cloud Run
├── README.md                   # Complete documentation
├── pytest.ini                  # Pytest configuration
├── .gitignore
├── .dockerignore
├── backend/
│   ├── requirements.txt        # FastAPI, SQLAlchemy, Pydantic, Pytest dependencies
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI entry point, CORS, and SPA static mount
│   │   ├── config.py           # Application settings and environment variables
│   │   ├── database.py         # SQLAlchemy engine, session maker, DB init
│   │   ├── models/
│   │   │   └── pickup_request.py  # PickupRequest SQLAlchemy model
│   │   ├── schemas/
│   │   │   ├── request.py      # Validation schemas (categories, dates, status)
│   │   │   ├── stats.py        # Metrics and chart schemas
│   │   │   └── auth.py         # Admin authentication schemas
│   │   ├── routes/
│   │   │   ├── requests.py     # Public & request endpoints (/api/requests)
│   │   │   └── admin.py        # Staff portal endpoints (/api/admin/*)
│   │   ├── services/
│   │   │   ├── request_service.py # ID generator (EC-2026-XXXXX), business logic
│   │   │   └── seed_service.py    # Identifiable sample seed data loader
│   │   └── utils/
│   │       └── auth.py         # Bearer token generation & verification
│   └── tests/
│       └── test_api.py         # 100% passing automated backend test suite
└── frontend/
    ├── package.json
    ├── vite.config.ts          # Vite build config with proxy to backend
    ├── tailwind.config.js      # Design tokens and status themes
    ├── tsconfig.json
    └── src/
        ├── types/              # TypeScript models
        ├── services/           # API integration (requestsAPI, adminAPI)
        ├── context/            # RequestContext & AdminAuthContext
        ├── components/         # Navbar, Footer, StatusBadge, WasteCard, etc.
        ├── pages/              # Home, HowItWorks, WasteGuide, Request, Confirmation, MyRequests, Track
        │   └── admin/          # AdminLogin, AdminLayout, Dashboard, Requests, History, Analytics
        ├── App.tsx             # Route declarations
        └── main.tsx
```

---

## 8. Local Setup & Running

### Prerequisites
* **Python**: 3.10+ (tested with Python 3.14)
* **Node.js**: 18+ (tested with Node.js 24)
* **npm**: 9+

### Backend Setup
1. Open a terminal in the project root:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Start the FastAPI backend:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload
   ```
   *The backend will automatically create `ecocollect.db` and seed the 4 initial demo requests on startup.*

### Frontend Setup
1. In a second terminal:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser at: **`http://localhost:3000`**

### Running Automated Tests
Run the backend pytest suite:
```bash
python -m pytest -v
```

---

## 9. Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | Port for the HTTP server (utilized by Google Cloud Run) |
| `DATABASE_URL` | `sqlite:///./ecocollect.db` | SQLAlchemy connection string |
| `ADMIN_USERNAME` | `admin` | Username for staff login |
| `ADMIN_PASSWORD` | `ecocollect2026` | Password for staff login |
| `SECRET_KEY` | `ecocollect-hackathon-secret-key-2026` | Secret key for signing admin tokens |

---

## 10. API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/requests` | Submit a new pickup request (Generates `EC-2026-XXXXX`) |
| `GET` | `/api/requests` | List pickup requests with optional `search`, `category`, `status`, `date` |
| `GET` | `/api/requests/{id}` | Get full details and current status of a single pickup request |
| `PATCH`| `/api/requests/{id}/status` | Transition status (`Pending` &rarr; `Confirmed` &rarr; `Scheduled` &rarr; `Collected` / `Cancelled`) |
| `POST` | `/api/admin/login` | Staff login returning Bearer token |
| `GET` | `/api/admin/statistics` | Real-time counts for Total, Pending, Confirmed, Scheduled, Collected, Cancelled |
| `GET` | `/api/admin/category-statistics` | Percentage and count breakdown across all 6 waste categories |
| `GET` | `/api/admin/history` | Filterable archive of `Collected` and `Cancelled` requests |
| `GET` | `/api/admin/analytics` | Completion rates, top categories, and pickup dates time-series |
| `GET` | `/health` | Service health check |

---

## 11. Initial Demo Data

On first startup, the database is automatically seeded with sample requests:
* **`EC-2026-00482`** &mdash; **E-Waste** &mdash; `Scheduled`
* **`EC-2026-00481`** &mdash; **Plastic** &mdash; `Pending`
* **`EC-2026-00480`** &mdash; **Organic** &mdash; `Collected`
* **`EC-2026-00479`** &mdash; **Dry Waste** &mdash; `Confirmed`

---

## 12. Google Cloud Run Deployment

The project includes a multi-stage Dockerfile that builds the React application, bundles the static assets with FastAPI, and serves both frontend and API on Cloud Run's dynamic `$PORT`.

### Build & Deploy with Google Cloud CLI:
```bash
# 1. Set your GCP Project ID
gcloud config set project YOUR_PROJECT_ID

# 2. Build and deploy directly to Cloud Run
gcloud run deploy ecocollect \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ADMIN_USERNAME=admin,ADMIN_PASSWORD=your_secure_password
```

### Important Cloud Run / Storage Architecture Note
> [!IMPORTANT]
> **SQLite Ephemeral Storage**: Google Cloud Run instances have an in-memory/ephemeral filesystem. In this hackathon MVP configuration, SQLite is stored on the local container filesystem. For a long-term production deployment with multiple autoscaled container instances, configure a managed relational database such as **Google Cloud SQL for PostgreSQL** and set the `DATABASE_URL` environment variable accordingly:
> ```bash
> DATABASE_URL="postgresql://user:password@cloudsql-ip/ecocollect"
> ```

---

## 13. Future Improvements

* **Email / SMS Notifications**: Direct updates when a request transitions from `Confirmed` to `Scheduled`.
* **Geo-Routing**: Automated route grouping for collection trucks based on street address neighborhoods.
* **Photo Attachment**: Optional resident upload of bulky waste photos to assist collectors.
* **PostgreSQL / Cloud SQL**: Production migration for multi-region scale.
