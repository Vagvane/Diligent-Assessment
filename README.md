# E-Commerce Web Application

Modern full-stack storefront that lets users browse products, view details, manage a cart, and place mock checkout orders using a React frontend, Express backend, and MongoDB Atlas.

## Features
- Product catalog with responsive grid, detail view, and client-side cart management.
- Checkout flow with order creation, mock payment intent, and confirmation page.
- Modular backend architecture (routes, controllers, services) ready to plug into real payment providers.
- Reusable styling system with responsive layouts across devices.

## Tech Stack
- **Frontend:** React 18, React Router 6, Context API, Vite, plain CSS.
- **Backend:** Node.js 18, Express 4, Mongoose 8, MongoDB Atlas.
- **Tooling:** Vite dev server, Nodemon, ESLint/Prettier (configurable).

## Project Structure
```
.
├── README.md
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── ...
└── backend/
    ├── package.json
    ├── server.js
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── services/
```

## Setup

### 1. Prerequisites
- Node.js 18+ (includes npm 9+)
- MongoDB Atlas cluster (or local Mongo instance)

### 2. Environment Variables

#### Backend (`backend/.env`)
```
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/shopsphere?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5173
# Optional: TAX_RATE=0.08
```
Copy from `.env.example` and fill in real credentials. Add any payment provider secrets later.

#### Frontend (`frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:4000
```
Use environment-specific overrides (`.env.production`) when deploying.

### 3. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run Backend
```bash
cd backend
npm run dev     # nodemon (development)
# or
npm start       # node server.js (production)
```
Server listens on `PORT` (default `4000`).

### 5. Run Frontend
```bash
cd frontend
npm run dev
```
Vite serves the SPA at `http://localhost:5173` (configurable).

### 6. MongoDB Atlas Connection
- Create an Atlas cluster and database user with read/write permissions.
- Whitelist your IP or use `0.0.0.0/0` for dev.
- Copy the connection string into `MONGODB_URI`.
- The backend uses Mongoose with connection pooling; the database name can be embedded in the URI or set by `MONGODB_DB`.

## Useful Commands
| Location  | Command            | Description                     |
|-----------|--------------------|---------------------------------|
| backend   | `npm run dev`      | Start API with nodemon          |
| backend   | `npm start`        | Start API with Node             |
| frontend  | `npm run dev`      | Start Vite dev server           |
| frontend  | `npm run build`    | Production build                |
| frontend  | `npm run preview`  | Preview production build        |

## Future Enhancements
- **Authentication & Accounts:** user registration/login, persisted orders.
- **Real Payments:** integrate Stripe/Razorpay (current `paymentService` abstraction ready).
- **Checkout polish:** saved addresses, shipping rates, email notifications.
- **Product management:** admin dashboard for inventory, categories, uploads.
- **Testing & CI:** unit/integration tests, deployment pipeline.

---
Feel free to adapt the codebase, connect to a real payment provider, and expand the checkout experience as needed.

