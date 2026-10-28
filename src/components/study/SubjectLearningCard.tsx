import Link from "next/link";
export function SubjectLearningCard({
  label,
  badge,
  examCount,
  examHref,
  dailyHref,
  lectureHref,
}: {
  label: string;
  badge: string;
  examCount: number;
  examHref: string;
  dailyHref?: string;
  lectureHref?: string;
}) {
  const columns = lectureHref && dailyHref ? 3 : dailyHref ? 2 : 1;
  const compact = columns === 3;
  const actionClass = compact
    ? "flex min-h-11 items-center justify-center rounded-[12px] py-2.5 text-center font-semibold transition-colors px-1.5 text-xs sm:text-sm"
    : "flex min-h-11 items-center justify-center rounded-[12px] px-3 py-2.5 text-center text-sm font-semibold transition-colors";
  return (
    <article className="rounded-[20px] border border-[#d8e3ef] bg-paper p-5 shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-colors hover:border-[#b8cde4]">
      <p className="mb-3 font-display text-xs text-fog">{badge}</p>
      <h3 className="font-display text-[22px] font-semibold leading-[1.3] text-ink">
        {label}
      </h3>
      <p className="mt-1.5 font-display text-sm leading-5 text-smoke">
        {examCount > 0 ? `기출 ${examCount}문항` : "연도별 기출과 선지 해설"}
      </p>
      <div className={`mt-5 grid gap-2 ${columns === 3 ? "grid-cols-3" : columns === 2 ? "grid-cols-2" : ""}`}>
        <Link
          href={examHref}
          className={`${actionClass} bg-carbon text-paper hover:bg-midnight`}
        >
          문제 풀기
        </Link>
        {dailyHref ? (
          <Link
            href={dailyHref}
            className={`${actionClass} border border-[#9dbbe0] bg-paper text-carbon hover:bg-[#f4f8fd]`}
          >
            매일 10문제
          </Link>
        ) : null}
        {lectureHref ? (
          <Link
            href={lectureHref}
            aria-label={`${label} 강의 보기 (새로 나옴)`}
            className={`relative z-[1] ${actionClass} border border-[#f5b7dc] bg-[#ffebf6] text-[#6b1458] hover:bg-[#fff3fa]`}
          >
            강의 보기
            <span
              aria-hidden
              className="pointer-events-none absolute -right-1.5 -top-2 rotate-[-8deg] rounded-full border border-white bg-[#e8ff3a] px-[7px] py-[2px] font-display text-[9px] font-extrabold leading-none tracking-[0.12em] text-[#355000] shadow-[0_1px_5px_rgba(90,120,0,0.28)]"
            >
              NEW
            </span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
