"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  role?: string;
  allowedRoles?: string[];
  children: any;
};

export default function RequireRole({ role, allowedRoles, children }: Props) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    try {
      const r = localStorage.getItem("role");
      // not logged in
      if (!r) {
        router.replace("/login");
        return;
      }

      // check single-role prop (backwards compatible) or allowedRoles
      if (role) {
        if (r !== role) {
          router.replace("/login");
          return;
        }
      } else if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(r)) {
          router.replace("/login");
          return;
        }
      }

      setOk(true);
    } catch (e) {
      router.replace("/login");
    }
  }, [role, allowedRoles, router]);

  if (!ok) return null;

  return children;
}
