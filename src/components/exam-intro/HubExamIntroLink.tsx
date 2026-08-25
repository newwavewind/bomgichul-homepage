import Link from "next/link";

/** 학습 허브 상단 — 시험 소개 페이지로 돌아가는 한 줄 링크 */
export function HubExamIntroLink({ href, label }: { href: string; label: string }) {
  return (
    <p className="font-display text-body-sm text-smoke">
      <Link
        href={href}
        className="font-semibold text-electric-blue underline-offset-2 hover:underline"
      >
        {label} 시험 안내
      </Link>
      <span className="text-fog"> · 직렬·과목·일정·원서 접수</span>
    </p>
  );
}
