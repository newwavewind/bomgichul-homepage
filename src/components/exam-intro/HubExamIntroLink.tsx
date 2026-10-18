import Link from "next/link";
import { BackLinkChevron } from "@/components/ui/backLinkShared";

export function HubBackButton() {
  return (
    <Link
      href="/#exam-selection"
      aria-label="시험 선택으로 돌아가기"
      className="group shrink-0"
    >
      <BackLinkChevron />
    </Link>
  );
}

/** 학습 허브 상단 — 시험 안내와 웹 학습 도구 진입 링크 */
export function HubExamIntroLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group ml-[54px] inline-flex max-w-[calc(100%-54px)] flex-wrap items-center gap-x-1.5 gap-y-1 font-display text-[13px]"
    >
      <span className="font-semibold text-[#087f73] group-hover:underline">
        {label} 시험 안내
      </span>
      <span className="text-[#718096]">· 과목 · 일정 · 원서 접수</span>
      <span aria-hidden="true" className="text-[#718096]">›</span>
    </Link>
  );
}
