"use client";

import Link from "next/link";

export function LoginSoftNudge({
  title,
  body,
  href,
  cta = "로그인",
  onDismiss,
}: {
  title: string;
  body: string;
  href: string;
  cta?: string;
  onDismiss?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-ios-blue/25 bg-ios-blue/[0.06] px-4 py-3.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-display text-[13px] font-semibold text-ink">{title}</p>
          <p className="mt-1 font-display text-[13px] leading-relaxed text-smoke">{body}</p>
        </div>
        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 font-display text-[12px] text-fog hover:text-smoke"
            aria-label="닫기"
          >
            닫기
          </button>
        ) : null}
      </div>
      <Link
        href={href}
        className="mt-3 inline-flex min-h-10 items-center rounded-full bg-[#3b6fd4] px-4 font-display text-[13px] font-semibold text-paper hover:bg-[#3463be]"
      >
        {cta}
      </Link>
    </div>
  );
}
