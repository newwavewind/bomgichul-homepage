import { getExamCountdown } from "@/lib/exam";

/** 공인중개사 학습 홈용 D-day 표시 (링크 없음) */
export function DDayStrip() {
  const { exam, days, label } = getExamCountdown();

  return (
    <div className="mx-auto flex max-w-[var(--page-max-width)] w-fit items-center justify-center gap-1.5 rounded-full border border-carbon/60 bg-lavender/80 px-2.5 py-1 font-display text-[11px] leading-tight text-ink">
      <span className="hidden sm:inline">{exam.label} 공인중개사 시험까지</span>
      <span className="sm:hidden">시험까지</span>
      <span
        className={`font-semibold ${
          days <= 30 && days >= 0 ? "text-amber" : "text-ink"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
