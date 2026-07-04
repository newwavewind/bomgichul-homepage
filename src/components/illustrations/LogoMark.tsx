import Link from "next/link";
import { BrandLogo } from "@/components/illustrations/BrandLogo";
import { SITE_NAME, SITE_IDENTITY } from "@/lib/constants";

export function LogoMark() {
  return (
    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
      <BrandLogo size="header" priority />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="font-display text-body font-semibold text-ink">{SITE_NAME}</span>
        <span className="hidden font-display text-[12px] font-medium text-smoke sm:block">
          {SITE_IDENTITY}
        </span>
      </span>
    </Link>
  );
}
