# 🎓 Edviron School Payments & Dashboard

A **full-stack project** for managing school payment transactions, featuring: 
- **Backend:** NestJS REST API secured with JWT 
- **Frontend:** Vite + React dashboard consuming protected endpoints 
- **Database:** MongoDB with aggregation pipelines for enriched transaction views 
- **Orchestration:** Docker Compose for consistent local development 

---

## 📖 Table of Contents
1. [Overview](#-overview) 
2. [Architecture](#-architecture) 
3. [Prerequisites](#-prerequisites) 
4. [Project Setup](#-project-setup) 
- [Using Docker Compose](#using-docker-compose) 
- [Without Docker](#without-docker) 
5. [Environment Variables](#-environment-configuration) 
6. [Authentication Flow](#-authentication-flow) 
7. [API Endpoints](#-api-endpoints) 
8. [Data Model](#-data-model) 
9. [Frontend Functionality](#-frontend-pages--functionality) 
10. [Backend Functionality](#-backend-functionality) 
11. [Docker Services](#-docker-services) 
12. [Troubleshooting](#-troubleshooting) 
13. [Screenshots](#-screenshots) 
14. [Security Notes](#-security-notes) 
15. [License](#-license) 

---

## 🚀 Overview
- **Backend** 
Exposes routes to:
- List transactions (with pagination, sorting, and filtering) 
- Filter transactions by school 
- Check transaction status 
- Initiate a payment 
- Ingest webhooks for payment updates 

- **Frontend** 
Provides:
- Transaction overview table with filters and pagination 
- School-specific transaction view 
- Status lookup by `custom_order_id` 

- **Local Development** 
Uses Docker Compose for API (`3000`), UI (`5173`), MongoDB (`27017`), and Mongo Express (`8081`). 

---

## 🏗️ Architecture
- **Services:** `web` (React), `api` (NestJS), `mongo`, `mongo-express` 
- **Data Model:** 
- `orders`: stores school, gateway, and student transaction data 
- `orderstatuses`: stores status updates, amounts, and timestamps 
- Aggregation joins collections for enriched lists 
- **Security:** 
- All endpoints (except auth) require JWT authentication 

---

## 📦 Prerequisites
- [Node.js](https://nodejs.org/) **20+** and npm 
- [Docker](https://www.docker.com/) & Docker Compose 

---

## ⚡ Project Setup

### Using Docker Compose
```bash
# 1. Create env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Start the stack
docker compose up -d

# 3. Access services
Frontend: http://localhost:5173 
Backend API: http://localhost:3000

Without Docker
 
# Backend
cd backend
npm ci
npm run start:dev

# Frontend
cd frontend
npm ci
npm run dev


🔑 Environment Configuration
backend/.env
 
MONGODB_URI=mongodb://mongo:27017/edviron
JWT_SECRET=dev-jwt-secret
JWT_EXPIRES=1d
PAYMENT_API_BASE=https://example-payments.local
PAYMENT_API_KEY_JWT=replace-with-signing-key
PG_KEY=edvtest01
SCHOOL_ID=65b0e6293e9f76a9694d84b4

frontend/.env
 
VITE_API_BASE_URL=http://localhost:3000


🔐 Authentication Flow
Register → POST /auth/register (creates user, bcrypt password)
Login → POST /auth/login returns { "access_token": "..." }
Frontend → Store token in localStorage and attach to requests:

 
localStorage.setItem('token', '<JWT>');


📡 API Endpoints
Method
Endpoint
Description
GET
/transactions
List all transactions with pagination, filters, and sorting
GET
/transactions/school/:schoolId
List transactions by school
GET
/transaction-status/:custom_order_id
Check latest status by custom order ID
POST
/create-payment
Initiate a new payment
POST
/webhook
Ingest payment updates and store statuses

💾 Data Model
Orders
school_id, gateway_name, custom_order_id, student_info
OrderStatus
References order by collect_id
Stores amounts, gateway, status, payment_time
Aggregation Pipeline
$lookup → join orders and orderstatuses
$unwind → latest status
$project → select fields for UI
$sort, $skip, $limit → pagination

🖥️ Frontend Pages & Functionality
Transactions Overview

Calls GET /transactions
Renders collect_id, school_id, gateway, amounts, status, payment_time
Supports pagination, sorting, filters, and URL state persistence
Transactions by School

Calls GET /transactions/school/:schoolId
Provides a focused school view
Transaction Status Check

Calls GET /transaction-status/:custom_order_id
Displays latest snapshot
Optional: Create Payment

Calls POST /create-payment
Signs payload, forwards request, records initiated status

⚙️ Backend Functionality
Auth → Register/Login with bcrypt & JWT
Transactions → Aggregation for listing & filtering
Payments → Initiation with signing key (PAYMENT_API_KEY_JWT)
Webhooks → Update or insert OrderStatus records
Guards → JWT AuthGuard for all non-auth routes

🐳 Docker Services
Service
Port
Description
API (NestJS)
3000
Backend REST API
Web (React)
5173
Frontend UI
MongoDB
27017
Database
Mongo Express
8081
DB Admin UI

🛠️ Troubleshooting
404 from frontend → Ensure VITE_API_BASE_URL is set correctly
401 Unauthorized → Refresh JWT, set in localStorage, reload app
Empty data → Seed an Order and post a webhook with matching custom_order_id


transactions.png → Transactions overview
school.png → School view
status.png → Status check

🔒 Security Notes
Never commit .env or secrets
Guard all non-auth routes with JWT
Keep payment keys and JWT secrets private
