"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    try {
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      window.dispatchEvent(new Event("localdatachange"));
    } catch (e) {}
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-6 w-full px-3 py-2 rounded btn-primary"
    >
      Logout
    </button>
  );
}
