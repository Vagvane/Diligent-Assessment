# Technical Architecture – E‑Commerce Web Application

Version: 1.0  
Last Updated: 2025-11-10

## 1. Overview
This document describes the end-to-end technical architecture of a modern e‑commerce web application. The solution enables users to discover products, view detailed information, manage a cart, and complete a mock checkout with order creation and simulated payment. The architecture emphasizes a clean, responsive frontend; a modular, maintainable backend; and a cloud-hosted MongoDB database.

Primary goals:
- Deliver a performant, responsive SPA for browsing and purchasing.
- Keep backend modular and lightweight, with clear separation of concerns.
- Use a managed database (MongoDB Atlas) for ease of operations and scalability.
- Provide a realistic checkout abstraction that can be swapped to a real payment provider.


## 2. High-Level Architecture
- Frontend: React single-page application (Vite-based) with React Router. Interacts with the backend via RESTful JSON APIs over HTTPS.
- Backend: Node.js/Express server. Concerns split across routes, controllers, services, and Mongoose models.
- Database: MongoDB Atlas (managed). Product and order data persisted with Mongoose schemas.
- Payment: Mock provider behind a service abstraction; easily replaceable with Stripe/Razorpay.
- Deployment: Frontend and backend can be deployed independently (e.g., Vercel/Netlify for SPA, Render/Heroku/AWS for API). Secrets provided via environment variables.

Data flow (typical read path):
Browser → React Router → API client (fetch) → Express route → Controller → Service → MongoDB (via Mongoose) → Response → UI.


## 3. Functional Scope
- Product listing with pagination and optional filters (category, search).
- Product details with pricing, stock, and images.
- Client-side cart: add/remove/update quantity/clear; persisted in localStorage.
- Checkout: order creation from cart, mock payment intent, payment confirmation, and confirmation page.


## 4. Non-Functional Requirements
- UI/UX: Clean, modern, responsive; accessible with keyboard navigation and readable contrasts.
- Performance: Fast initial load (Vite + code-splitting ready), responsive UI updates, cached data possible in future.
- Reliability: Centralized error handling; backend validation of totals; clear failure paths in payment.
- Security (basic): HTTPS, input validation, CORS restricted to known origin, environment-managed secrets.
- Maintainability: Modular code organization; clear boundaries; human-readable code; lints and formatters available.


## 5. Frontend Architecture
### 5.1 Tech
- React 18 (SPA), React Router 6, Context API for cart, Vite (bundler/dev server), plain CSS (global stylesheet).

### 5.2 Structure
```
frontend/
  src/
    App.jsx                 // Routes and global layout
    main.jsx                // App bootstrap with BrowserRouter + providers
    components/             // Navbar, Footer, ProductCard, etc.
    pages/                  // Home, ProductList, ProductDetails, Cart, Checkout, Payment, OrderConfirmation
    context/                // CartContext (useReducer + localStorage)
    services/               // api.js (REST client)
    styles/                 // globals.css (tokens & components)
```

### 5.3 Routing
- `/` Home
- `/products` Product listing (supports query params for pagination/filters)
- `/products/:productId` Product details (ObjectId or slug)
- `/cart` Cart review and edits
- `/checkout` Checkout form and order summary
- `/payment` Mock payment page
- `/order-confirmation/:orderId` Confirmation page
- `*` NotFound fallback

### 5.4 State & Data Fetching
- Cart state via `CartContext` + `useReducer`.
- Persistence to localStorage under a namespaced key.
- API access through `services/api.js` (base URL via `VITE_API_BASE_URL` env var).

### 5.5 Styling
- Global CSS (`globals.css`) with tokens (colors, spacing, typography).
- Component-scoped classes (e.g., `.product-card`, `.details`, `.cart-summary`).
- Responsive breakpoints (primarily mobile at 640px) and fluid utilities (`clamp`, `auto-fit` grids).


## 6. Backend Architecture
### 6.1 Tech
- Node.js 18, Express 4, Mongoose 8, CORS, Morgan, Dotenv.

### 6.2 Structure
```
backend/
  server.js                  // Express bootstrap, middleware, route mounting, startup
  config/
    db.js                    // MongoDB (Mongoose) connection helper
  controllers/
    productController.js     // List, detail, CRUD
    checkoutController.js    // Order creation + payment confirmation
    orderController.js       // Read-only order retrieval
  middleware/
    errorHandler.js          // notFound + errorHandler
  models/
    Product.js               // Product schema
    Order.js                 // Order schema
  routes/
    productRoutes.js         // /api/products
    checkoutRoutes.js        // /api/checkout
    orderRoutes.js           // /api/orders
  services/
    paymentService.js        // Mock payment provider abstraction
```

### 6.3 Middleware
- `express.json()` to parse JSON payloads.
- `cors` with `CLIENT_ORIGIN` from env.
- `morgan` for request logging.
- `notFound` and `errorHandler` for consistent error responses.

### 6.4 MongoDB Connection
- Central `connectDB(uri)` initializes a single Mongoose connection.
- `MONGODB_URI` stores full Atlas URI; optional `MONGODB_DB` can override the dbName.
- Graceful shutdown closes the connection on SIGINT/SIGTERM.


## 7. Data Models
### 7.1 Product
Fields (subset):
- `name` (String, required), `slug` (String, unique, required), `description`, `shortDescription`
- `price` (Number, required), `currency` (String, default `USD`)
- `images` (String[]), `imageUrl` (String)
- `category` (ObjectId, ref `Category`, optional)
- `stock` (Number, default 0), `isActive` (Boolean, default true)
- `tags` (String[]), `specs` ([{ key, value }])
- `timestamps` (createdAt, updatedAt)

### 7.2 Order
Fields:
- `items`: `[{ productId, name, price, quantity, image }]` snapshot
- `subtotal`, `tax`, `totalAmount`, `currency`
- `status`: `PENDING | PAID | FAILED`
- `paymentProvider`, `paymentIntentId`
- `customerEmail` (optional), `customer` sub-doc: `{ name, email, address }`
- `timestamps`


## 8. API Design
### 8.1 Products
- `GET /api/products` → list with pagination and optional filters (`page`, `limit`, `search`, `category`)
- `GET /api/products/:id` → product by ObjectId or slug
- (Optional) `POST/PUT/DELETE` for admin

Requests/Responses:
- List response: `{ items, page, pageSize, totalItems, totalPages }`
- Detail response: full product document (with populated category subset if available)

### 8.2 Checkout & Payment (Mock)
- `POST /api/checkout/create-order`
  - Body: `{ items: [{ productId, quantity }], customer: { name, email, address } }`
  - Server retrieves products, validates availability, calculates `subtotal`, `tax`, `totalAmount`, creates `Order` (PENDING), calls `paymentService.createPaymentIntent`, returns `{ orderId, clientSecret, totalAmount, currency }`.
- `POST /api/checkout/confirm`
  - Body: `{ orderId, paymentStatus, paymentPayload? }`
  - Server calls `paymentService.confirmPayment`, updates `Order.status`→ `PAID` or `FAILED`, returns updated order.
- `GET /api/orders/:id` → returns order for confirmation page.


## 9. Payment Service Abstraction
`services/paymentService.js` exposes:
- `createPaymentIntent({ amount, currency, metadata })` → `{ id, clientSecret, provider }`
- `confirmPayment(paymentIntentId, payload)` → `{ success, provider, raw }`

This mock simulates async gateway behavior. Replacing with Stripe/Razorpay involves wiring actual SDK calls while preserving the interface.


## 10. Validation & Security
- Validate all user inputs server-side (IDs, quantities, required fields).
- Never trust price/total from the client; compute on the server.
- Restrict CORS to `CLIENT_ORIGIN`.
- Use environment variables for secrets (never expose them to frontend).
- Sanitize logs and return consistent JSON errors (`{ message }`; stack in non-prod only).
- Rate limiting and auth (JWT/session) are recommended for production.


## 11. Error Handling
- Express global error handler sets proper HTTP status (default 500) with JSON message.
- 404 handled by a `notFound` middleware for unknown routes.
- Frontend shows contextual error UIs (alerts, skeletons, retry).


## 12. Performance & Scalability
- Frontend:
  - Vite dev server for speed; production builds are optimized.
  - Responsive, mobile-first CSS using `auto-fit` grids and `clamp` for typography.
  - Potential optimization: integrate React Query for cache and SWR patterns.
- Backend:
  - Mongoose connection pooling to Atlas.
  - Pagination and selective field projection (`.select`) on list endpoints.
  - Potential caching layer for popular products (memory/Redis).
- Database:
  - Use indexes for `slug`, `name` (text index if full-text search desired), and foreign keys if needed.


## 13. Observability
- Request logging via `morgan`.
- Structured error logs with messages and stack traces (non-prod).
- Health check endpoint: `GET /api/health` returns `{ status: 'ok' }` plus uptime.
- Future: integrate metrics (Prometheus), tracing (OpenTelemetry), and centralized logging.


## 14. Deployment Considerations
- Separate deploys for frontend (static host) and backend (Node host).
- Configure `VITE_API_BASE_URL` in frontend environment for production API URL.
- Configure backend `MONGODB_URI`, `CLIENT_ORIGIN`, and payment provider secrets via environment variables.
- TLS termination via platform (e.g., managed HTTPS).


## 15. Risks & Mitigations
- Payment correctness: Mock provider not validating cards → replace with real gateway, verify signatures/webhooks.
- Inventory accuracy: No stock reservation → add decrement-on-payment and compensating actions on failure.
- Security posture: Basic CORS/validation → add auth, rate limiting, input sanitization, and security headers (helmet).
- Data growth: Unindexed queries → ensure indexes on common filters and slugs; monitor slow queries.


## 16. Roadmap & Enhancements
- Authentication/Accounts: user profiles, address book, order history.
- Admin: product and inventory management, categories, media uploads.
- Real Payments: Stripe/Razorpay integration, webhooks, receipt emails.
- Promotions: coupons, discounts, related products, recommendations.
- Internationalization: currency switching, localized content, tax rules.
- Testing/QA: unit tests (Jest), integration tests (Supertest/RTL), CI pipelines.


## 17. Appendix – Example Sequences
### 17.1 Browse Products
1. User visits `/products`.
2. Frontend calls `GET /api/products?page=1&limit=12`.
3. Backend queries MongoDB with pagination and returns `{ items, page, pageSize, totalItems }`.
4. Frontend renders grid; skeletons used while loading.

### 17.2 View Product Details
1. User navigates to `/products/:productId`.
2. Frontend calls `GET /api/products/:productId`.
3. Backend returns product data (with optional category subset).
4. Frontend displays details, price, stock, and images.

### 17.3 Checkout & Payment (Mock)
1. User proceeds from cart to `/checkout` and submits name/email/address.
2. Frontend calls `POST /api/checkout/create-order` with `{ items: [{ productId, quantity }], customer }`.
3. Backend validates items, calculates totals, creates order (PENDING), and returns `{ orderId, clientSecret, totalAmount }`.
4. Frontend navigates to `/payment` and displays a mock card form.
5. On submit, frontend calls `POST /api/checkout/confirm` with `{ orderId, paymentStatus: 'success' }`.
6. Backend updates order status to `PAID` and returns the updated order.
7. Frontend shows `/order-confirmation/:orderId` with final status and totals.


