"use client";

import RequireRole from "../../components/RequireRole";

export default function SellerDashboard() {
  return (
    <RequireRole role="SELLER">
      <div className="p-6">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/seller/inventory" className="card-bg card-shadow rounded p-4 block hover:underline">
            <h2 className="font-semibold text-theme">Inventory</h2>
          </a>

          <a href="/seller/orders" className="card-bg card-shadow rounded p-4 block hover:underline">
            <h2 className="font-semibold text-theme">Orders</h2>
          </a>
        </div>
      </div>
    </RequireRole>
  );
}