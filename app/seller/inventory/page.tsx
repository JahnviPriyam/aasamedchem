"use client";

import { useEffect, useState } from "react";
import RequireRole from "../../../components/RequireRole";

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("products");
      const parsed = raw ? JSON.parse(raw) : [];
      setProducts(parsed.map((p: any, i: number) => ({ id: i, ...p })));
    } catch (e) {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    function onChange() {
      try {
        const raw = localStorage.getItem("products");
        const parsed = raw ? JSON.parse(raw) : [];
        setProducts(parsed.map((p: any, i: number) => ({ id: i, ...p })));
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

  function save(updated: any[]) {
    try {
      localStorage.setItem("products", JSON.stringify(updated));
      setProducts(updated.map((p: any, i: number) => ({ id: i, ...p })));
      try { window.dispatchEvent(new Event("localdatachange")); } catch(e) {}
    } catch (e) {}
  }

  function changeStock(idx: number, delta: number) {
    const copy = [...products];
    if (!copy[idx]) return;
    copy[idx].stock = (Number(copy[idx].stock || 0) + delta);
    save(copy.map((p: any) => ({ name: p.name, price: p.price, stock: p.stock, unit: p.unit })));
  }

  function deleteProduct(idx: number) {
    const copy = products.filter((_, i) => i !== idx);
    save(copy.map((p: any) => ({ name: p.name, price: p.price, stock: p.stock, unit: p.unit })));
  }

  return (
    <RequireRole role="SELLER">
      <div className="p-6">
        <h1 className="text-3xl font-bold">Inventory</h1>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product, index) => (
            <div key={index} className="card-bg card-shadow rounded p-4">
              <h2 className="font-semibold text-theme">{product.name}</h2>
              <p className="text-theme">Stock: {product.stock} {product.unit}</p>

              <div className="mt-3 flex gap-2">
                <button onClick={() => changeStock(index, 1)} className="px-3 py-1 rounded btn-primary">+1</button>
                <button onClick={() => changeStock(index, -1)} className="px-3 py-1 rounded btn-primary">-1</button>
                <button onClick={() => deleteProduct(index)} className="px-3 py-1 rounded btn-primary">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RequireRole>
  );
}