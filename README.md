# 🌱 EcoCollect

### Simple waste collection, organized.

EcoCollect is a civic-tech web platform that makes waste collection requests easier to submit, schedule, manage, and track.

People often know they need to dispose of waste but may not know which category it belongs to or how to request an appropriate collection service. Collection teams also need a simple way to organize incoming requests and keep their status updated.

EcoCollect connects both sides through a clear, structured workflow.

---

## 🎯 Problem

Waste disposal can become difficult when:

* People are unsure how to categorize different types of waste.
* Pickup requests are handled through disconnected channels.
* Users have limited visibility into their request status.
* Collection teams need a centralized way to manage requests.
* Request history and collection statistics are difficult to maintain.

---

## 💡 Solution

EcoCollect provides one simple platform where users can:

1. Understand common waste categories.
2. Select the type of waste they want collected.
3. Enter a pickup location.
4. Choose a preferred date and time.
5. Submit a pickup request.
6. Receive a unique request ID.
7. Track the request status.

Collection staff can use the administrative portal to:

* View incoming requests.
* Search and filter requests.
* Update request statuses.
* Review pickup history.
* Monitor collection statistics.

---

## ✨ Key Features

### 👤 User

* Clean, easy-to-use landing page
* Waste disposal guide
* Waste category selection
* Pickup location
* Pickup date and time selection
* Optional pickup notes
* Request confirmation
* Unique request ID
* My Requests
* Request status tracking
* Responsive mobile-friendly interface

### 🛠️ Admin

* Secure admin login
* Dashboard overview
* Request statistics
* Request search
* Category filtering
* Status filtering
* Date filtering
* Request details
* Status management
* Pickup history
* Category analytics
* Collection activity analytics

---

## 🔄 User Workflow

```text
Home
  ↓
Request a Pickup
  ↓
Choose Waste Category
  ↓
Enter Pickup Details
  ↓
Review Request
  ↓
Confirm Pickup
  ↓
Request ID Generated
  ↓
Track My Pickup
  ↓
Collection Completed
```

---

## 👨‍💼 Admin Workflow

```text
Admin Login
    ↓
Dashboard
    ↓
View Pickup Requests
    ↓
Search / Filter
    ↓
Open Request
    ↓
Update Status
    ↓
Pickup History
    ↓
Analytics
```

---

## 📊 Request Status

Requests follow a simple status workflow:

```text
Pending
   ↓
Confirmed
   ↓
Scheduled
   ↓
Collected
```

A request can also be marked as:

```text
Cancelled
```

Status changes made by the administrator are reflected in the user's tracking view.

---

## 🗂️ Waste Categories

EcoCollect supports six categories:

| Category     | Examples                                      |
| ------------ | --------------------------------------------- |
| ♻️ Plastic   | Bottles, containers, packaging                |
| 📦 Dry Waste | Paper, cardboard, clean packaging             |
| 🍃 Organic   | Food scraps and biodegradable waste           |
| 🔋 E-Waste   | Electronics, cables, chargers                 |
| ⚠️ Hazardous | Batteries and potentially harmful materials   |
| Other        | Waste that does not fit the listed categories |

The Waste Guide provides simple disposal guidance for each category.

---

## 🧰 Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide React

### Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy

### Database

* SQLite

The application structure is designed so that the database can be migrated to PostgreSQL / Google Cloud SQL for a larger deployment.

### Deployment

* Docker
* Google Cloud Run

---

## 🏗️ Project Structure

```text
EcoCollect/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── tests/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── Dockerfile
├── .dockerignore
├── .gitignore
├── pytest.ini
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Python 3.12+
* Node.js 18+
* npm
* Git

---

## 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/EcoCollect.git
cd EcoCollect
```

---

## 2. Start the Backend

```bash
cd backend
```

Create a virtual environment:

### Windows

```powershell
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend will be available at:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

## 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at the URL shown by Vite, normally:

```text
http://localhost:5173
```

---

## 🔐 Admin Portal

The administrative portal is available through:

```text
/admin/login
```

Admin credentials should be configured through environment variables rather than committed to the repository.

Never commit passwords, API keys, tokens, or other secrets to GitHub.

---

## 🔌 API Overview

### Health

```http
GET /health
```

### Create Pickup Request

```http
POST /api/requests
```

### Get Requests

```http
GET /api/requests
```

### Get Request

```http
GET /api/requests/{request_id}
```

### Update Request Status

```http
PATCH /api/requests/{request_id}/status
```

### Admin Statistics

```http
GET /api/admin/statistics
```

### Category Statistics

```http
GET /api/admin/category-statistics
```

### Pickup History

```http
GET /api/admin/history
```

---

## 🧪 Testing

The project includes automated backend tests covering:

* Health check
* Demo data initialization
* Input validation
* Past-date validation
* Request creation
* Request ID generation
* Status transitions
* Admin authentication
* Statistics
* Category statistics
* Pickup history

Run tests from the project root:

```bash
pytest
```

---

## ☁️ Google Cloud Run

EcoCollect includes Docker configuration for deployment to Google Cloud Run.

Build the container:

```bash
docker build -t ecocollect .
```

Run locally:

```bash
docker run -p 8080:8080 ecocollect
```

For Cloud Run deployment, configure the required environment variables and deploy the container through Google Cloud.

### Database Note

The hackathon MVP uses SQLite to keep development and deployment lightweight.

Cloud Run containers have ephemeral local storage, so SQLite should not be considered persistent storage for a production-scale deployment.

For a larger production deployment, the application can be migrated to:

**PostgreSQL + Google Cloud SQL**

---

## 🎨 Design

EcoCollect uses a simple civic-tech design system focused on clarity and accessibility.

### Color Palette

| Color             | Hex       |
| ----------------- | --------- |
| Deep Forest Green | `#14532D` |
| Primary Green     | `#16A34A` |
| Soft Mint         | `#DCFCE7` |
| Background        | `#F7FAF8` |
| Main Text         | `#17211B` |
| Muted Text        | `#6B756E` |
| Border            | `#E5EAE6` |

The interface is designed around one principle:

> **A user should know what to do next without needing instructions.**

---

## 📱 Responsive Design

The application is designed for:

* Desktop
* Tablet
* Mobile

Forms, request cards, navigation, tracking, and administrative views adapt to smaller screens.

---

## 📸 Screenshots

Add project screenshots here after final UI review.

Recommended screenshots:

1. Home
2. Request a Pickup
3. Request Confirmation
4. Request Tracking
5. Admin Dashboard
6. Request Management
7. Analytics

---

## 🌍 Future Improvements

Possible future improvements include:

* PostgreSQL / Cloud SQL integration
* Collector accounts
* Pickup assignment
* Email/SMS notifications
* Map-based location selection
* Route optimization
* Advanced collection analytics
* Persistent cloud storage
* Expanded waste disposal guidance

These features are intentionally outside the scope of the current hackathon MVP.

---

## 📌 Hackathon Scope

EcoCollect was developed as a software-only MVP focused on the core waste collection workflow:

**Waste Selection → Pickup Request → Scheduling → Status Tracking → Administrative Management**

The implementation prioritizes a complete, understandable, and functional workflow rather than unnecessary platform complexity.

---

## 📄 License

This project is created for educational and hackathon purposes.

