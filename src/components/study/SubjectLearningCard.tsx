import Link from "next/link";
export function SubjectLearningCard({
  label,
  badge,
  examCount,
  conceptCount,
  examHref,
  conceptHref,
}: {
  label: string;
  badge: string;
  examCount: number;
  conceptCount: number;
  examHref: string;
  conceptHref?: string;
}) {
  return (
    <article className="rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-paper p-6 shadow-[var(--shadow-card)]">
      <p className="mb-5 font-display text-xs text-smoke">{badge}</p>
      <h3 className="font-display text-subheading font-semibold text-ink">
        {label}
      </h3>
      <p className="mt-2 font-display text-body-sm text-smoke">
        {/* 트랙을 먼저 세우고 기출을 뒤에 싣는 시험(경비지도사)에서 「0문항」으로 보이지 않게 */}
        {examCount > 0 ? `기출 ${examCount}문항` : "기출 싣는 중"}
        {conceptCount > 0 ? ` · 핵심 개념 ${conceptCount}개` : ""}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link
          href={examHref}
          className="rounded-xl bg-carbon px-3 py-3 text-center text-sm font-semibold text-paper"
        >
          문제 풀기
        </Link>
        {conceptHref ? (
          <Link
            href={conceptHref}
            className="rounded-xl border border-carbon/40 bg-[#e8f0ff] px-3 py-3 text-center text-sm font-semibold text-carbon"
          >
            핵심 개념
          </Link>
        ) : (
          <p className="rounded-xl bg-snow px-3 py-3 text-xs text-smoke">
            단원별 개념 준비 중<br />
            {examCount > 0 ? "기출 해설은 이용 가능" : "기출·해설도 곧 열립니다"}
          </p>
        )}
      </div>
    </article>
  );
}
