import { sendGAEvent } from "@next/third-parties/google";
/** Aggregate marketing events only: no memo text, account IDs or query strings. */
export function trackWebFunnel(
  name: string,
  params: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;
  try {
    const analyticsWindow = window as unknown as { dataLayer: unknown[] };
    analyticsWindow.dataLayer ??= [];
    const now = Date.now();
    let landing = JSON.parse(
      sessionStorage.getItem("bom:web-landing") || "null",
    );
    if (!landing) {
      let source = "direct";
      try {
        const host = new URL(document.referrer).hostname;
        if (host !== location.hostname)
          source = /google\.|naver\.|bing\.|daum\./.test(host)
            ? "search"
            : "referral";
      } catch {}
      landing = { time: now, path: location.pathname, source };
      sessionStorage.setItem("bom:web-landing", JSON.stringify(landing));
      sendGAEvent("event", "web_landing", {
        landing_path: landing.path,
        source: landing.source,
      });
    }
    const context = {
      landing_path: landing.path,
      source: landing.source,
      ...params,
    };
    if (name === "web_question_completed") {
      const total =
        Number(sessionStorage.getItem("bom:web-completed") || 0) + 1;
      sessionStorage.setItem("bom:web-completed", String(total));
      if (total === 1)
        sendGAEvent("event", "web_first_question", {
          ...context,
          seconds_to_first_question: Math.round((now - landing.time) / 1000),
        });
      if (total === 5)
        sendGAEvent("event", "web_first_session_complete", {
          ...context,
          question_count: 5,
        });
    }
    sendGAEvent("event", name, context);
  } catch {
    sendGAEvent("event", name, params);
  }
}
export function trackWebReturn() {
  try {
    const now = Date.now();
    const initial = Number(localStorage.getItem("bom:web-first-visit") || now);
    if (!localStorage.getItem("bom:web-first-visit"))
      localStorage.setItem("bom:web-first-visit", String(now));
    const day = Math.floor((now - initial) / 86400000);
    if (day === 7 && !localStorage.getItem("bom:web-return7")) {
      trackWebFunnel("web_day7_return");
      localStorage.setItem("bom:web-return7", "1");
    }
  } catch {}
}
