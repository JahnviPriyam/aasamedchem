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
