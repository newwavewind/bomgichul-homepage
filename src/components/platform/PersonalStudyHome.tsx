"use client";
import { FirstStudyLink } from "@/components/web-study/ExamDiscovery";
import Link from "next/link";
import { ExamRemindersHomeStrip } from "@/components/platform/ExamRemindersHomeStrip";
import type { PersonalHomeData } from "@/lib/personal-home";

export function PersonalStudyHome({ nickname, data }: { nickname: string; data: PersonalHomeData }) {
  const stats = [
    ["연속 방문", `${data.streak}일`],
    ["푼 문제", `${data.attemptCount}문항`],
    ["정답률", `${data.accuracy}%`],
    ["복습 후보(중복 제외)", `${data.reviewCount}문항`],
    ["북마크", `${data.bookmarkCount}문항`],
  ];
  return (
    <section
      className="mx-auto mb-10 max-w-4xl rounded-[24px] border border-mist bg-paper p-5 shadow-[var(--shadow-subtle)] md:p-7"
      aria-labelledby="personal-home-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-[12px] font-semibold tracking-[0.04em] text-ios-blue">
            나의 학습 홈
          </p>
          <h2
            id="personal-home-title"
            className="mt-1 font-display text-[24px] font-semibold tracking-tight text-ink md:text-[28px]"
          >
            {nickname || "회원"}님, 이어서 공부할까요?
          </h2>
        </div>
        {data.recent ? (
          <Link
            href={data.recent.href}
            className="inline-flex min-h-11 items-center rounded-full bg-ios-blue px-5 font-display text-body-sm font-semibold text-paper"
          >
            이어 풀기 →
          </Link>
        ) : (
          <FirstStudyLink />
        )}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-y-4 border-t border-mist pt-4 md:grid-cols-4">
        {stats.map(([label, value], index) => (
          <div
            key={label}
            className={`px-3 first:pl-0 md:px-5 ${index % 2 ? "border-l border-mist" : ""} ${index > 0 ? "md:border-l md:border-mist" : "md:border-l-0"}`}
          >
            <p className="font-display text-[11px] text-fog">{label}</p>
            <p className="mt-0.5 font-display text-[20px] font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm">실제 학습일·주간 보고서·학습 계획·오답 요약집은 <Link href="/study-tools" className="underline">웹 학습 도구</Link>에서 확인하세요.</p>
      <ExamRemindersHomeStrip />
    </section>
  );
}
