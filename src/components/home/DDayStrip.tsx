import Link from "next/link";
import { getExamCountdown } from "@/lib/exam";

export function DDayStrip() {
  const { exam, days, label } = getExamCountdown();

  return (
    <Link
      href="/diary"
      className="mx-auto flex max-w-[var(--page-max-width)] items-center justify-center gap-2 rounded-[var(--radius-buttons)] border-[1.5px] border-carbon bg-lavender px-4 py-2.5 font-display text-body-sm text-ink shadow-[var(--shadow-button)] transition-opacity hover:opacity-90 md:gap-3"
    >
      <span className="hidden sm:inline">{exam.label} 공인중개사 시험까지</span>
      <span className="sm:hidden">시험까지</span>
      <span
        className={`font-display text-body font-bold ${
          days <= 30 && days >= 0 ? "text-amber" : "text-ink"
        }`}
      >
        {label}
      </span>
      <span className="hidden text-fog md:inline">— 수험일기에서 함께 카운트다운해요 →</span>
    </Link>
  );
}
