
---

## 2. New Text File: All Code Prompts in Order

Below is the content for a new root-level file, e.g.:

**`CODE_PROMPTS.md`**

```markdown
# Code Generation Prompts – E-Commerce Project

This file lists all **code-focused prompts** to generate the React + Node + MongoDB codebase.

Use them in order.

---

## 2B. Frontend Setup Code Prompt

> Now generate the **React frontend starter code** for the e-commerce project based on the architecture and documentation you described earlier.  
>   
> Requirements:  
> - Use either Create React App or Vite (choose one and be consistent).  
> - Provide code for:  
>   - `main.jsx` or `index.jsx` (ReactDOM render and `<BrowserRouter>` setup)  
>   - `App.jsx` with a basic layout and `<Routes>` placeholder  
>   - `components/Navbar.jsx` and `components/Footer.jsx`  
>   - Simple `pages/Home.jsx` that links to the products page  
> - Make the layout **clean and responsive** with simple CSS.  
> - Show a minimal `package.json` dependencies block.  
>   
> Output each file with:  
> ```text
> // filepath: frontend/src/...
> <code>
> ```

---

## 3B. Routing Code Prompt

> Generate the **React Router implementation** for this e-commerce project.  
>   
> Provide code for:  
> 1. Updated `App.jsx` with `<Routes>` and `<Route>` components configured for:  
>    - Home  
>    - ProductList  
>    - ProductDetails  
>    - Cart  
>    - NotFound  
> 2. Minimal implementations for:  
>    - `pages/ProductList.jsx`  
>    - `pages/ProductDetails.jsx` (reads `productId` from URL params)  
>    - `pages/Cart.jsx`  
>    - `pages/NotFound.jsx`  
> 3. Update `Navbar.jsx` to use `<Link>` or `<NavLink>` for navigation.  
>   
> Use simple placeholders in each page (e.g., “Product List Page”) so I can see navigation working. Output code file-by-file.

---

## 4B. Product UI Code Prompt

> Generate the **React components** for the product listing and product details pages for this e-commerce project.  
>   
> Requirements:  
> 1. `components/ProductCard.jsx` to display a single product in the grid (props: product object).  
> 2. `pages/ProductList.jsx` that:  
>    - Fetches product list from a configurable API endpoint (e.g., `import { getProducts } from '../services/api';`)  
>    - Uses `useEffect` and `useState` for loading & error states  
>    - Displays products in a responsive grid using `ProductCard`  
> 3. `pages/ProductDetails.jsx` that:  
>    - Reads `productId` from URL params  
>    - Fetches product details via `getProductById(productId)`  
>    - Shows image, name, price, description, and “Add to Cart” button  
> 4. A stubbed `services/api.js` file with placeholder `getProducts` and `getProductById` functions using `fetch` or `axios`.  
>   
> Ensure code is modular, readable, and uses basic responsive CSS.

---

## 5B. Cart State Code Prompt

> Implement **cart state management** in React for this e-commerce project.  
>   
> Requirements:  
> 1. Create `context/CartContext.jsx` that exports:  
>    - `CartProvider`  
>    - `useCart` hook  
> 2. Use either `useReducer` or `useState` to manage cart items. Each item should have:  
>    - `id`  
>    - `name`  
>    - `price`  
>    - `image` (optional)  
>    - `quantity`  
> 3. Implement actions:  
>    - `addToCart(product, quantity)`  
>    - `removeFromCart(productId)`  
>    - `updateQuantity(productId, quantity)`  
>    - `clearCart()`  
> 4. Wrap the app in `CartProvider` in `main.jsx` or `index.jsx`.  
> 5. Update:  
>    - `Navbar.jsx` to show total cart item count  
>    - `pages/ProductDetails.jsx` to use `addToCart`  
>    - `pages/Cart.jsx` to display cart items and allow quantity update and removal  
>   
> Also show a brief example of how to persist cart items in `localStorage` (optional but include). Output code file-by-file.

---

## 6B. Backend Setup Code Prompt

> Generate the **Node.js/Express backend skeleton code** for this e-commerce project.  
>   
> Provide code for:  
> 1. `backend/server.js` or `backend/app.js` with:  
>    - Express app  
>    - Middleware (JSON parsing, CORS)  
>    - Basic health check route (`/api/health`)  
>    - Error handling middleware  
> 2. `backend/config/db.js` with a function to connect to MongoDB Atlas using Mongoose.  
> 3. `backend/package.json` with dependencies (`express`, `mongoose`, `cors`, `dotenv`, `nodemon` dev dependency).  
> 4. Example `.env.example` showing `MONGODB_URI` and `PORT`.  
>   
> Output file-by-file with comments explaining important parts.

---

## 7B. Product API Code Prompt

> Implement the **Product model and API routes** for this e-commerce project.  
>   
> Provide code for:  
> 1. `models/Product.js` → Mongoose schema and model.  
> 2. `controllers/productController.js` with functions:  
>    - `getProducts`  
>    - `getProductById`  
>    - (optional) `createProduct`, `updateProduct`, `deleteProduct`  
> 3. `routes/productRoutes.js` to wire endpoints:  
>    - `GET /api/products`  
>    - `GET /api/products/:id`  
>    - (optional) POST/PUT/DELETE  
> 4. Update `server.js`/`app.js` to use `productRoutes` under `/api/products`.  
>   
> Ensure the code:  
> - Uses async/await and try/catch  
> - Returns proper HTTP status codes  
> - Is ready to connect with the React frontend’s `getProducts` and `getProductById` functions.  

---

## 8B. Integration Code Prompt

> Update the **frontend API client** to work with the real backend for this e-commerce project.  
>   
> Provide code for:  
> 1. `frontend/src/services/api.js` that reads a base URL from an environment variable and provides:  
>    - `getProducts()`  
>    - `getProductById(id)`  
> 2. Any necessary updates to `ProductList.jsx` and `ProductDetails.jsx` to use these functions.  
>   
> Include small comments to show where to configure the base URL for different environments.

---

## 9B. Key Styling Code Prompt

> Generate **CSS (or CSS Modules)** for the main layout and product grid for this e-commerce project.  
>   
> Provide styles for:  
> 1. `Navbar` (responsive, stacked on mobile)  
> 2. `Footer`  
> 3. Product grid (`ProductList` page) with 1–2 columns on mobile and 3–4 columns on desktop  
> 4. Product card styling (shadow, padding, image responsiveness)  
> 5. Basic styling for `Cart` page (list of items, summary section).  
>   
> Show which CSS file each component imports.

---

## 10B. Prompts Log Template Prompt

> Generate a **Prompts Log template** (Markdown table) for this project so I can document all prompts used.  
>   
> The table should have columns:  
> - `#`  
> - `Module`  
> - `Prompt Title`  
> - `Prompt Text (shortened)`  
> - `Output Type` (Architecture Doc / Code / README / Other)  
> - `Date Used`  
>   
> Provide a few example rows filled in for some of the prompts above.

---

## 11B. Checkout & Payment Code Prompt

> Implement the **basic Checkout and Payment module** for this e-commerce project, using a **mock payment gateway** (simulate success/failure without real money).  
>   
> ### Backend Requirements  
> 1. `models/Order.js`  
>    - Implement a Mongoose schema/model for `Order` with fields:  
>      - `items: [{ productId, name, price, quantity }]`  
>      - `subtotal`, `tax`, `totalAmount`, `currency`  
>      - `status` (`PENDING`, `PAID`, `FAILED`)  
>      - `paymentProvider` (string, e.g., `"mock"`)  
>      - `paymentIntentId` or `paymentOrderId` (string)  
>      - `customerEmail` (string, optional)  
>      - timestamps.  
> 2. `services/paymentService.js`  
>    - Export functions like:  
>      - `createPaymentIntent({ amount, currency })` → returns a mock `paymentIntentId` and a `clientSecret`.  
>      - `confirmPayment(paymentIntentId, mockPayload)` → simulate a success/failure boolean.  
>    - This should be a placeholder, but written like it can be replaced with Stripe/Razorpay later.  
> 3. `controllers/checkoutController.js`  
>    - `createOrderAndPaymentIntent(req, res)`  
>      - Accepts cart items and optional customer email.  
>      - Validates products and prices (query the DB for each `productId`).  
>      - Computes subtotal, tax, total.  
>      - Creates an `Order` with status `PENDING`.  
>      - Calls `paymentService.createPaymentIntent` to get payment details.  
>      - Returns JSON: `{ orderId, clientSecret, totalAmount }`.  
>    - `confirmPayment(req, res)`  
>      - Accepts `orderId` and a mock `paymentStatus` or payload.  
>      - Calls `paymentService.confirmPayment(...)` (or just trust payload for MVP).  
>      - Updates order status → `PAID` or `FAILED`.  
>      - Returns updated order object.  
> 4. `routes/checkoutRoutes.js`  
>    - `POST /api/checkout/create-order` → `checkoutController.createOrderAndPaymentIntent`  
>    - `POST /api/checkout/confirm` → `checkoutController.confirmPayment`  
> 5. Update `server.js` / `app.js` to mount `checkoutRoutes` under `/api/checkout`.  
>   
> Output all backend files **file-by-file with clear comments**, for example:  
> ```text
> // filepath: backend/models/Order.js
> <code>
> ```  
>   
> ### Frontend Requirements  
> 1. `pages/Checkout.jsx`  
>    - Reads cart items from `CartContext`.  
>    - Shows order summary (items and total).  
>    - Simple form: name, email, address (basic controlled inputs).  
>    - On “Place Order / Proceed to Payment”:  
>      - Calls `POST /api/checkout/create-order` via a new function `createOrder` in `services/api.js`.  
>      - Stores `orderId`, `clientSecret`, and `totalAmount` in local state or router state.  
>      - Navigates to `/payment` route with this data.  
> 2. `pages/Payment.jsx`  
>    - Receives `orderId` and `totalAmount` (via location state or URL params).  
>    - Shows a **mock payment form**: e.g., fake card number + “Pay Now” button.  
>    - On “Pay Now”:  
>      - Calls `POST /api/checkout/confirm` with `orderId` and a dummy `paymentStatus: 'success'`.  
>      - On success → navigate to `/order-confirmation/:orderId`.  
>      - On failure → show error and offer a retry or go back to cart.  
> 3. `pages/OrderConfirmation.jsx`  
>    - Fetches the order details by `orderId` (add `getOrderById(orderId)` in `services/api.js`, with a simple backend endpoint like `GET /api/orders/:id`).  
>    - Displays order summary and `status`.  
> 4. Routing Updates  
>    - Add routes in `App.jsx`:  
>      - `/checkout` → `Checkout`  
>      - `/payment` → `Payment`  
>      - `/order-confirmation/:orderId` → `OrderConfirmation`  
> 5. API Client Updates (`frontend/src/services/api.js`)  
>    - Add functions:  
>      - `createOrder(orderPayload)` → `POST /api/checkout/create-order`  
>      - `confirmPayment(orderId, paymentPayload)` → `POST /api/checkout/confirm`  
>      - `getOrderById(orderId)` → `GET /api/orders/:id` (also implement simple order route/controller on backend).  
>   
> The payment flow can be **mocked** — no real gateway integration needed — but the architecture should be realistic and easy to swap to a real provider later.  
> Output all frontend files file-by-file in the same structure as previous prompts.
