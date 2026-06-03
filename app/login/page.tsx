"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const user = username.trim();
    const pass = password;

    // predefined users
    const creds: Record<string, { password: string; role: string; redirect: string }> = {
      admin: { password: "admin123", role: "ADMIN", redirect: "/admin" },
      seller: { password: "seller123", role: "SELLER", redirect: "/seller" },
      buyer: { password: "buyer123", role: "BUYER", redirect: "/buyer" },
    };

    const found = creds[user.toLowerCase()];
    if (!found || found.password !== pass) {
      setError("Invalid username or password");
      return;
    }

    try {
      localStorage.setItem("role", found.role);
      localStorage.setItem("username", user);
      window.dispatchEvent(new Event("localdatachange"));
    } catch (e) {}

    router.push(found.redirect);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Login</h1>

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-sm">
        <label className="block mb-2">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 mb-4"
          placeholder="admin | seller | buyer"
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4"
          placeholder="password"
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" className="btn-primary px-4 py-2">Login</button>

          <button
            type="button"
            className="btn-primary px-4 py-2"
            onClick={() => {
              // quick demo admin credentials
              setUsername("admin");
              setPassword("admin123");
            }}
          >
            Demo Admin
          </button>

          <button
            type="button"
            className="btn-primary px-4 py-2"
            onClick={() => {
              // quick demo seller credentials
              setUsername("seller");
              setPassword("seller123");
            }}
          >
            Demo Seller
          </button>

          <button
            type="button"
            className="btn-primary px-4 py-2"
            onClick={() => {
              // quick demo buyer credentials
              setUsername("buyer");
              setPassword("buyer123");
            }}
          >
            Demo Buyer
          </button>
        </div>
      </form>
    </div>
  );
}