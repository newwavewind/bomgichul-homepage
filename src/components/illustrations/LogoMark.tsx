import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function LogoMark() {
  return (
    <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 18L12 6L18 18"
          stroke="#1e1e1e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 14H16"
          stroke="#1e1e1e"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="font-display text-body font-medium text-ink">{SITE_NAME}</span>
        <span className="hidden font-display text-[11px] font-medium text-smoke sm:block">
          {SITE_TAGLINE}
        </span>
      </span>
    </Link>
  );
}
