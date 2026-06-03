"use client";

import { useEffect, useState } from "react";
import RequireRole from "../../../components/RequireRole";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem("notifications");
        let parsed = raw ? JSON.parse(raw) : [];
        // normalize: allow stored values to be array of strings or array of objects
        if (!Array.isArray(parsed)) parsed = [];
        parsed = parsed.map((item: any) => {
          if (typeof item === "string") return { message: item, createdAt: null };
          if (item && typeof item === "object") return item;
          return { message: String(item), createdAt: null };
        });
        setNotifications(parsed);
      } catch (e) {
        setNotifications([]);
      }
    }

    load();
    window.addEventListener("localdatachange", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("localdatachange", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return (
    <RequireRole role="ADMIN">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Notifications</h1>

        <ul className="mt-4 space-y-2">
          {notifications.length === 0 && <li className="text-theme">No notifications</li>}
          {notifications.map((item: any, index: number) => (
            <li key={index} className="border p-2 rounded">
              🔔 {item.message} <span className="text-sm text-theme ml-2">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</span>
            </li>
          ))}
        </ul>
      </div>
    </RequireRole>
  );
}