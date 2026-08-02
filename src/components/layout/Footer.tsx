import Link from "next/link";
import {
  SITE_NAME,
  NAV_LINKS,
  flattenNavLinks,
  SITE_IDENTITY,
  EXAM_SUBJECTS,
  ARCHIVE_SUBJECT_MAP,
} from "@/lib/constants";
import type { ExamSubject } from "@/lib/exam-questions";

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
          {flattenNavLinks(NAV_LINKS).map((link) => (
            <NavItem key={`${link.href}-${link.label}`} href={link.href}>
              {link.label}
            </NavItem>
          ))}
          <NavItem href="/login">로그인</NavItem>
          <NavItem href="/privacy">개인정보처리방침</NavItem>
        </nav>
      </div>
      <div className="border-t border-mist/70">
        <div className="mx-auto flex max-w-[var(--page-max-width)] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
          <Link href="/public-service" className="font-display text-[12px] font-semibold text-smoke hover:text-ink">
            공무원
          </Link>
          {[
            ["hangjunghak", "행정학개론"],
            ["haengjeongbeop", "행정법총론"],
            ["sebeop", "세법개론"],
            ["hyeongbeop", "형법"],
            ["bokji", "사회복지학개론"],
            ["sobang", "소방학개론"],
          ].map(([id, label]) => (
            <Link
              key={id}
              href={`/public-service/concepts/${id}`}
              className="font-display text-[12px] text-fog transition-colors hover:text-ink"
            >
              {label}
            </Link>
          ))}
          <Link href="/public-service" className="font-display text-[12px] text-fog transition-colors hover:text-ink">
            전체 16과목
          </Link>
        </div>
      </div>
      <div className="border-t border-mist/70">
        <div className="mx-auto flex max-w-[var(--page-max-width)] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
          <Link href="/real-estate" className="font-display text-[12px] font-semibold text-smoke hover:text-ink">
            공인중개사
          </Link>
          {EXAM_SUBJECTS.map((s) => (
            <Link
              key={`concept-${s.value}`}
              href={`/concepts/${s.value}`}
              className="font-display text-[12px] text-fog transition-colors hover:text-ink"
            >
              {ARCHIVE_SUBJECT_MAP[s.value as ExamSubject]}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
