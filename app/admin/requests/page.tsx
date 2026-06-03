"use client";

import { useEffect, useState } from "react";
import RequireRole from "../../../components/RequireRole";

export default function RequestsPage() {
  const [requests, setRequests] = useState([
    { product: "Sodium Chloride", quantity: "5 kg", status: "Pending" },
    { product: "Hydrochloric Acid", quantity: "2 L", status: "Approved" },
  ]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("requests");
      if (raw) setRequests(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("requests", JSON.stringify(requests));
    } catch (e) {}
  }, [requests]);

  function approve(i: number) {
    const next = [...requests];
    next[i] = { ...next[i], status: "Approved" };
    setRequests(next);
    try {
      // derive product fields from request (use raw request values)
      const req: any = next[i];
      const name = (req.product || req.productName || req.name || "").toString().trim();
      // keep stock exactly as requested (string), try to extract unit if provided separately
      const stock = req.quantity || "";
      let unit = req.unit || "";
      if (!unit && typeof stock === "string") {
        const parts = stock.trim().split(/\s+/);
        if (parts.length > 1) unit = parts.slice(1).join(" ");
      }

      // load existing products
      const rawP = localStorage.getItem("products");
      const products = rawP ? JSON.parse(rawP) : [];

      const existsIndex = products.findIndex((p: any) => (p.name || "").toString().trim().toLowerCase() === name.toLowerCase());
      if (existsIndex === -1 && name) {
        products.push({ name, price: 0, stock, unit });
        localStorage.setItem("products", JSON.stringify(products));
        try { addNotification(`Product created from approved request: ${name}`); } catch(e) {}
        try { window.dispatchEvent(new Event("localdatachange")); } catch(e) {}
        try { setSuccessMessage("Product added successfully from approved request"); } catch(e) {}
      } else if (existsIndex > -1) {
        // merge: increase existing product stock when possible
        try {
          const existing = products[existsIndex];
          const reqQtyRaw = req.quantity;
          const reqQtyNum = typeof reqQtyRaw === 'string' ? parseFloat(reqQtyRaw) : Number(reqQtyRaw);
          const reqUnit = req.unit || (typeof reqQtyRaw === 'string' ? (reqQtyRaw.trim().split(/\s+/)[1] || '') : '');

          const prodStockRaw = existing.stock;
          const prodStockNum = typeof prodStockRaw === 'number' ? prodStockRaw : parseFloat(String(prodStockRaw || ''));
          const prodUnit = existing.unit || '';

          if (!isNaN(reqQtyNum) && !isNaN(prodStockNum) && (prodUnit === '' || prodUnit === reqUnit || reqUnit === '')) {
            existing.stock = prodStockNum + reqQtyNum;
            // ensure unit set
            existing.unit = prodUnit || reqUnit || existing.unit || '';
            products[existsIndex] = existing;
            localStorage.setItem("products", JSON.stringify(products));
            try { addNotification(`Product stock updated from approved request: ${name}`); } catch(e) {}
            try { window.dispatchEvent(new Event("localdatachange")); } catch(e) {}
            try { setSuccessMessage(`Product stock increased by ${reqQtyNum}`); } catch(e) {}
          } else {
            // fallback: do not merge numeric stock, just notify
            try { setSuccessMessage("Product exists — could not merge stock due to unit/format mismatch"); } catch(e) {}
          }
        } catch (e) {
          try { setSuccessMessage("Product exists — no changes made"); } catch(e) {}
        }
      } else {
        try { setSuccessMessage("Invalid request data — no product created"); } catch(e) {}
      }

      try { addNotification(`Request approved: ${next[i].product}`); } catch(e) {}
      try { window.dispatchEvent(new Event("localdatachange")); } catch(e) {}
    } catch(e) {}
  }

  function addNotification(message: string) {
    try {
      const raw = localStorage.getItem("notifications");
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({ message, createdAt: new Date().toISOString() });
      localStorage.setItem("notifications", JSON.stringify(arr));
    } catch (e) {}
  }

  function reject(i: number) {
    const next = [...requests];
    next[i] = { ...next[i], status: "Rejected" };
    setRequests(next);
    try { addNotification(`Request rejected: ${next[i].product}`); } catch(e) {}
    try { window.dispatchEvent(new Event("localdatachange")); } catch(e) {}
  }

  // broadcast change so dashboard and other pages update
  useEffect(() => {
    try {
      window.dispatchEvent(new Event("localdatachange"));
    } catch (e) {}
  }, [requests]);

  return (
    <RequireRole role="ADMIN">
      <div className="p-6">
        <h1 className="text-3xl font-bold">Product Requests</h1>

        {successMessage && <div className="mt-4 p-3 bg-green-100 text-theme rounded">{successMessage}</div>}

        {requests.map((request, index) => (
          <div key={index} className="card-bg card-shadow rounded p-4 mt-4">
            <h2 className="font-semibold text-theme">{request.product}</h2>

            <p className="text-theme">Quantity: {request.quantity}</p>

            <p className="text-theme">Status: {request.status}</p>

            {request.status !== "Approved" && (
              <button className="btn-primary px-3 py-1 mt-2 rounded" onClick={() => approve(index)}>
                Approve
              </button>
            )}
          </div>
        ))}
      </div>
    </RequireRole>
  );
}