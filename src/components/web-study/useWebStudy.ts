"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { readWebStudy, selectedExam } from "@/lib/web-study";
const server = () => "";
function subscribeStudy(callback: () => void) {
  window.addEventListener("bom:web-study", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("bom:web-study", callback);
    window.removeEventListener("storage", callback);
  };
}
function subscribeExam(callback: () => void) {
  window.addEventListener("bom:exam", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("bom:exam", callback);
    window.removeEventListener("storage", callback);
  };
}
export function useWebStudy(actor: string) {
  const snapshot = useSyncExternalStore(
    subscribeStudy,
    useCallback(() => {
      try {
        return localStorage.getItem(`bom:web-study:v1:${actor}`) || "";
      } catch {
        return "";
      }
    }, [actor]),
    server,
  );
  return useMemo(
    () => (snapshot ? readWebStudy(actor) : { entries: [] }),
    [snapshot, actor],
  );
}
export function useSelectedExam() {
  return useSyncExternalStore(subscribeExam, selectedExam, () => null);
}
