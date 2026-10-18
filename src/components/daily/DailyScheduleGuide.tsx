"use client";

import Link from "next/link";
import { useEffect } from "react";
import { DailyForgettingCurve } from "@/components/daily/DailyForgettingCurve";
import type { DailyComposition } from "@/lib/daily-challenge/types";

export function DailyScheduleGuide({
  composition,
  exam,
  subjectId,
  subjectLabel,
  onClose,
}: {
  composition: DailyComposition;
  exam: string;
  subjectId: string;
  subjectLabel: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#14243A]/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-schedule-title"
        className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#007AFF]">봄기출 매일 10문제</p>
            <h2 id="daily-schedule-title" className="mt-1 font-display text-2xl font-semibold text-ink">
              한 번씩 풀고, 다시 만나는 복습
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="안내 닫기" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F2F5F9] text-lg text-[#475569] hover:bg-[#E7EEF6]">×</button>
        </div>

        <p className="mt-4 text-sm leading-6 text-[#475569]">
          {subjectLabel}의 최근 10개년 객관식 기출 {composition.poolCount.toLocaleString()}문제를
          하루 10문제씩 만납니다. 한 순환 안에서는 모든 문제를 한 번 보기 전까지 중복 출제하지 않습니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-[#475569]">
          과목마다 문제 순서를 무작위로 섞어 날짜별로 고정하므로 같은 날에는 누구나 같은 문제를 풉니다. 전체를 다 만나면 순서를 다시 섞어 다음 순환을 시작합니다.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#F3F8FE] p-4">
            <p className="text-xs font-medium text-[#64748B]">문제 전체를 한 번 만나는 순환</p>
            <p className="mt-1 text-xl font-semibold text-[#0066D6]">약 {composition.rotationDays}일</p>
          </div>
          <div className="rounded-2xl bg-[#F3F8FE] p-4">
            <p className="text-xs font-medium text-[#64748B]">지금부터 매일 풀 때</p>
            <p className="mt-1 text-xl font-semibold text-[#0066D6]">약 {composition.daysFromToday}일</p>
          </div>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#64748B]">
          2026년 10월 17일부터 새 순환표가 적용됩니다. 하루의 마지막 10문제가 순환 경계를 넘으면 새 순환의 문제로 채웁니다. 새 기출이 추가되면 문제 수와 예상 일수는 달라질 수 있습니다.
        </p>

        <div className="mt-8 border-t border-[#E8EEF5] pt-7">
          <p className="text-[11px] font-bold tracking-[0.12em] text-[#0066D6]">THE SCIENCE OF REVIEW</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">망각 곡선은 무엇을 보여줄까요?</h3>
          <p className="mt-2 text-sm leading-7 text-[#475569]">
            에빙하우스가 1885년 발표한 연구에서는 무의미 음절을 외운 뒤, 시간이 지난 후 같은 내용을 다시 익히는 데 걸린 시간을 측정했습니다. 처음 학습에 비해 재학습 시간이 얼마나 줄었는지를 아래에 표시했습니다. 시간이 흐르면서 절약 폭이 처음에 빠르게, 이후에는 천천히 줄어드는 모습이 보입니다.
          </p>
          <DailyForgettingCurve />
          <div className="mt-3 rounded-2xl border border-[#E3EAF1] bg-[#FAFBFD] px-4 py-3 text-xs leading-6 text-[#52657C]">
            <strong className="text-ink">그래프를 읽을 때</strong> · 세로축의 33.7%는 “하루 뒤 문제를 33.7% 기억한다”는 뜻이 아닙니다. 원래 학습 시간보다 재학습에 필요한 시간이 33.7% 적었다는 뜻입니다. 한 사람의 무의미 음절 실험에서 나온 수치이므로 기출문제나 모든 학습자에게 그대로 적용할 수 없습니다. 점 사이의 선은 관측값을 읽기 쉽게 연결한 것입니다.
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-display text-lg font-semibold text-ink">후속 연구가 더해 준 두 가지</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#E2EAF4] bg-white p-4">
              <span className="inline-flex rounded-full bg-[#EDF6FF] px-2.5 py-1 text-[11px] font-bold text-[#0066D6]">간격을 두고 학습</span>
              <p className="mt-2 text-sm leading-6 text-[#475569]">
                분산 학습 메타분석은 여러 번의 학습을 시간상 띄우는 방식이 기억 유지에 도움이 된다고 보고했습니다. 적절한 간격은 나중에 얼마나 오래 기억해야 하는지에 따라 달라집니다.
              </p>
            </div>
            <div className="rounded-2xl border border-[#E2EAF4] bg-white p-4">
              <span className="inline-flex rounded-full bg-[#EDF6FF] px-2.5 py-1 text-[11px] font-bold text-[#0066D6]">답을 꺼내 보는 연습</span>
              <p className="mt-2 text-sm leading-6 text-[#475569]">
                반복해서 읽기만 하는 것보다 답을 직접 떠올려 보는 연습이 지연된 회상에 도움이 된다는 실험이 있습니다. 답을 고른 뒤 정답과 해설을 확인하는 이유입니다.
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-[#64748B]">
            연구에서 확인된 효과를 봄기출 이용자의 기억력 향상 수치로 옮겨 말하지 않습니다. 아래는 이 원리를 학습 흐름에 적용한 방법입니다.
          </p>
        </div>

        <div className="mt-7 rounded-[22px] bg-[#F5F9FE] p-4 sm:p-5">
          <h3 className="font-display text-lg font-semibold text-ink">봄기출에서는 이렇게 이어집니다</h3>
          <ol className="mt-4 space-y-3">
            {[
              ["01", "오늘 10문제", "답을 직접 고르고 바로 채점합니다. 읽을 때의 익숙함과 실제로 답을 찾는 능력을 구분할 수 있습니다."],
              ["02", "틀린 문제 살펴보기", "정답과 해설을 확인하고, 필요한 문제는 오늘의 복습에서 다시 풀어봅니다."],
              ["03", "전체 순환 뒤 다시 만나기", "한 과목의 기출을 모두 한 번씩 만난 뒤 순서를 새로 섞습니다. 예정일과 내 풀이 현황을 보며 학습을 이어갈 수 있습니다."],
            ].map(([number, title, description]) => (
              <li key={number} className="flex gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_2px_10px_rgba(25,60,102,0.04)]">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E6F2FF] text-xs font-bold text-[#0066D6]">{number}</span>
                <div>
                  <strong className="text-sm text-ink">{title}</strong>
                  <p className="mt-0.5 text-xs leading-5 text-[#52657C]">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <Link href={`/${exam}/daily/progress?subject=${encodeURIComponent(subjectId)}`} className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#007AFF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0069D9]">
          내가 푼 문제·안 푼 문제 보기
        </Link>
        <div className="mt-6 border-t border-[#E8EEF5] pt-4 text-xs leading-6 text-[#64748B]">
          <p className="font-semibold text-[#475569]">자료 출처</p>
          <ol className="mt-1 list-inside list-decimal">
            <li><a href="https://psychclassics.yorku.ca/Ebbinghaus/memory7.htm" target="_blank" rel="noreferrer" className="underline underline-offset-2">Ebbinghaus (1885), Memory, Chapter VII</a> — 그래프의 7개 원자료</li>
            <li><a href="https://digitalcommons.usf.edu/psy_facpub/1771/" target="_blank" rel="noreferrer" className="underline underline-offset-2">Cepeda et al. (2006), Psychological Bulletin</a> — 분산 학습 메타분석</li>
            <li><a href="https://doi.org/10.1126/science.1152408" target="_blank" rel="noreferrer" className="underline underline-offset-2">Karpicke &amp; Roediger (2008), Science</a> — 반복 인출 실험</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
