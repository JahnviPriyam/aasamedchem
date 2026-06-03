"use client";

import RequireRole from "../../components/RequireRole";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);

  function loadCounts() {
    try {
      const p = JSON.parse(localStorage.getItem("products") || "[]");
      const o = JSON.parse(localStorage.getItem("orders") || "[]");
      const r = JSON.parse(localStorage.getItem("requests") || "[]");
      const n = JSON.parse(localStorage.getItem("notifications") || "[]");
      setProductsCount(p.length);
      setOrdersCount(o.length);
      setPendingRequestsCount((r || []).filter((x: any) => x.status === "Pending").length);
      setNotificationsCount(n.length);
    } catch (e) {
      setProductsCount(0);
      setOrdersCount(0);
      setPendingRequestsCount(0);
      setNotificationsCount(0);
    }
  }

  useEffect(() => {
    loadCounts();

    function onChange() {
      loadCounts();
    }

    window.addEventListener("localdatachange", onChange);
    window.addEventListener("storage", onChange);

    return () => {
      window.removeEventListener("localdatachange", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return (
    <RequireRole role="ADMIN">
      <div className="p-6">
      <h1 className="text-3xl font-bold text-theme">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <a href="/admin/products" className="card-bg card-shadow rounded p-4 block">
          <h2 className="text-sm font-medium text-theme">Total Products</h2>
          <p className="text-2xl font-semibold text-theme">{productsCount}</p>
        </a>

        <a href="/admin/products" className="card-bg card-shadow rounded p-4 block">
          <h2 className="text-sm font-medium text-theme">Total Orders</h2>
          <p className="text-2xl font-semibold text-theme">{ordersCount}</p>
        </a>

        <a href="/admin/requests" className="card-bg card-shadow rounded p-4 block">
          <h2 className="text-sm font-medium text-theme">Pending Requests</h2>
          <p className="text-2xl font-semibold text-theme">{pendingRequestsCount}</p>
        </a>

        <a href="/admin/notifications" className="card-bg card-shadow rounded p-4 block">
          <h2 className="text-sm font-medium text-theme">Notifications</h2>
          <p className="text-2xl font-semibold text-theme">{notificationsCount}</p>
        </a>
      </div>

      <div className="mt-6 space-x-4">
        <a href="/admin/products" className="px-3 py-2 rounded inline-block hover:underline card-bg">Products</a>
        <a href="/admin/requests" className="px-3 py-2 rounded inline-block hover:underline card-bg">Requests</a>
        <a href="/admin/notifications" className="px-3 py-2 rounded inline-block hover:underline card-bg">Notifications</a>
      </div>
      </div>
    </RequireRole>
  );
}