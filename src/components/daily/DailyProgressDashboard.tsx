"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DailyAchievementGarden } from "@/components/daily/DailyAchievementGarden";
import type {
  DailyAchievementStats,
  DailyCoverage,
} from "@/lib/daily-challenge/types";

type Filter = "all" | "solved" | "remaining";

export function DailyProgressDashboard({
  coverage,
  achievements,
  exam,
  subjectId,
  subjectLabel,
}: {
  coverage: DailyCoverage;
  achievements: DailyAchievementStats;
  exam: string;
  subjectId: string;
  subjectLabel: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const percent = coverage.total
    ? Math.round((coverage.solved / coverage.total) * 100)
    : 0;
  const visible = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ko");
    return coverage.questions.filter((question) => {
      if (filter === "solved" && !question.solved) return false;
      if (filter === "remaining" && question.solved) return false;
      return (
        !query ||
        `${question.sourceLabel} ${question.stem}`.toLocaleLowerCase("ko").includes(query)
      );
    });
  }, [coverage.questions, filter, search]);

  return (
    <div className="space-y-6">
      <DailyAchievementGarden
        stats={{
          ...achievements,
          uniqueSolved: coverage.solved,
          poolCount: coverage.total,
          yearsStarted: coverage.years.filter((year) => year.solved > 0).length,
          yearsCompleted: coverage.years.filter(
            (year) => year.total > 0 && year.solved === year.total,
          ).length,
          totalYears: coverage.years.length,
        }}
        exam={exam}
        subjectId={subjectId}
        subjectLabel={subjectLabel}
        variant="dashboard"
      />
      <Link
        href={`/${exam}/daily/wrong?subject=${encodeURIComponent(subjectId)}`}
        className="group flex items-center gap-4 rounded-[24px] border border-[#E0E6E2] bg-white px-4 py-4 shadow-[0_10px_30px_rgba(34,52,43,0.05)] transition-transform hover:-translate-y-0.5 sm:px-5"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[15px] bg-[linear-gradient(145deg,#F4EDE8,#E8EEF6)] text-[#515C6D]">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
            <path d="M6.5 4.5h8a3 3 0 0 1 3 3v12l-5.5-3-5.5 3v-15Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="m9 10 1.7 1.7L15 7.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold tracking-[0.08em] text-[#87909D]">PERSONAL REVIEW</span>
          <span className="mt-0.5 block text-sm font-bold text-[#2E4036]">매일 10문제 특별한 오답노트</span>
          <span className="mt-0.5 block text-[11px] text-[#748078]">틀린 문제 자동 정리 · 복습 순서 · 개인 메모</span>
        </span>
        <span className="text-lg font-light text-[#6F8178] transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
      </Link>
      <section className="rounded-[28px] border border-[#DBE8F7] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:p-7">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#64748B]">최근 10개년 · 내 학습 현황</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
              {coverage.solved.toLocaleString()} / {coverage.total.toLocaleString()}문제
            </h2>
          </div>
          <span className="text-lg font-semibold text-[#007AFF]">{percent}%</span>
        </div>
        <div
          className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#E8F1FB]"
          role="progressbar"
          aria-valuenow={coverage.solved}
          aria-valuemin={0}
          aria-valuemax={coverage.total}
          aria-label="푼 문제 비율"
        >
          <div className="h-full rounded-full bg-[#007AFF]" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
          <Stat label="푼 문제" value={`${coverage.solved.toLocaleString()}개`} />
          <Stat label="아직 안 푼 문제" value={`${coverage.remaining.toLocaleString()}개`} />
          <Stat
            label="예정표대로 매일 풀면"
            value={coverage.remaining ? `약 ${coverage.daysToFinish}일` : "완주"}
            className="col-span-2 sm:col-span-1"
          />
        </div>
        <p className="mt-4 text-xs leading-5 text-[#64748B]">
          로그인한 상태에서 제출한 모든 풀이를 합산합니다. 맞고 틀림과 관계없이 한 번 풀었다면 ‘푼 문제’로 표시합니다.
        </p>
      </section>

      <section className="rounded-[28px] border border-[#DBE8F7] bg-white p-5 md:p-7">
        <h2 className="font-display text-lg font-semibold text-ink">연도별 진행</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {coverage.years.map((year) => (
            <div key={year.year} className="rounded-2xl border border-[#E4EDF7] px-4 py-3">
              <div className="flex justify-between gap-3 text-sm">
                <span className="font-semibold text-ink">{year.year}년</span>
                <span className="text-[#64748B]">{year.solved}/{year.total}문제</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E8F1FB]">
                <div
                  className="h-full rounded-full bg-[#007AFF]"
                  style={{ width: `${year.total ? (year.solved / year.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-[#DBE8F7] bg-white p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">문항 목록</h2>
          <span className="text-xs text-[#64748B]">{visible.length.toLocaleString()}문제 표시</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="풀이 상태 필터">
          {([
            ["all", `전체 ${coverage.total}`],
            ["solved", `푼 문제 ${coverage.solved}`],
            ["remaining", `아직 안 푼 문제 ${coverage.remaining}`],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                filter === value
                  ? "bg-[#007AFF] text-white"
                  : "border border-[#DCE8F5] bg-white text-[#475569] hover:bg-[#F5FAFF]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="연도·회차·문제 내용 검색"
          aria-label="문항 검색"
          className="mt-4 w-full rounded-xl border border-[#DCE8F5] px-4 py-3 text-sm outline-none focus:border-[#007AFF]"
        />
        <ul className="mt-4 divide-y divide-[#EAF0F7]">
          {visible.length ? visible.map((question) => (
            <li key={question.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  question.solved
                    ? "bg-[#E8F4FF] text-[#0066D6]"
                    : "bg-[#F1F4F8] text-[#64748B]"
                }`}>
                  {question.solved ? "푼 문제" : "미풀이"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#64748B]">{question.sourceLabel}</p>
                  <Link href={question.href} className="mt-1 block text-sm leading-6 text-ink hover:text-[#007AFF]">
                    {question.stem}
                  </Link>
                  {question.lastDate ? (
                    <p className="mt-1 text-xs text-[#64748B]">마지막 풀이 {question.lastDate}</p>
                  ) : null}
                </div>
              </div>
            </li>
          )) : (
            <li className="py-8 text-center text-sm text-[#64748B]">해당하는 문항이 없습니다.</li>
          )}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-2xl bg-[#F6F9FD] px-3 py-3 ${className}`}>
      <p className="text-xs text-[#64748B]">{label}</p>
      <p className="mt-1 font-display text-base font-semibold text-ink">{value}</p>
    </div>
  );
}
