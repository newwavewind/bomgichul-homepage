"use client";

import Link from "next/link";
import { useState } from "react";
import type { DailyReviewItem } from "@/lib/daily-challenge/types";

export function DailyReviewList({ items }: { items: DailyReviewItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="mt-5 space-y-3">
      {items.map((item, index) => {
        const open = openId === item.id;
        return (
          <li key={item.id} className="rounded-2xl border border-[#e6eef8] bg-white/70 px-4 py-3">
            <p className="text-xs text-[#64748b]">{index + 1}. {item.sourceLabel}</p>
            <p className="mt-1 text-sm leading-6 text-ink">{item.stem}</p>
            <p className={`mt-2 text-sm font-semibold ${item.ok ? "text-[#0066D6]" : "text-[#334155]"}`}>
              {item.ok ? "맞음" : "틀림"} · 내 선택 {item.pickedLabel || "없음"} · 정답 {item.answerLabel}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                className="text-sm font-semibold text-[#0066D6]"
                aria-expanded={open}
              >
                {open ? "해설 닫기" : "해설 보기"}
              </button>
              <Link
                href={item.href}
                className="inline-flex min-h-8 items-center rounded-full border border-[#d7e3f4] bg-white px-3 text-sm font-semibold text-[#334155]"
              >
                이 문항으로
              </Link>
            </div>
            {open ? (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#334155]">
                {item.explanation || "이 문항의 해설은 문항 페이지에 있습니다."}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
