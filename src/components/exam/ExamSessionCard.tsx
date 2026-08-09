import Link from "next/link";

export function ExamSessionCard({ href, year, questionCount }: {
  href: string;
  year: number;
  questionCount: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-4 rounded-2xl border-[1.5px] border-carbon bg-paper p-5 shadow-[var(--shadow-subtle)] transition-transform hover:-translate-y-0.5"
    >
      <div>
        <h4 className="font-display text-[21px] font-semibold text-ink">{year}년</h4>
        <p className="mt-1 font-display text-body-sm text-smoke">
          {questionCount}문항 · 해설 포함
        </p>
      </div>
      <span className="font-display text-body text-fog" aria-hidden>→</span>
    </Link>
  );
}
