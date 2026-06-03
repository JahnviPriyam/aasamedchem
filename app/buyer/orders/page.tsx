"use client";

import { useEffect, useState } from "react";
import RequireRole from "../../../components/RequireRole";

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("orders");
      const parsed = raw ? JSON.parse(raw) : [];
      setOrders(parsed);
    } catch (e) {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    function onChange() {
      try {
        const raw = localStorage.getItem("orders");
        const parsed = raw ? JSON.parse(raw) : [];
        setOrders(parsed);
      } catch (e) {
        setOrders([]);
      }
    }

    window.addEventListener("localdatachange", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("localdatachange", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return (
    <RequireRole role="BUYER">
      <div className="p-6">
        <h1 className="text-3xl font-bold">My Orders</h1>

        <div className="mt-4">
          {orders.length === 0 && <p>No orders yet.</p>}

          {orders.map((o, i) => (
            <div key={i} className="card-bg card-shadow rounded p-4 mt-3">
              <div className="flex justify-between">
                <h2 className="font-semibold">{o.productName}</h2>
                <span className="text-sm text-theme">{new Date(o.createdAt).toLocaleString()}</span>
              </div>
              <p>Quantity: {o.quantity} {o.unit}</p>
              <p>Total: ₹{o.totalPrice}</p>
              <p>Status: {o.status}</p>
            </div>
          ))}
        </div>
      </div>
    </RequireRole>
  );
}
