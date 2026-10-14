import Link from "next/link";

export function DailyEntry({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-[24px] border border-[#d7e6f8] bg-white/80 px-5 py-4 shadow-[0_8px_24px_rgba(0,122,255,0.06)] backdrop-blur-xl transition-transform hover:-translate-y-0.5"
    >
      <span className="text-xs font-semibold tracking-wide text-[#0066D6]">오늘</span>
      <span className="font-display text-lg font-semibold text-ink">매일 10문제</span>
      <span className="text-sm text-[#475569]">과목을 고른 뒤, 그 과목 기출 10문제와 순위를 봅니다.</span>
    </Link>
  );
}
