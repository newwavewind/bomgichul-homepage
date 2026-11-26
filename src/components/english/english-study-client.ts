"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const saved = "english-study-saved";
const sessionProgress = new Map<string, string>();

export const syntaxProgressKey = "bom-english-syntax-practice-v1";
export const initialSyntaxProgress = {
  day: 1, cardId: "", marked: [] as string[], missed: [] as string[], known: [] as string[],
};

export function useStudyProgress<T>(key: string, initial: T) {
  const snapshot = useCallback(() => {
    try { return window.localStorage.getItem(key) ?? sessionProgress.get(key) ?? null; }
    catch { return sessionProgress.get(key) ?? null; }
  }, [key]);
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("storage", onChange);
    window.addEventListener(saved, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(saved, onChange);
    };
  }, []);
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  const value = useMemo(() => {
    if (!raw) return initial;
    try { return JSON.parse(raw) as T; } catch { return initial; }
  }, [initial, raw]);
  const save = useCallback((next: T) => {
    const raw = JSON.stringify(next);
    try { window.localStorage.setItem(key, raw); }
    catch { sessionProgress.set(key, raw); }
    window.dispatchEvent(new Event(saved));
  }, [key]);
  return [value, save] as const;
}

export function speakStudyEnglish(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "en-US";
  voice.rate = .9;
  window.speechSynthesis.speak(voice);
}

export function isStudyShortcut(event: KeyboardEvent) {
  const element = event.target;
  return !event.defaultPrevented && !event.altKey && !event.ctrlKey && !event.metaKey && !event.isComposing
    && !(element instanceof HTMLElement && element.closest("input, select, textarea, [contenteditable=true]"));
}

export function toggleStudyId(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

export async function fetchEnglishStudy<T>(params: URLSearchParams, signal: AbortSignal): Promise<T> {
  const response = await fetch("/api/exam-track/english-study?" + params, { signal });
  if (!response.ok) throw new Error("학습 자료를 불러오지 못했습니다.");
  return await response.json() as T;
}
