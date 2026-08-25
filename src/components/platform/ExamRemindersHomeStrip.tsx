"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getKstTodayIso } from "@/data/exam-calendar";
import { upcomingExamReminders, type ExamReminder } from "@/lib/login-nudges";

function formatKoDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

/** 로그인 홈에 붙는 「내가 켠 시험 리마인드」 */
export function ExamRemindersHomeStrip() {
  const [rows, setRows] = useState<ExamReminder[]>([]);

  useEffect(() => {
    setRows(upcomingExamReminders(getKstTodayIso()).slice(0, 3));
  }, []);

  if (rows.length === 0) return null;

  return (
    <div className="mt-5 rounded-2xl border border-mist bg-snow/70 px-4 py-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-[12px] font-semibold text-fog">다가오는 시험 리마인드</p>
        <Link
          href="/#exam-calendar"
          className="font-display text-[12px] font-semibold text-[#0b5fff] hover:underline"
        >
          달력에서 보기
        </Link>
      </div>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <li key={r.eventId} className="flex flex-wrap items-baseline justify-between gap-2">
            <Link href={r.href} className="font-display text-[13px] font-semibold text-ink hover:underline">
              {r.examLabel} · {r.title}
            </Link>
            <span className="font-display text-[12px] text-smoke">{formatKoDate(r.date)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
