"use client";

import { useEffect, useState } from "react";
import RequireRole from "../../../components/RequireRole";

export default function SellerOrdersPage() {
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

  function updateStatus(index: number, status: string) {
    const copy = [...orders];
    copy[index] = { ...copy[index], status };
    setOrders(copy);
    try {
      localStorage.setItem("orders", JSON.stringify(copy));
      try { window.dispatchEvent(new Event("localdatachange")); } catch(e) {}
    } catch (e) {}
  }

  return (
    <RequireRole role="SELLER">
      <div className="p-6">
        <h1 className="text-3xl font-bold">Seller Orders</h1>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Unit</th>
                <th className="px-4 py-2 text-left">Total Price</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-2">{o.productName}</td>
                  <td className="px-4 py-2">{o.quantity}</td>
                  <td className="px-4 py-2">{o.unit}</td>
                  <td className="px-4 py-2">₹{o.totalPrice}</td>
                  <td className="px-4 py-2">{o.status}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(i, "Processing")} className="px-2 py-1 rounded btn-primary">Processing</button>
                      <button onClick={() => updateStatus(i, "Shipped")} className="px-2 py-1 rounded btn-primary">Shipped</button>
                      <button onClick={() => updateStatus(i, "Delivered")} className="px-2 py-1 rounded btn-primary">Delivered</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RequireRole>
  );
}
