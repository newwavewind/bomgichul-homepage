"use client";

import { useEffect, useState } from "react";

const POINTS = [
  "맞힌 개수를 날짜마다 더해요. 많이 맞힐수록 위예요.",
  "같으면 푼 날이 많은 사람이 위고, 그것도 같으면 이름 순이에요.",
  "하루에 한 번만 들어가요. 연습이랑 복습, 이름 없는 풀이는 안 나와요.",
];

export function CumulativeRankNote() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#d5e6f8] bg-[#f3f8ff] py-0.5 pl-0.5 pr-2.5 text-xs font-semibold text-[#1d5fa8]"
      >
        <i aria-hidden className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#007AFF] text-[11px] font-bold not-italic text-white">i</i>
        기준
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(15,23,42,0.28)] px-[18px] pb-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cumulative-rank-title"
            className="max-h-[calc(100dvh-168px)] w-full max-w-[340px] overflow-auto rounded-[22px] border border-[#e3eef8] bg-white text-[13.5px] leading-[1.55] text-[#243b53] shadow-[0_18px_44px_rgba(22,42,70,0.16)]"
          >
            <header className="flex items-center justify-between gap-3 rounded-t-[22px] bg-[linear-gradient(180deg,#e7f2ff_0%,#f8fbff_100%)] pb-3.5 pl-[30px] pr-3 pt-4">
              <h2 id="cumulative-rank-title" className="text-base font-bold text-[#16324f]">
                누적 순위
              </h2>
              <button
                type="button"
                aria-label="안내 닫기"
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-lg leading-none text-[#64748b]"
              >
                ×
              </button>
            </header>
            <div className="flex flex-col gap-2.5 px-4 pb-4 pt-3.5">
              {POINTS.map((line) => (
                <p key={line} className="relative m-0 pl-3.5 text-[13.5px] leading-[1.55] text-[#243b53]">
                  <span className="absolute left-0 top-[0.55em] h-[5px] w-[5px] rounded-full bg-[#007AFF]" aria-hidden />
                  {line}
                </p>
              ))}
              <div className="-mx-4 mt-0.5 bg-[#f3f8ff] py-3 pl-[30px] pr-4">
                <strong className="block text-[13.5px] leading-snug text-[#16324f]">3일 · 맞힌 수 24</strong>
                <p className="mt-1 text-[13.5px] leading-[1.55] text-[#5b7190]">사흘 풀어서 24문제를 맞힌 거예요.</p>
              </div>
              <p className="relative m-0 mt-0.5 border-t border-[#e6eef6] pt-3 pl-3.5 text-[13.5px] leading-[1.55] text-[#5b7190]">
                <span className="absolute left-0 top-[calc(12px+0.55em)] h-[5px] w-[5px] rounded-full bg-[#9eb4cc]" aria-hidden />
                오늘 순위는 그날 맞힌 개수가 먼저예요. 같으면 더 빨리 푼 사람이 위예요.
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
