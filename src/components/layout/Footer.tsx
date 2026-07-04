import Link from "next/link";
import { BrandLogo } from "@/components/illustrations/BrandLogo";
import { SITE_NAME, NAV_LINKS, SITE_IDENTITY } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-mist bg-snow">
      <div className="mx-auto flex max-w-[var(--page-max-width)] flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <BrandLogo size="xs" />
          <div>
            <p className="font-display text-[13px] font-medium text-ink">
              {SITE_NAME}
              <span className="mx-1.5 text-fog" aria-hidden>
                ·
              </span>
              <span className="font-normal text-smoke">{SITE_IDENTITY}</span>
            </p>
            <p className="mt-0.5 font-display text-[12px] text-fog">
              © {new Date().getFullYear()} {SITE_NAME}
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-[12px] text-fog transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="font-display text-[12px] text-fog transition-colors hover:text-ink"
          >
            로그인
          </Link>
        </nav>
      </div>
    </footer>
  );
}
