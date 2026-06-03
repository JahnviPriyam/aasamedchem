"use client";

import { useState } from "react";
import RequireRole from "../../../components/RequireRole";

export default function RequestPage() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState("");

  function submit(e: any) {
    e.preventDefault();
    const req = { product: name, quantity: `${quantity} ${unit}`, notes, status: "Pending" };
    try {
      const raw = localStorage.getItem("requests");
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(req);
      localStorage.setItem("requests", JSON.stringify(arr));
      try { window.dispatchEvent(new Event("localdatachange")); } catch(e) {}
    } catch (err) {}

    setSuccess("Request submitted successfully.");
    setName("");
    setQuantity("");
    setNotes("");
  }

  return (
    <RequireRole role="BUYER">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Request Product</h1>

        <form className="flex flex-col gap-4 mt-4 max-w-md" onSubmit={submit}>

        <input
          placeholder="Product Name"
          className="border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Quantity"
          className="border p-2"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <select className="border p-2" value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option>g</option>
          <option>kg</option>
          <option>mL</option>
          <option>L</option>
          <option>item</option>
        </select>

        <textarea
          placeholder="Additional Notes"
          className="border p-2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button className="border p-2">Submit Request</button>

        {success && <p className="text-green-600">{success}</p>}

        </form>
      </div>
    </RequireRole>
  );
}