import Link from "next/link";
export function SubjectLearningCard({
  label,
  badge,
  examCount,
  examHref,
  dailyHref,
}: {
  label: string;
  badge: string;
  examCount: number;
  examHref: string;
  dailyHref?: string;
}) {
  return (
    <article className="rounded-[20px] border border-[#d8e3ef] bg-paper p-5 shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-colors hover:border-[#b8cde4]">
      <p className="mb-3 font-display text-xs text-fog">{badge}</p>
      <h3 className="font-display text-[22px] font-semibold leading-[1.3] text-ink">
        {label}
      </h3>
      <p className="mt-1.5 font-display text-sm leading-5 text-smoke">
        {examCount > 0 ? `기출 ${examCount}문항` : "연도별 기출과 선지 해설"}
      </p>
      <div className={`mt-5 grid gap-2 ${dailyHref ? "grid-cols-2" : ""}`}>
        <Link
          href={examHref}
          className="flex min-h-11 items-center justify-center rounded-[12px] bg-carbon px-3 py-2.5 text-center text-sm font-semibold text-paper transition-colors hover:bg-midnight"
        >
          문제 풀기
        </Link>
        {dailyHref ? (
          <Link
            href={dailyHref}
            className="flex min-h-11 items-center justify-center rounded-[12px] border border-[#9dbbe0] bg-paper px-3 py-2.5 text-center text-sm font-semibold text-carbon transition-colors hover:bg-[#f4f8fd]"
          >
            매일 10문제
          </Link>
        ) : null}
      </div>
    </article>
  );
}
