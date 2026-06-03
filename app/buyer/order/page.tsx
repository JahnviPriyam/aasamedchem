"use client";

import { useState, useEffect } from "react";

import {
  convertToBaseUnit,
  getBaseUnit,
  calculatePrice,
} from "../../../lib/conversions";

import RequireRole from "../../../components/RequireRole";

export default function OrderPage() {
  // read query params from window on client and load products from localStorage
  const [products, setProducts] = useState<any[]>([]);
  const [foundProduct, setFoundProduct] = useState<any | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("g");

  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const p = sp.get("product");

      const raw = localStorage.getItem("products");
      const parsed = raw ? JSON.parse(raw) : [];
      setProducts(parsed.map((x: any, i: number) => ({ id: i + 1, ...x })));

      if (p) {
        setSelected(p);
        const match = parsed.find((x: any) => x.name === p) || null;
        setFoundProduct(match);
        if (match && match.unit) setUnit(match.unit);
      }
    } catch (e) {
      setProducts([]);
      setFoundProduct(null);
    }
  }, []);

  const product = foundProduct;

  // handle missing product
  if (!product) {
    return (
      <RequireRole role="BUYER">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-theme">Order Product</h1>
          <div className="mt-4">Product not found</div>
        </div>
      </RequireRole>
    );
  }

  // price per base unit (g or mL)
  const pricePerBaseUnit =
    product.unit === "kg" || product.unit === "L"
      ? product.price / 1000
      : product.price;

  const converted = convertToBaseUnit(quantity, unit);

  const total = calculatePrice(converted, pricePerBaseUnit);

  return (
    <RequireRole role="BUYER">
      <div className="p-6">

      <h1 className="text-2xl font-bold text-theme">Order Product</h1>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div className="card-bg card-shadow rounded p-4">
          <label className="block text-theme">Product</label>
          <select
            className="border p-2 w-full mt-2"
            value={selected || ""}
            onChange={(e) => {
              const val = e.target.value;
              setSelected(val);
              const match = products.find((x) => x.name === val) || null;
              setFoundProduct(match);
              if (match && match.unit) setUnit(match.unit);
            }}
          >
            {products.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>

          <p className="mt-3 text-theme">Price: ₹{product.price}/{product.unit}</p>
        </div>

        <div className="card-bg card-shadow rounded p-4">
          <label className="block text-theme">Quantity</label>
          <input type="number" className="border p-2 w-full mt-2" placeholder="Quantity" onChange={(e) => setQuantity(Number(e.target.value))} />

          <label className="block text-theme mt-3">Unit</label>
          <select className="border p-2 w-full mt-2" value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option>g</option>
            <option>kg</option>
            <option>mL</option>
            <option>L</option>
            <option>item</option>
          </select>

          <div className="mt-4">
            <p className="text-theme">Converted: {converted} {getBaseUnit(unit)}</p>
            <p className="text-theme">Total: ₹{total}</p>

            <button className="btn-primary px-4 py-2 mt-4 rounded" onClick={() => {
              try {
                const order = {
                  productName: selected,
                  quantity: Number(quantity),
                  unit: unit,
                  totalPrice: Number(total),
                  status: "Pending",
                  createdAt: new Date().toISOString(),
                };
                const raw = localStorage.getItem("orders");
                const arr = raw ? JSON.parse(raw) : [];
                arr.push(order);
                localStorage.setItem("orders", JSON.stringify(arr));
                alert("Order placed successfully.");
              } catch (e) {
                alert("Failed to place order.");
              }
            }}>Place Order</button>
          </div>
        </div>
      </div>
      </div>

    </RequireRole>
  );
}