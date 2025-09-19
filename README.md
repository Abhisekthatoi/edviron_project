# Edviron School Payments Dashboard (Frontend)

A Vite + React frontend for viewing and filtering school payment transactions and checking statuses against a protected NestJS API.  

## Prerequisites

- Running API on http://localhost:3000 with JWT-protected routes.  
- Node.js 20+ and npm installed locally.  

## Environment

Create ./frontend/.env with:
VITE_API_BASE_URL=http://localhost:3000

text
The app reads `import.meta.env.VITE_API_BASE_URL` to call the backend.  

## Setup

from ./frontend
npm ci
npm run dev -- --host 0.0.0.0 --port 5173 # development
npm run build # production build
npm run preview -- --host 0.0.0.0 --port 5173

text

## Authentication (JWT)

Obtain a token from the backend login route and store it in the browser:
localStorage.setItem('token','<JWT>');

text
Reload the page so requests include `Authorization: Bearer <JWT>`.  

## Pages and Functionality

### Transactions (Overview)
- Data source: `GET /transactions?limit=&page=&sort=&order=&status=&schoolIds=&from=&to=`  
- Columns: `collect_id, school_id, gateway, order_amount, transaction_amount, status, custom_order_id`  
- Features: pagination, sort by `payment_time` or `status`, status multi-select, optional school/date filters, and URL persistence for shareable views.  

### Transactions by School
- Data source: `GET /transactions/school/:schoolId?limit=&page=&sort=&order=`  
- UI: select a `school_id` then list and paginate results.  

### Status Check
- Data source: `GET /transaction-status/:custom_order_id`  
- UI: input `custom_order_id` and display current status.  

## Local Test Data (optional)

1) Insert an Order (e.g., via DB UI):
{
"school_id": "SCH-001",
"gateway_name": "test",
"custom_order_id": "CUST-001",
"student_info": { "name": "NA", "id": "NA", "email": "NA" }
}

text

2) Post a webhook:
curl -X POST "$VITE_API_BASE_URL/webhook"
-H "Content-Type: application/json"
-H "Authorization: Bearer <JWT>"
-d '{
"status": 1,
"order_info": {
"order_id": "CUST-001",
"order_amount": 1000,
"transaction_amount": 1000,
"gateway": "test",
"bank_reference": "BR-001",
"status": "success",
"payment_mode": "upi",
"payemnt_details": "upi-xyz",
"Payment_message": "ok",
"payment_time": "2024-01-01T10:00:00.000Z",
"error_message": ""
}
}'

text

## Screenshots

Add images under `docs/screenshots/` and reference them here:
- Transactions: `docs/screenshots/transactions.png`  
- Status: `docs/screenshots/status.png`  

## Notes

- Ensure the API is reachable at `VITE_API_BASE_URL` and that a valid JWT is present in `localStorage.token`.  
- For production hosting, configure the correct API base URL via environment variables.  
