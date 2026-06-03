"use client";

import RequireRole from "../../components/RequireRole";

export default function BuyerDashboard() {
  return (
    <RequireRole role="BUYER">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-theme">Buyer Dashboard</h1>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a href="/buyer/products" className="card-bg card-shadow rounded p-4 block hover:underline">
            <h2 className="font-semibold text-theme">Products</h2>
          </a>

          <a href="/buyer/order" className="card-bg card-shadow rounded p-4 block hover:underline">
            <h2 className="font-semibold text-theme">Order</h2>
          </a>

          <a href="/buyer/request" className="card-bg card-shadow rounded p-4 block hover:underline">
            <h2 className="font-semibold text-theme">Request Product</h2>
          </a>
        </div>
      </div>
    </RequireRole>
  );
}