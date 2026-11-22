"use client";

import { useSyncExternalStore } from "react";
import {
  APPEARANCE_STORAGE_KEY,
  DEFAULT_FONT_SIZE,
  FONT_SIZES,
  type FontSize,
  type Theme,
} from "@/lib/appearance";

const changeEvent = "bomgichul:appearance-change";
const buttonStyle = "inline-grid h-9 min-w-8 place-items-center whitespace-nowrap font-medium hover:bg-snow focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-carbon disabled:cursor-default disabled:text-fog disabled:opacity-45 disabled:hover:bg-transparent";

function getSnapshot() {
  const { theme = "light", fontSize = String(DEFAULT_FONT_SIZE) } = document.documentElement.dataset;
  return `${theme}:${fontSize}`;
}

function getServerSnapshot() {
  return `light:${DEFAULT_FONT_SIZE}`;
}

function applyAppearance(theme: Theme, fontSize: FontSize) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.fontSize = String(fontSize);
  root.classList.toggle("dark", theme === "dark");
}

function subscribe(onChange: () => void) {
  const syncStorage = (event: StorageEvent) => {
    if (event.key !== APPEARANCE_STORAGE_KEY && event.key !== null) return;
    try {
      const saved = JSON.parse(event.newValue ?? "{}");
      applyAppearance(
        saved?.theme === "dark" ? "dark" : "light",
        FONT_SIZES.includes(saved?.fontSize) ? saved.fontSize : DEFAULT_FONT_SIZE,
      );
      onChange();
    } catch {
      // Keep the active settings if another tab supplied invalid preferences.
    }
  };
  window.addEventListener(changeEvent, onChange);
  window.addEventListener("storage", syncStorage);
  return () => {
    window.removeEventListener(changeEvent, onChange);
    window.removeEventListener("storage", syncStorage);
  };
}

function saveAppearance(theme: Theme, fontSize: FontSize) {
  applyAppearance(theme, fontSize);
  try {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify({ theme, fontSize }));
  } catch {
    // The controls still work for the current page when storage is unavailable.
  }
  window.dispatchEvent(new Event(changeEvent));
}

export function AppearanceControls() {
  const [savedTheme, savedFontSize] = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot).split(":");
  const theme: Theme = savedTheme === "dark" ? "dark" : "light";
  const fontSize = Number(savedFontSize) as FontSize;
  const sizeIndex = FONT_SIZES.indexOf(fontSize);
  const smaller = FONT_SIZES[sizeIndex - 1];
  const larger = FONT_SIZES[sizeIndex + 1];
  const dark = theme === "dark";

  const controls = (
    <div className="flex shrink-0 items-center gap-2 text-ink" role="group" aria-label="화면 설정">
      <div className="flex overflow-hidden rounded-lg border border-mist bg-paper" role="group" aria-label="글씨 크기">
        <button
          type="button"
          className={`${buttonStyle} text-[17px]`}
          aria-label="글씨 크기 줄이기"
          disabled={smaller === undefined}
          onClick={() => saveAppearance(theme, smaller)}
        >
          −
        </button>
        <button
          type="button"
          className={`${buttonStyle} border-x border-mist px-2 text-[12px] tabular-nums`}
          aria-label={`글씨 크기 ${fontSize}%. 기본 크기로 복원`}
          title="글씨 크기 기본값으로"
          onClick={() => saveAppearance(theme, DEFAULT_FONT_SIZE)}
        >
          {fontSize === DEFAULT_FONT_SIZE ? "글씨 크기" : `${fontSize}%`}
        </button>
        <button
          type="button"
          className={`${buttonStyle} text-[17px]`}
          aria-label="글씨 크기 늘리기"
          disabled={larger === undefined}
          onClick={() => saveAppearance(theme, larger)}
        >
          +
        </button>
      </div>
      <button
        type="button"
        className={`${buttonStyle} w-9 rounded-lg border border-mist bg-paper`}
        aria-label="다크 모드"
        aria-pressed={dark}
        title={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
        onClick={() => saveAppearance(dark ? "light" : "dark", fontSize)}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {dark ? (
            <>
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </>
          ) : (
            <path d="M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5a8.6 8.6 0 1 0 10.6 10.6Z" fill="currentColor" />
          )}
        </svg>
      </button>
      <span role="status" className="sr-only">글씨 크기 {fontSize}%</span>
    </div>
  );

  return (
    <>
      <div className="appearance-controls hidden sm:block">{controls}</div>
      <details className="appearance-controls relative sm:hidden">
        <summary
          className={`${buttonStyle} list-none rounded-lg border border-mist bg-paper px-2 text-[13px] text-ink [&::-webkit-details-marker]:hidden`}
          aria-label="화면 설정"
        >
          <span aria-hidden="true">가<span className="ml-0.5 text-[10px]">가</span></span>
        </summary>
        <div className="absolute right-0 z-10 mt-2 rounded-xl border border-mist bg-paper p-2 shadow-lg">
          {controls}
        </div>
      </details>
    </>
  );
}
