"use client";

import { useEffect, useState } from "react";
import RequireRole from "../../../components/RequireRole";

export default function ProductsPage() {
  const [products, setProducts] = useState([
    { name: "Acetone", price: 500, stock: 50, unit: "kg" },
  ]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("kg");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("products");
      if (raw) setProducts(JSON.parse(raw));
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(products));
      try { window.dispatchEvent(new Event("localdatachange")); } catch(e) {}
    } catch (e) {}
  }, [products]);

  function addProduct() {
    if (!name) return;

    setProducts([
      ...products,
      {
        name,
        price: Number(price || 0),
        stock: Number(stock || 0),
        unit,
      },
    ]);

    setName("");
    setPrice("");
    setStock("");
  }

  function deleteProduct(i: number) {
    const copy = products.filter((_, idx) => idx !== i);
    setProducts(copy);
    try { window.dispatchEvent(new Event("localdatachange")); } catch(e) {}
  }

  function startEdit(i: number) {
    const p = products[i];
    setName(p.name || "");
    setPrice(String(p.price || 0));
    setStock(String(p.stock || 0));
    setUnit(p.unit || "kg");
    // reuse addProduct form for edit by pre-filling and deleting original
    deleteProduct(i);
  }

  return (
    <RequireRole role="ADMIN">
      <div className="p-6">
      <h1 className="text-3xl font-bold">Products</h1>

      <div className="mt-4 flex flex-col gap-2 max-w-md">

        <input
          placeholder="Product Name"
          className="border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Price (per kg or per unit)"
          className="border p-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          placeholder="Stock"
          className="border p-2"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <select
          className="border p-2"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option>kg</option>
          <option>g</option>
          <option>L</option>
          <option>mL</option>
          <option>item</option>
        </select>

        <button onClick={addProduct} className="border p-2">
          Add Product
        </button>

      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((product, index) => (
          <div key={index} className="card-bg card-shadow rounded p-3">
            <h2 className="font-semibold text-theme">{product.name}</h2>
            <p className="text-theme">₹{product.price}</p>
            <p className="text-theme">Stock: {product.stock} {product.unit}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => startEdit(index)} className="px-3 py-1 rounded btn-primary">Edit</button>
              <button onClick={() => deleteProduct(index)} className="px-3 py-1 rounded btn-primary">Delete</button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </RequireRole>
  );
}