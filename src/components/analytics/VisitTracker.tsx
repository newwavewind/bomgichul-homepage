"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { shouldTrackVisitPath } from "@/lib/site-visits";

const SESSION_KEY = "bomgichul_visit_session";

function getSessionId(): string {
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_KEY, created);
  return created;
}

export function VisitTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || !shouldTrackVisitPath(pathname)) return;
    if (lastTracked.current === pathname) return;
    const isFirstTrackedPage = lastTracked.current === null;
    lastTracked.current = pathname;

    const startedAt = performance.now();
    const sessionId = getSessionId();
    const referrer = isFirstTrackedPage ? document.referrer || null : null;
    let visitId: string | null = null;
    let interactionCount = 0;
    let sentEngagement = false;
    let disposed = false;

    const sendEngagement = () => {
      if (!visitId || sentEngagement || disposed) return;
      const engagementMs = Math.max(0, Math.round(performance.now() - startedAt));
      if (interactionCount === 0 && engagementMs < 10_000) return;
      sentEngagement = true;
      void fetch("/api/analytics/visit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitId, engagementMs, interactionCount }),
        keepalive: true,
      });
    };

    const markInteraction = () => {
      interactionCount += 1;
      sendEngagement();
    };

    window.addEventListener("pointerdown", markInteraction, { passive: true });
    window.addEventListener("keydown", markInteraction, { passive: true });
    window.addEventListener("scroll", markInteraction, { passive: true, once: true });

    const timer = window.setTimeout(sendEngagement, 10_000);

    void fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrer, sessionId }),
      keepalive: true,
    })
      .then(async (response) => {
        if (!response.ok || response.status === 204) return;
        const result = (await response.json()) as { visitId?: string };
        visitId = result.visitId ?? null;
        sendEngagement();
      })
      .catch(() => undefined);

    return () => {
      window.clearTimeout(timer);
      if (!sentEngagement && visitId && (interactionCount > 0 || performance.now() - startedAt >= 10_000)) {
        const engagementMs = Math.max(0, Math.round(performance.now() - startedAt));
        void fetch("/api/analytics/visit", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitId, engagementMs, interactionCount }),
          keepalive: true,
        });
      }
      disposed = true;
      window.removeEventListener("pointerdown", markInteraction);
      window.removeEventListener("keydown", markInteraction);
      window.removeEventListener("scroll", markInteraction);
    };
  }, [pathname]);

  return null;
}
