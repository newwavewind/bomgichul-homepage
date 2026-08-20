"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface ExamQuestionJumpBarProps {
  questionNos: number[];
  current: number;
  /** 문항 번호만 붙이면 되는 경로 접두사 (예: /public-service/exam/foo/2026/국가직) */
  hrefBase: string;
  label?: string;
}

export function ExamQuestionJumpBar({
  questionNos,
  current,
  hrefBase,
  label = "문항",
}: ExamQuestionJumpBarProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLAnchorElement>(null);
  const base = hrefBase.replace(/\/$/, "");

  useEffect(() => {
    const scroller = scrollerRef.current;
    const chip = currentRef.current;
    if (!scroller || !chip) return;
    const left = chip.offsetLeft - (scroller.clientWidth - chip.offsetWidth) / 2;
    scroller.scrollTo({ left: Math.max(0, left) });
  }, [current, questionNos]);

  if (questionNos.length <= 1) return null;

  const index = questionNos.indexOf(current);
  const position = index >= 0 ? index + 1 : current;

  return (
    <nav
      className="mt-4 rounded-2xl border border-mist bg-white px-2.5 py-2 shadow-[var(--shadow-subtle)]"
      aria-label="문항 바로가기"
    >
      <div className="mb-1.5 flex items-center justify-between gap-2 px-1">
        <p className="font-display text-[11px] font-semibold tracking-wide text-slate-500">
          문항 바로가기
        </p>
        <p className="font-display text-[11px] font-medium tabular-nums text-slate-500">
          {position}/{questionNos.length} {label}
        </p>
      </div>
      <div
        ref={scrollerRef}
        className="flex gap-1 overflow-x-auto overscroll-x-contain py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {questionNos.map((no) => {
          const isCurrent = no === current;
          return (
            <Link
              key={no}
              href={`${base}/${no}`}
              ref={isCurrent ? currentRef : undefined}
              role="listitem"
              aria-current={isCurrent ? "true" : undefined}
              aria-label={`${no}번${isCurrent ? " (현재)" : ""}`}
              className={`inline-flex size-11 shrink-0 items-center justify-center rounded-lg font-display text-[13px] font-semibold tabular-nums transition-colors ${
                isCurrent
                  ? "bg-[#007AFF] text-white shadow-[0_1px_4px_rgba(0,122,255,0.35)]"
                  : "bg-white text-slate-700 ring-1 ring-slate-200/90 hover:bg-snow hover:text-ink"
              }`}
            >
              {no}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
