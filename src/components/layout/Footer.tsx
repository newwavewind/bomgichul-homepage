import Link from "next/link";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-mist/60 bg-paper">
      <div className="mx-auto max-w-[var(--page-max-width)] px-4 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-subheading font-semibold text-ink">
              {SITE_NAME}
            </p>
            <p className="mt-3 max-w-sm font-display text-body-sm text-smoke">
              수험생을 위한 기출문제 앱 &amp; 커뮤니티.
              질문하고, 자료를 공유하고, 수험 정보를 나눠요.
            </p>
          </div>
          <div>
            <p className="mb-4 font-system text-eyebrow font-semibold uppercase text-fog">
              메뉴
            </p>
            <div className="space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block font-display text-body-sm text-smoke transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 font-system text-eyebrow font-semibold uppercase text-fog">
              계정
            </p>
            <div className="space-y-2">
              <Link href="/login" className="block font-display text-body-sm text-smoke hover:text-ink">
                로그인
              </Link>
              <Link href="/archive/new" className="block font-display text-body-sm text-smoke hover:text-ink">
                자료 올리기
              </Link>
              <Link href="/profile" className="block font-display text-body-sm text-smoke hover:text-ink">
                프로필
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-12 font-display text-body-sm text-fog">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
