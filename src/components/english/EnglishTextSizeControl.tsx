"use client";

import { useEffect, useState } from "react";

/**
 * 공무원 영어 지문·선지 글씨 크기 단추(2026-10-21) — 오른쪽 위(머리 띠 바로 아래) 세로 「A+ / A−」.
 * globals.css 의 --exam-latin-size 를 바꾸고, 고른 크기는 이 기기에 기억한다.
 */
const SIZES = [16, 18, 20, 22, 24, 27, 30];
const KEY = "bomgichul:english-text-size";
const DEFAULT_INDEX = SIZES.indexOf(20);

function setSize(px: number | null | undefined) {
  document.querySelectorAll<HTMLElement>("[data-exam-latin]").forEach((el) => {
    if (px) el.style.setProperty("--exam-latin-size", `${px}px`);
    else el.style.removeProperty("--exam-latin-size");
  });
}

function readIndex(): number {
  try {
    const saved = Number(window.localStorage.getItem(KEY));
    const i = SIZES.indexOf(saved);
    return i >= 0 ? i : DEFAULT_INDEX;
  } catch {
    return DEFAULT_INDEX;
  }
}

export function EnglishTextSizeControl() {
  const [index, setIndex] = useState(DEFAULT_INDEX);

  useEffect(() => {
    const saved = readIndex();
    setSize(SIZES[saved]);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 저장된 크기는 기기에만 있어 첫 그림 뒤에 읽는다
    setIndex(saved);
    return () => {
      setSize(null);
    };
  }, []);

  const change = (delta: number) => {
    const next = Math.max(0, Math.min(SIZES.length - 1, index + delta));
    setIndex(next);
    setSize(SIZES[next]);
    try {
      window.localStorage.setItem(KEY, String(SIZES[next]));
    } catch {
      /* 저장 못 해도 이번 화면엔 적용된다 */
    }
  };

  const button =
    "flex size-10 items-center justify-center font-display text-ink transition-colors hover:bg-[#F1F8FF] disabled:opacity-30";

  return (
    <div
      role="group"
      aria-label="영어 글씨 크기"
      className="fixed right-4 top-[76px] z-40 flex flex-col overflow-hidden rounded-2xl border border-[#d7e3f4] bg-white/95 shadow-[0_6px_20px_rgba(15,23,42,0.12)] backdrop-blur"
    >
      <button type="button" onClick={() => change(1)} disabled={index === SIZES.length - 1} aria-label="영어 글씨 크게" className={button}>
        <span className="text-[17px] font-semibold">A+</span>
      </button>
      <span className="border-t border-[#e6eef8]" aria-hidden />
      <button type="button" onClick={() => change(-1)} disabled={index === 0} aria-label="영어 글씨 작게" className={button}>
        <span className="text-[13px] font-semibold">A−</span>
      </button>
    </div>
  );
}
