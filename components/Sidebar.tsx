"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem("role");
      setRole(r);
      const u = localStorage.getItem("username");
      setUsername(u);
    } catch (e) {
      setRole(null);
    }
  }, [pathname]);

  // hide sidebar on login and root
  if (!pathname) return null;
  if (pathname === "/login" || pathname === "/") return null;

  // require a logged-in role
  if (!role) return null;

  // role is allowed — render role-specific links
  return (
    <aside className="w-64 sidebar-bg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">AasaMedChem</h2>
        <p className="text-sm mt-2">{username || "Guest"}</p>
        <p className="text-xs text-gray-400">{role}</p>
      </div>

      <nav className="space-y-4">
        {role === "ADMIN" && (
          <div>
            <p className="text-sm font-medium mb-2">Admin</p>
            <ul className="space-y-1">
              <li><a href="/admin" className="block px-3 py-2 rounded hover:underline">Dashboard</a></li>
              <li><a href="/admin/products" className="block px-3 py-2 rounded hover:underline">Products</a></li>
              <li><a href="/admin/requests" className="block px-3 py-2 rounded hover:underline">Requests</a></li>
              <li><a href="/admin/notifications" className="block px-3 py-2 rounded hover:underline">Notifications</a></li>
            </ul>
          </div>
        )}

        {role === "BUYER" && (
          <div>
            <p className="text-sm font-medium mb-2">Buyer</p>
            <ul className="space-y-1">
              <li><a href="/buyer" className="block px-3 py-2 rounded hover:underline">Dashboard</a></li>
              <li><a href="/buyer/products" className="block px-3 py-2 rounded hover:underline">Products</a></li>
              <li><a href="/buyer/order" className="block px-3 py-2 rounded hover:underline">Order</a></li>
              <li><a href="/buyer/request" className="block px-3 py-2 rounded hover:underline">Request Product</a></li>
            </ul>
          </div>
        )}

        {role === "SELLER" && (
          <div>
            <p className="text-sm font-medium mb-2">Seller</p>
            <ul className="space-y-1">
              <li><a href="/seller" className="block px-3 py-2 rounded hover:underline">Dashboard</a></li>
              <li><a href="/seller/inventory" className="block px-3 py-2 rounded hover:underline">Inventory</a></li>
              <li><a href="/seller/orders" className="block px-3 py-2 rounded hover:underline">Orders</a></li>
            </ul>
          </div>
        )}
      </nav>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
