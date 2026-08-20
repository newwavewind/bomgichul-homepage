"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ExamTrackMaterial } from "@/lib/exam-track/types";

type Material = ExamTrackMaterial & { figureFirst?: boolean };

const MIN_SCALE = 1;
const MAX_SCALE = 6;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ZoomIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className={className}>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M20 20l-3.5-3.5M11 8v6M8 11h6" />
    </svg>
  );
}

function ZoomOverlay({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [scale, setScale] = useState(MIN_SCALE);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const pinch = useRef<{ distance: number; scale: number } | null>(null);

  const changeScale = useCallback((next: number) => {
    const value = clamp(next, MIN_SCALE, MAX_SCALE);
    setScale(value);
    if (value === MIN_SCALE) setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "+" || event.key === "=") setScale((value) => clamp(value + 0.5, MIN_SCALE, MAX_SCALE));
      if (event.key === "-") setScale((value) => clamp(value - 0.5, MIN_SCALE, MAX_SCALE));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const touchDistance = (touches: React.TouchList) =>
    Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

  return createPortal(
    <div className="fixed inset-0 z-[200] flex flex-col bg-white" role="dialog" aria-modal="true" aria-label={`${alt} 크게 보기`}>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-mist bg-white px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <span className="font-display text-[13px] font-bold tabular-nums text-carbon">{Math.round(scale * 100)}%</span>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => changeScale(scale - 0.5)} disabled={scale <= MIN_SCALE} aria-label="축소" className="h-9 min-w-9 rounded-lg border border-mist bg-white px-2 font-bold disabled:opacity-40">−</button>
          <button type="button" onClick={() => changeScale(scale + 0.5)} disabled={scale >= MAX_SCALE} aria-label="확대" className="h-9 min-w-9 rounded-lg border border-mist bg-white px-2 font-bold disabled:opacity-40">+</button>
          <button type="button" onClick={() => changeScale(MIN_SCALE)} disabled={scale === MIN_SCALE} aria-label="원래 크기" className="h-9 rounded-lg border border-mist bg-white px-3 font-display text-[12px] font-bold disabled:opacity-40">원래대로</button>
          <button type="button" onClick={onClose} aria-label="닫기" className="h-9 min-w-9 rounded-lg border border-mist bg-white px-2 font-bold">✕</button>
        </div>
      </div>
      <div
        className="flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden bg-snow"
        onWheel={(event) => {
          event.preventDefault();
          changeScale(scale + (event.deltaY < 0 ? 0.4 : -0.4));
        }}
        onDoubleClick={() => changeScale(scale > MIN_SCALE ? MIN_SCALE : 2.5)}
        onMouseDown={(event) => {
          if (scale > MIN_SCALE) drag.current = { x: event.clientX - position.x, y: event.clientY - position.y };
        }}
        onMouseMove={(event) => {
          if (drag.current) setPosition({ x: event.clientX - drag.current.x, y: event.clientY - drag.current.y });
        }}
        onMouseUp={() => { drag.current = null; }}
        onMouseLeave={() => { drag.current = null; }}
        onTouchStart={(event) => {
          if (event.touches.length === 2) {
            pinch.current = { distance: touchDistance(event.touches), scale };
            drag.current = null;
          } else if (event.touches.length === 1 && scale > MIN_SCALE) {
            drag.current = { x: event.touches[0].clientX - position.x, y: event.touches[0].clientY - position.y };
          }
        }}
        onTouchMove={(event) => {
          if (event.touches.length === 2 && pinch.current) {
            changeScale(pinch.current.scale * (touchDistance(event.touches) / pinch.current.distance));
          } else if (event.touches.length === 1 && drag.current) {
            setPosition({ x: event.touches[0].clientX - drag.current.x, y: event.touches[0].clientY - drag.current.y });
          }
        }}
        onTouchEnd={() => { pinch.current = null; drag.current = null; }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} draggable={false} className="max-h-full max-w-full select-none transition-transform duration-75" style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, cursor: scale > MIN_SCALE ? "grab" : "zoom-in" }} />
      </div>
      <p className="shrink-0 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-center font-display text-[11px] text-smoke">두 손가락으로 벌리거나 두 번 누르면 커집니다 · 끌어서 이동</p>
    </div>,
    document.body,
  );
}

/**
 * 문항에 딸린 자료 그림 — 사료·지도·안내문·도표.
 *
 * 한국사는 「밑줄 그은 (가) 시대」처럼 자료를 봐야만 풀리는 문항이 대부분이고,
 * 영어 생활영어에도 안내문 그림이 붙는다. 그림이 빠지면 문항이 성립하지
 * 않는다.
 *
 * 예전에는 한국사 전용 화면 안에만 있었다. 그 화면을 걷어내면서 그림도 함께
 * 사라지는 일이 있었으므로, 이제는 문항 화면이 공통으로 그린다.
 */
export function ExamMaterialFigure({
  material,
  questionNo,
}: {
  material?: Material;
  questionNo: number;
}) {
  const [open, setOpen] = useState(false);
  if (!material?.image) return null;
  const alt = `${questionNo}번 문항 자료`;
  return (
    <>
      <figure className="mb-6 overflow-hidden rounded-[var(--radius-cards)] border border-mist bg-white">
        <button type="button" onClick={() => setOpen(true)} aria-label={`${alt} 크게 보기`} className="group relative block w-full cursor-zoom-in bg-white p-3">
          <Image src={material.image} alt={alt} width={material.width ?? 1200} height={material.height ?? 900} className="mx-auto h-auto max-h-[720px] w-auto max-w-full" sizes="(max-width: 900px) 100vw, 860px" priority={questionNo <= 2} />
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full border border-mist bg-white/95 px-2 py-1 font-display text-[11px] font-bold text-smoke shadow-sm transition group-hover:border-carbon group-hover:text-carbon" aria-hidden>
            <ZoomIcon className="h-3.5 w-3.5" /> 크게
          </span>
        </button>
      </figure>
      {open ? <ZoomOverlay src={material.image} alt={alt} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
