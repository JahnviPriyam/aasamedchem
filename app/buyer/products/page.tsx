"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RequireRole from "../../../components/RequireRole";

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("products");
      if (raw) {
        const parsed = JSON.parse(raw);
        const list = parsed.map((p: any, i: number) => ({
          id: i + 1,
          name: p.name || `Product ${i + 1}`,
          price: p.price || 0,
          unit: p.unit || "kg",
        }));
        setProducts(list);
        return;
      }
    } catch (e) {}
    setProducts([]);
  }, []);

  useEffect(() => {
    function onChange() {
      try {
        const raw = localStorage.getItem("products");
        if (raw) {
          const parsed = JSON.parse(raw);
          const list = parsed.map((p: any, i: number) => ({
            id: i + 1,
            name: p.name || `Product ${i + 1}`,
            price: p.price || 0,
            unit: p.unit || "kg",
          }));
          setProducts(list);
        } else setProducts([]);
      } catch (e) {}
    }

    window.addEventListener("localdatachange", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("localdatachange", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RequireRole role="BUYER">
      <div className="p-6">
      <h1 className="text-2xl font-bold">
        Products
      </h1>

      <input
        className="border p-2 mt-4"
        placeholder="Search Product"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mt-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="card-bg card-shadow rounded p-4 mb-4">
              <h2>{product.name}</h2>

              <p className="mt-2 text-theme">₹{product.price}/{product.unit}</p>

              <button
                className="btn-primary px-3 py-1 mt-3 rounded"
                onClick={() =>
                  router.push(
                    `/buyer/order?product=${encodeURIComponent(product.name)}`
                  )
                }
              >
                Order
              </button>
            </div>
          ))
        ) : (
          <div>
            <p>Product not found</p>

            <a
              href="/buyer/request"
              className="underline"
            >
              Request Product
            </a>
          </div>
        )}
      </div>
      </div>
    </RequireRole>
  );
}