"use client";

import { useEffect, useState } from "react";
import RequireRole from "../../../components/RequireRole";

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("kg");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("products");
      const parsed = raw ? JSON.parse(raw) : [];
      setProducts(parsed);
    } catch (e) {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    function onChange() {
      try {
        const raw = localStorage.getItem("products");
        const parsed = raw ? JSON.parse(raw) : [];
        setProducts(parsed);
      } catch (e) {
        setProducts([]);
      }
    }

    window.addEventListener("localdatachange", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("localdatachange", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  function persist(list: any[]) {
    try {
      localStorage.setItem("products", JSON.stringify(list));
      setProducts(list);
    try { window.dispatchEvent(new Event("localdatachange")); } catch(e) {}
    } catch (e) {}
  }

  function addProduct() {
    const p = { name, price: Number(price || 0), stock: Number(stock || 0), unit };
    persist([...products, p]);
    setName(""); setPrice(""); setStock(""); setUnit("kg");
  }

  function startEdit(i: number) {
    const p = products[i];
    setEditingIndex(i);
    setName(p.name || ""); setPrice(String(p.price || 0)); setStock(String(p.stock || 0)); setUnit(p.unit || "kg");
  }

  function saveEdit() {
    if (editingIndex === null) return;
    const copy = [...products];
    copy[editingIndex] = { name, price: Number(price || 0), stock: Number(stock || 0), unit };
    persist(copy);
    setEditingIndex(null); setName(""); setPrice(""); setStock(""); setUnit("kg");
  }

  function deleteProduct(i: number) {
    const copy = products.filter((_, idx) => idx !== i);
    persist(copy);
  }

  return (
    <RequireRole role="SELLER">
      <div className="p-6">
        <h1 className="text-3xl font-bold">Seller Products</h1>

        <div className="mt-4 max-w-md">
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full" />
          <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 w-full mt-2" />
          <input placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="border p-2 w-full mt-2" />
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="border p-2 w-full mt-2">
            <option>kg</option>
            <option>g</option>
            <option>L</option>
            <option>mL</option>
            <option>item</option>
          </select>

          <div className="mt-2 flex gap-2">
            {editingIndex === null ? (
              <button onClick={addProduct} className="px-3 py-2 rounded btn-primary">Add Product</button>
            ) : (
              <>
                <button onClick={saveEdit} className="px-3 py-2 rounded btn-primary">Save</button>
                <button onClick={() => setEditingIndex(null)} className="px-3 py-2 rounded btn-primary">Cancel</button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((p, i) => (
            <div key={i} className="card-bg card-shadow rounded p-4">
              <h2 className="font-semibold text-theme">{p.name}</h2>
              <p className="text-theme">Price: ₹{p.price}</p>
              <p className="text-theme">Stock: {p.stock} {p.unit}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => startEdit(i)} className="px-3 py-1 rounded btn-primary">Edit</button>
                <button onClick={() => deleteProduct(i)} className="px-3 py-1 rounded btn-primary">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RequireRole>
  );
}
