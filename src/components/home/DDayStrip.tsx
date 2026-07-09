import Link from "next/link";
import { getExamCountdown } from "@/lib/exam";

export function DDayStrip() {
  const { exam, days, label } = getExamCountdown();

  return (
    <Link
      href="/diary"
      className="mx-auto flex max-w-[var(--page-max-width)] w-fit items-center justify-center gap-1.5 rounded-full border border-carbon/60 bg-lavender/80 px-2.5 py-1 font-display text-[11px] leading-tight text-ink transition-opacity hover:opacity-90"
    >
      <span className="hidden sm:inline">{exam.label} 공인중개사 시험까지</span>
      <span className="sm:hidden">시험까지</span>
      <span
        className={`font-semibold ${
          days <= 30 && days >= 0 ? "text-amber" : "text-ink"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
