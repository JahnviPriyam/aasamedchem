# AasaMedChem — Lightweight Inventory & Order Demo

Simple, beginner-friendly Next.js demo that implements a small inventory and order workflow for three roles: Admin, Buyer, and Seller. State is persisted in the browser using `localStorage` so you can test end-to-end flows without a backend.

**Tech stack**
- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Quick links (routes)**
- `/login` — choose a role: `ADMIN`, `BUYER`, or `SELLER` (stored in `localStorage.role`)
- `/admin` — Admin dashboard and links
- `/admin/products` — Admin product management (add / edit / delete)
- `/admin/requests` — Product requests (approve / reject)
- `/admin/notifications` — Notifications created by admin actions
- `/buyer/products` — Buyer product listing and Order action
- `/buyer/order` — Buyer order page (reads `?product=...`)
- `/buyer/request` — Buyer can request a product
- `/buyer/orders` — Buyer order history
- `/seller/inventory` — Seller inventory management (adjust stock / delete)
- `/seller/orders` — Seller order management (update status)

## Data model (stored in localStorage)
The app stores everything client-side in `localStorage` using these keys:
- `products` — array of product objects { name, price, stock, unit }
- `requests` — array of request objects { product, quantity, notes, status }
- `orders` — array of order objects { productName, quantity, unit, totalPrice, status, createdAt }
- `notifications` — array of { message, createdAt }
- `role` — string role selected at login (`ADMIN` | `BUYER` | `SELLER`)

All pages listen for a lightweight event `localdatachange` (dispatched by pages when they update localStorage) and for the `storage` event so multiple areas of the app update immediately when data changes.

## Key features and business logic
- Role-based flows (client-side): simple role stored in `localStorage.role`. Pages are guarded by a `RequireRole` client component.
- Buyer request → Admin approve → Product creation (or merge): when Admin approves a buyer request, the request status is updated and the requested product is automatically created in `localStorage.products` (price defaults to `0`). If a product with the same name exists, the code can merge stock (increment) when numeric quantities and units match.
- Orders: Buyers place orders; orders are saved to `localStorage.orders` with full details and `createdAt`. Sellers see orders and can update status to `Processing`, `Shipped`, or `Delivered`. Updates persist and are visible to buyers.
- Inventory and product management: Admin and Seller can add, edit, and delete products. Deletions update `localStorage` and all dependent pages refresh via the event system.
- Simple unit handling: conversions exist for kg ↔ g and L ↔ mL in `lib/conversions.ts` and are used when calculating price per base unit.

## How to run
1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open http://localhost:3000 and go to `/login` to pick a role.

## Quick manual tests (smoke tests)
Use these to verify important flows:

- Flow: Request → Approval → Product
  1. As Buyer: `/buyer/request` submit a request (e.g. `Hydrochloric Acid`, `2 L`).
 2. As Admin: `/admin/requests` click Approve. The request status should become `Approved` and a product should be created in `localStorage.products`. Check `/admin/products` to see the new product.

- Flow: Add / Delete product
  1. As Admin: `/admin/products` add a product.
 2. As Buyer: `/buyer/products` verify it appears.
 3. As Seller: `/seller/inventory` verify it appears.
 4. Delete the product (Admin or Seller) — it should disappear everywhere.

- Flow: Order lifecycle
  1. As Buyer: `/buyer/products` click Order and place an order.
 2. As Seller: `/seller/orders` verify the order appears and change status to `Processing` → `Shipped` → `Delivered`.
 3. As Buyer: `/buyer/orders` the status updates should reflect immediately.

## Developer notes
- Use the `localdatachange` event to notify other pages in the same tab after updating `localStorage` (the app uses `window.dispatchEvent(new Event('localdatachange'))`). The `storage` event covers cross-tab updates.
- Keep `"use client"` on any component/page that uses browser APIs (`localStorage`, `useState`, `useEffect`, `useRouter`, event handlers), otherwise Next App Router will throw build/runtime errors.
- The codebase favors simple, readable implementations rather than production-grade patterns — this is intentional for learning and quick iteration.

## Files of interest
- `app/layout.tsx` — global layout and client `Sidebar` injection
- `components/RequireRole.tsx` — client-side role guard
- `components/Sidebar.tsx` — role-aware sidebar that hides on `/login`
- `app/admin/*`, `app/buyer/*`, `app/seller/*` — main pages and flows
- `lib/conversions.ts` — unit conversion helpers used by order calculations

## Next improvements (suggested)
- Add unit normalization (kg ↔ g, L ↔ mL) when merging stocks automatically.
- Replace ad-hoc `localdatachange` event with a small React Context for app state.
- Add minimal confirmation modals for destructive actions (delete/approve).
- Add type interfaces (`Product`, `Order`, `Request`) and tighten typings across files.

If you want, I can add one of the suggested improvements next (unit normalization, context state, confirmations, or stricter TypeScript). Feel free to pick.

## Project Overview

AasaMedChem is a lightweight inventory and order demo built with Next.js and TypeScript. It demonstrates role-based UI flows for three roles (Admin, Seller, Buyer) and keeps application state in the browser (`localStorage`) for quick testing. The repository also contains a Prisma schema intended for a Neon PostgreSQL backend if you want to move from localStorage to a real database.

## Features
- Role-based access and navigation (Admin / Seller / Buyer)
- Product management (create, edit, delete)
- Buyer product listing, search, and ordering (with unit selection and price calculation)
- Buyer product requests and Admin approval flow (approving a request can create or merge a product)
- Seller inventory management and order status updates
- Lightweight event sync (`localdatachange` + `storage`) to update UI across components and tabs

## Roles
- **Admin**: Manage products, view and approve requests, view notifications, and see dashboard counts.
- **Seller**: Manage inventory and orders (update order status).
- **Buyer**: Browse products, place orders or requests, view order history.

## Unit conversion strategy

This project uses a canonical base unit strategy for internal storage and calculations to keep conversions consistent:

- Weight: store in grams (`g`) as the base unit. 1 kg = 1000 g.
- Volume: store in milliliters (`mL`) as the base unit. 1 L = 1000 mL.
- Count: store as `item` (unit / count) — integer-like base unit.

Products store two important numeric fields relevant to conversions:
- `stockQuantity` — the available quantity expressed in the product's `baseUnit` (for example, grams for weight-based products).
- `pricePerBaseUnit` — price stored as INR per base unit (for example, INR per gram or INR per mL). This makes price calculation straightforward: total = pricePerBaseUnit * orderedQuantityInBaseUnit.

Conversion handling in code:
- When the UI accepts an entered quantity in a non-base unit (for example, Buyer enters `2 kg`), the frontend converts that value to the base unit (2 kg → 2000 g) before sending it to any storage or server logic.
- When displaying prices to users, the UI formats values as INR and converts the underlying base-unit price to a user-friendly unit when necessary (for example, showing ₹500/kg by deriving pricePerBaseUnit × 1000).

Conversion factors (documented):
- 1 kg = 1000 g
- 1 L = 1000 mL

See `lib/conversions.ts` for conversion helper functions used by the Buyer order page.

## Database schema explanation (Prisma)

This repo includes a `prisma/schema.prisma` file that models a realistic backend schema if you decide to use Neon PostgreSQL. Key models:

- `User` — stores `id`, `name`, `email`, `password`, and `role` (enum: `ADMIN`, `SELLER`, `BUYER`). Passwords must be hashed when using a real DB.
- `Product` — stores `id`, `name`, optional `description`, `baseUnit` (string like `g`, `mL`, `item`), `stockQuantity` (Decimal), and `pricePerBaseUnit` (Decimal). Use PostgreSQL `NUMERIC`/`DECIMAL` to retain high precision.
- `Order` — stores buyer info, `productName`, `enteredQuantity` and `enteredUnit` (what the user entered), `convertedQuantity` (in base unit), `totalPrice`, and `status`.
- `ProductRequest` — stores requests from buyers with `productName`, `quantity`, `unit`, optional `notes`, and `status`.
- `Notification` — stores notification `message` and `isRead` flag.

Notes about numeric types and precision:
- Use PostgreSQL `NUMERIC(30, 6)` (or similar) for `pricePerBaseUnit`, `stockQuantity`, and quantity-related fields to support high precision (up to 6 decimal places) and very large totals. Prisma's `Decimal` maps to PostgreSQL `NUMERIC`.
- When moving to a DB backend, store quantities in the base unit (g/mL/item) and prices as price-per-base-unit (INR per g, INR per mL, INR per item). This avoids repeated conversions and rounding errors on aggregation.

## Tech stack
- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
- ORM / DB (optional): Prisma + Neon PostgreSQL
- Deployment: Vercel

## Deployment steps (Vercel + Neon)

1. Create a Neon PostgreSQL database and get the connection URL (Neon provides a connection string).
2. Add the connection string to a `.env` (local) and to Vercel environment variables. Example local `.env`:

```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"
```

3. Update `prisma/schema.prisma` datasource `url` to use `env("DATABASE_URL")` (already typical in Prisma projects).
4. Run migrations locally (for development):

```bash
npx prisma migrate dev --name init
```

5. Push code to GitHub and connect the repository to Vercel. In the Vercel dashboard, set the `DATABASE_URL` environment variable to the Neon connection string.
6. Add any other secrets (for example, `SESSION_SECRET`) as environment variables if you implement server sessions.
7. Deploy. Vercel will build the app and create a live URL.

## How to run locally

1. Install dependencies

```bash
npm install
```

2. Prepare environment variables (local `.env`) — see `DATABASE_URL` example above.

3. (Optional, if using Prisma) Run migrations and generate the client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 and go to `/login` to pick a role or use demo users.

## Testing flows on Vercel (manual checklist)

After deployment to Vercel, verify end-to-end flows using this checklist:

1. Admin login
  - Navigate to `/login` and log in as the Admin demo user (username: `admin`, password: `admin123`).
  - Expect redirect to `/admin` dashboard.

2. Add product (Admin)
  - Open `/admin/products` and add a new product (choose a base unit like `kg` or `g`).
  - Expect the product to appear in the product list.

3. Buyer can see product
  - Login as Buyer (or open an incognito window) and go to `/buyer/products`.
  - Verify the product added by Admin is visible with price and unit.

4. Buyer places order/request
  - From `/buyer/products`, click Order and place an order for the product (enter quantity in any supported unit).
  - Expect order to be saved and visible in `/buyer/orders`.

5. Admin approves (requests)
  - If you created a request, go to `/admin/requests` and click Approve on the pending request.
  - Expect the request status to change to `Approved` and the product to be created (if not present) or merged (if present).

6. Seller sees order
  - Log in as Seller and open `/seller/orders`.
  - Verify the new order appears with correct converted quantity and calculated price.

7. Seller updates status
  - In `/seller/orders` change the order status (Processing → Shipped → Delivered).
  - Expect status updates to persist and notify buyer (via UI refresh/localdatachange).

8. Buyer sees updated status
  - Return to `/buyer/orders` and verify the order status updated accordingly.

Document any failures or unexpected behavior so you can iterate on fixes.

## Notes and next steps
- This repository currently includes both a simple frontend-only `localStorage` implementation and a Prisma schema for a database-backed implementation. Choose which mode you want to run: quick local demo (no DB) or full DB-backed deployment (Neon + Prisma).
- If you want, I can implement the full Neon + Prisma backend and server-side authentication (hashed passwords + secure sessions) and wire it into the frontend so the Vercel deployment is fully end-to-end. Tell me if you want me to proceed with that work.
