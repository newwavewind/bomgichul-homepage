"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/illustrations/BrandLogo";

const ROUND1 = [
  { label: "부동산학개론", status: "시작" },
  { label: "민법 및 민사특별법", status: "학습 중" },
];

const ROUND2 = [
  { label: "공인중개사법령 및 실무", status: "시작" },
  { label: "부동산공시법령", status: "시작" },
  { label: "부동산세법", status: "시작" },
  { label: "부동산공법", status: "시작" },
];

const YEARS = [
  { year: 2025, progress: "32/40" },
  { year: 2024, progress: "40/40" },
  { year: 2023, progress: "18/40" },
  { year: 2022, progress: "0/40" },
];

const INTERVAL_MS = 3200;

function SubjectRow({
  label,
  status,
  active = false,
}: {
  label: string;
  status: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-[10px] border border-carbon/80 bg-paper px-3 py-2.5 shadow-[var(--shadow-subtle)]">
      <p className="min-w-0 truncate font-display text-[12px] font-semibold text-ink">
        {label}
      </p>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 font-display text-[10px] font-semibold ${
          active
            ? "bg-electric-blue text-paper"
            : "border border-carbon bg-snow text-ink"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function ScreenHeader({
  badge,
  title,
  highlight,
  sub,
}: {
  badge: string;
  title: string;
  highlight?: string;
  sub: string;
}) {
  return (
    <header className="mb-3 rounded-[12px] border border-carbon/70 bg-paper px-3 py-3 shadow-[var(--shadow-subtle)]">
      <div className="mb-2 flex items-center gap-2">
        <BrandLogo size="xs" />
        <span className="rounded-full border border-carbon bg-ice px-2 py-0.5 font-display text-[10px] font-semibold text-electric-blue">
          {badge}
        </span>
      </div>
      <h3 className="font-display text-[17px] font-semibold leading-tight text-ink">
        {highlight ? (
          <>
            <span className="text-electric-blue">{highlight}</span>
            {title}
          </>
        ) : (
          title
        )}
      </h3>
      <p className="mt-1 font-display text-[11px] text-smoke">{sub}</p>
    </header>
  );
}

function ScreenSubjects() {
  return (
    <>
      <ScreenHeader
        badge="+ 봄기출 · 공인중개사"
        highlight="과목"
        title=" 선택"
        sub="학습할 과목을 선택하세요."
      />
      <div className="min-h-0 flex-1 space-y-3 overflow-hidden">
        <section>
          <p className="mb-1.5 font-display text-[11px] font-semibold text-fog">1차</p>
          <div className="space-y-1.5">
            {ROUND1.map((s) => (
              <SubjectRow
                key={s.label}
                label={s.label}
                status={s.status}
                active={s.status === "학습 중"}
              />
            ))}
          </div>
        </section>
        <section>
          <p className="mb-1.5 font-display text-[11px] font-semibold text-fog">2차</p>
          <div className="space-y-1.5">
            {ROUND2.map((s) => (
              <SubjectRow key={s.label} label={s.label} status={s.status} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function ScreenStudy() {
  return (
    <>
      <ScreenHeader
        badge="민법 · 학습"
        highlight="기출"
        title=" 연도별"
        sub="2016~2025년 기출 O/X"
      />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 content-start overflow-hidden">
        {YEARS.map((y) => (
          <div
            key={y.year}
            className="rounded-[10px] border border-carbon/80 bg-paper px-2.5 py-3 shadow-[var(--shadow-subtle)]"
          >
            <p className="font-display text-[14px] font-semibold text-ink">{y.year}년</p>
            <p className="mt-1 font-display text-[11px] text-fog">{y.progress}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist">
              <div
                className="h-full rounded-full bg-electric-blue"
                style={{
                  width: `${(Number(y.progress.split("/")[0]) / 40) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-[10px] border border-carbon bg-ice px-3 py-2">
        <p className="font-display text-[11px] font-semibold text-electric-blue">
          오늘의 학습 · 이어서 풀기
        </p>
      </div>
    </>
  );
}

function ScreenQuiz() {
  return (
    <>
      <ScreenHeader
        badge="2025년 · 12번"
        title="기출 O/X"
        sub="민법 및 민사특별법"
      />
      <div className="min-h-0 flex-1 space-y-3 overflow-hidden">
        <div className="rounded-[12px] border border-carbon/80 bg-paper p-3 shadow-[var(--shadow-subtle)]">
          <p className="font-display text-[12px] leading-relaxed text-ink">
            법률행위의 목적이 선량한 풍속 기타 사회질서에 위반한 경우 그
            법률행위는 무효이다.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[12px] border-[1.5px] border-carbon bg-paper py-4 text-center font-display text-[20px] font-bold text-ink shadow-[var(--shadow-subtle)]">
            O
          </div>
          <div className="rounded-[12px] border-[1.5px] border-electric-blue bg-ice py-4 text-center font-display text-[20px] font-bold text-electric-blue shadow-[var(--shadow-subtle)]">
            X
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["AI 해설", "AI 개념정리", "AI 용어"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-carbon bg-paper px-2.5 py-1 font-display text-[10px] font-semibold text-ink"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function ScreenConcept() {
  return (
    <>
      <ScreenHeader
        badge="개념카드"
        highlight="주제별"
        title=" O/X"
        sub="시험이 반복해서 묻는 쟁점"
      />
      <div className="min-h-0 flex-1 space-y-2 overflow-hidden">
        {[
          "반사회질서 법률행위",
          "불공정한 법률행위",
          "통정허위표시",
        ].map((title, i) => (
          <div
            key={title}
            className={`rounded-[12px] border border-carbon/80 px-3 py-3 shadow-[var(--shadow-subtle)] ${
              i === 0 ? "bg-ice" : "bg-paper"
            }`}
          >
            <p className="font-display text-[12px] font-semibold text-ink">{title}</p>
            <p className="mt-1 font-display text-[10px] text-fog">카드 {8 - i * 2}장</p>
          </div>
        ))}
      </div>
    </>
  );
}

function ScreenExam() {
  return (
    <>
      <ScreenHeader
        badge="시험 모드"
        highlight="실전"
        title=" 감각"
        sub="40문항 · 출제 빈도 반영"
      />
      <div className="min-h-0 flex-1 space-y-3 overflow-hidden">
        <div className="rounded-[12px] border border-carbon bg-paper p-4 text-center shadow-[var(--shadow-subtle)]">
          <p className="font-display text-[11px] text-fog">진행</p>
          <p className="mt-1 font-display text-[28px] font-bold text-ink">12 / 40</p>
          <div className="mx-auto mt-3 h-2 max-w-[160px] overflow-hidden rounded-full bg-mist">
            <div className="h-full w-[30%] rounded-full bg-electric-blue" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["기출 시험", "랜덤 출제", "회독 기록", "채점하기"].map((label) => (
            <div
              key={label}
              className="rounded-[10px] border border-carbon/80 bg-paper px-2 py-3 text-center font-display text-[11px] font-semibold text-ink shadow-[var(--shadow-subtle)]"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const SCREENS = [
  { id: "subjects", label: "과목", node: <ScreenSubjects /> },
  { id: "study", label: "학습", node: <ScreenStudy /> },
  { id: "quiz", label: "O/X", node: <ScreenQuiz /> },
  { id: "concept", label: "개념", node: <ScreenConcept /> },
  { id: "exam", label: "시험", node: <ScreenExam /> },
];

/** 봄기출 공인중개사 앱 — 여러 화면 자동 미리보기 */
export function AppPhonePreview() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % SCREENS.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div className="mx-auto w-full max-w-[280px]">
      <p className="mb-2 text-center font-display text-[12px] font-medium text-fog">
        봄기출 공인중개사 앱
      </p>
      <div
        className="relative mx-auto overflow-hidden rounded-[2rem] border border-mist bg-snow p-1.5 shadow-[var(--shadow-card)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="absolute left-1/2 top-2.5 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-mist" />

        <div className="overflow-hidden rounded-[1.4rem] bg-snow">
          <div className="relative h-[480px] overflow-hidden">
            {SCREENS.map((screen, i) => (
              <div
                key={screen.id}
                className={`absolute inset-0 flex flex-col px-3 pb-3 pt-8 transition-all duration-500 ease-out ${
                  i === index
                    ? "translate-x-0 opacity-100"
                    : i < index
                      ? "-translate-x-full opacity-0"
                      : "translate-x-full opacity-0"
                }`}
                aria-hidden={i !== index}
              >
                {screen.node}
                <div className="mt-2 flex justify-center">
                  <div className="h-1 w-24 rounded-full bg-carbon/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {SCREENS.map((screen, i) => (
          <button
            key={screen.id}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index
                ? "w-5 bg-electric-blue"
                : "w-1.5 bg-mist hover:bg-fog"
            }`}
            aria-label={`${screen.label} 화면`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-center font-display text-[11px] text-fog">
        {SCREENS[index].label}
      </p>
    </div>
  );
}
