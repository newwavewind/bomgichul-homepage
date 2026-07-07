import Link from "next/link";
import { BrandLogo } from "@/components/illustrations/BrandLogo";
import { SITE_NAME, NAV_LINKS, SITE_IDENTITY, ARCHIVE_SUBJECTS } from "@/lib/constants";

function NavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className =
    "font-display text-[12px] text-fog transition-colors hover:text-ink";
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

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
            <NavItem key={link.href} href={link.href}>
              {link.label}
            </NavItem>
          ))}
          <NavItem href="/login">로그인</NavItem>
        </nav>
      </div>
      <div className="border-t border-mist/70">
        <div className="mx-auto flex max-w-[var(--page-max-width)] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
          <span className="font-display text-[12px] text-fog">과목별 기출·자료</span>
          {ARCHIVE_SUBJECTS.filter((s) => s.value !== "all" && s.value !== "other").map(
            (s) => (
              <Link
                key={s.value}
                href={`/subjects/${s.value}`}
                className="font-display text-[12px] text-fog transition-colors hover:text-ink"
              >
                {s.label}
              </Link>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
