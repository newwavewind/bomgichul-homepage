import Link from "next/link";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import { BrandLockup } from "@/components/ui/BrandLockup";
import { SITE_NAME, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-mist/60 bg-paper">
      <div className="mx-auto max-w-[var(--page-max-width)] px-4 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <BrandLockup variant="footer" />
            <p className="mt-4 max-w-sm font-display text-body-sm text-smoke">
              기출을 풀다 막히면 AI에게 물을 질문까지 만들어 주는
              수험생 학습 앱 &amp; 커뮤니티.
            </p>
            <AppStoreButtons className="mt-5" size="sm" />
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
        <div className="mt-12 flex flex-col gap-2 border-t border-mist/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <BrandLockup variant="compact" />
          <p className="font-display text-body-sm text-fog">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
