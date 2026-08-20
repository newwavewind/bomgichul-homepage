import Link from "next/link";
import { SITE_NAME, SITE_IDENTITY } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-mist bg-snow">
      <div className="mx-auto flex max-w-[var(--page-max-width)] flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
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
        <Link
          href="/privacy"
          className="inline-flex min-h-11 items-center font-display text-[12px] text-fog transition-colors hover:text-ink"
        >
          개인정보처리방침
        </Link>
      </div>
    </footer>
  );
}
