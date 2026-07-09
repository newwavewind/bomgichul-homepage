"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { shouldTrackVisitPath } from "@/lib/site-visits";

export function VisitTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || !shouldTrackVisitPath(pathname)) return;
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const referrer =
      typeof document !== "undefined" ? document.referrer || null : null;

    void fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer }),
      keepalive: true,
    });
  }, [pathname]);

  return null;
}
