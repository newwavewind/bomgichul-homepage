import type { ReactNode } from "react";
import { PcStudyAction } from "@/components/pc-pro/PcStudyAction";
import type { PcStudyOffer } from "@/lib/pc-access/study-features";
import Link from "next/link";
export function SubjectLearningCard({
  label,
  badge,
  examCount,
  examHref,
  dailyHref,
  lectureHref,
  cellOffers = [],
  extraActions,
}: {
  label: string;
  badge: string;
  examCount: number;
  examHref: string;
  dailyHref?: string;
  lectureHref?: string;
  cellOffers?: PcStudyOffer[];
  extraActions?: ReactNode;
}) {
  const columns = 1 + Number(Boolean(dailyHref)) + Number(Boolean(lectureHref)) + Number(cellOffers.length > 0);
  const compact = columns >= 3;
  const actionClass = compact
    ? "flex min-h-11 items-center justify-center rounded-[12px] py-2.5 text-center font-semibold transition-colors px-1.5 text-xs sm:text-sm"
    : "flex min-h-11 items-center justify-center rounded-[12px] px-3 py-2.5 text-center text-sm font-semibold transition-colors";
  const secondaryActionClass = `${actionClass} border border-[color:light-dark(#9dbbe0,var(--color-mist))] bg-paper text-carbon hover:bg-[color:light-dark(#f4f8fd,color-mix(in_srgb,var(--color-snow)_90%,#f4f8fd))]`;
  return (
    <article className="rounded-[20px] border border-[color:light-dark(#d8e3ef,var(--color-mist))] bg-paper p-5 shadow-[0_4px_18px_rgba(15,23,42,0.035)] transition-colors hover:border-[color:light-dark(#b8cde4,var(--color-mist))]">
      <p className="mb-3 font-display text-xs text-fog">{badge}</p>
      <h3 className="font-display text-[22px] font-semibold leading-[1.3] text-ink">
        {label}
      </h3>
      <p className="mt-1.5 font-display text-sm leading-5 text-smoke">
        {examCount > 0 ? `기출 ${examCount}문항` : "연도별 기출과 선지 해설"}
      </p>
      <div className={`mt-5 grid gap-2 ${columns === 4 ? "grid-cols-2" : columns === 3 ? "grid-cols-3" : columns === 2 ? "grid-cols-2" : ""}`}>
        <Link
          href={examHref}
          className={`${actionClass} bg-carbon text-paper hover:bg-midnight`}
        >
          문제 풀기
        </Link>
        {dailyHref ? (
          <Link
            href={dailyHref}
            className={secondaryActionClass}
          >
            매일 10문제
          </Link>
        ) : null}
        <PcStudyAction feature="cells" offers={cellOffers} subjectLabel={label} className={`${actionClass} gap-1 border border-mist bg-paper text-carbon hover:bg-snow`}/>
        {lectureHref ? (
          <Link
            href={lectureHref}
            aria-label={`${label} 강의 보기`}
            className={secondaryActionClass}
          >
            강의 보기
          </Link>
        ) : null}
      </div>
      {extraActions}
    </article>
  );
}
