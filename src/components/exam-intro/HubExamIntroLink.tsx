import Link from "next/link";

/** 학습 허브 상단 — 시험 안내와 웹 학습 도구 진입 링크 */
export function HubExamIntroLink({ href, label }: { href: string; label: string }) {
  return (
    <div>
      <p className="font-display text-body-sm text-smoke">
        <Link
          href={href}
          className="font-semibold text-electric-blue underline-offset-2 hover:underline"
        >
          {label} 시험 안내
        </Link>
        <span className="text-fog"> · 과목·일정·원서 접수</span>
      </p>
      <nav className="web-actions mt-3" aria-label="학습 도구">
        <Link href="/study-tools">주간 보고서 · 학습 계획 · 오답 요약집</Link>
        <Link href="/#exam-selection">다른 시험 선택</Link>
      </nav>
    </div>
  );
}
