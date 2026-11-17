"use client";

/**
 * useAuthGuard
 * Call at the top of any protected page/component.
 * If the user is not authenticated, redirects to /login?return=<current path>.
 *
 * Usage:
 *   const { ready } = useAuthGuard();
 *   if (!ready) return null; // or a loading spinner
 */

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useAuthGuard() {
  const { isLoggedIn, loading } = useAuth();
  const router                  = useRouter();
  const pathname                = usePathname();
  const [ready, setReady]       = useState(false);

  useEffect(() => {
    if (loading) return;              // still restoring session — wait
    if (!isLoggedIn) {
      router.replace(`/login?return=${encodeURIComponent(pathname)}`);
    } else {
      setReady(true);
    }
  }, [loading, isLoggedIn, router, pathname]);

  return { ready, loading };
}
