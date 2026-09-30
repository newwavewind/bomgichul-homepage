"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackWebFunnel, trackWebReturn } from "@/lib/web-funnel";
import { EXAM_CHOICES, scopeForPath, selectExam } from "@/lib/web-study";
import { trackEvent } from "@/lib/analytics";
export function WebStudyTracker() {
  const path = usePathname();
  useEffect(() => {
    trackWebFunnel("web_content_view", { content_path: path });
    trackWebReturn();
    if (
      path.includes("/exam/") ||
      path.includes("/concepts/") ||
      EXAM_CHOICES.some(([id]) => path === `/${id}`)
    )
      selectExam(scopeForPath(path));
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (/apps\.apple\.com|play\.google\.com/.test(href))
        trackEvent("web_app_conversion", {
          scope: scopeForPath(path),
          conversion_path: path,
          store: href.includes("apple") ? "ios" : "android",
        });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [path]);
  return null;
}
