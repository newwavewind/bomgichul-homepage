import Link from "next/link";
import {
  PUBLISHER_BUSINESS_NUMBER,
  PUBLISHER_CONTACT_EMAIL,
  SITE_IDENTITY,
  SITE_NAME,
} from "@/lib/constants";

const HUB_LINKS = [
  { href: "/public-service", label: "공무원" },
  { href: "/real-estate", label: "공인중개사" },
  { href: "/police", label: "경찰공무원" },
  { href: "/firefighter", label: "소방공무원" },
  { href: "/housing", label: "주택관리사" },
  { href: "/social-worker", label: "사회복지사" },
  { href: "/history", label: "한국사" },
  { href: "/english", label: "공무원 영어" },
  { href: "/gugeo", label: "공무원 국어" },
  { href: "/haengjeongsa", label: "행정사" },
  { href: "/semusa", label: "세무사" },
  { href: "/sanan", label: "산업안전지도사" },
  { href: "/sonhae", label: "손해평가사" },
  { href: "/nomusa", label: "공인노무사" },
] as const;

const CONCEPT_LINKS = [
  { href: "/concepts/broker-law", label: "중개사법 핵심 개념" },
  { href: "/concepts/civillaw", label: "민법 핵심 개념" },
  { href: "/police/concepts/constitution", label: "경찰 헌법 핵심 개념" },
  { href: "/firefighter/concepts/sobang", label: "소방학개론 핵심 개념" },
  { href: "/public-service/concepts/hangjunghak", label: "행정학 핵심 개념" },
  { href: "/history/concepts", label: "한국사 개념" },
] as const;

const LEGAL_LINKS = [
  { href: "/about", label: "소개" },
  { href: "/contact", label: "문의" },
  { href: "/faq", label: "이용 안내" },
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-mist bg-snow">
      <div className="mx-auto flex max-w-[var(--page-max-width)] flex-col gap-6 px-4 py-8">
        <nav aria-label="시험 허브" className="flex flex-wrap gap-x-4 gap-y-2">
          {HUB_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-[13px] font-semibold text-ink transition-colors hover:text-carbon"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="핵심 개념" className="flex flex-wrap gap-x-4 gap-y-2">
          {CONCEPT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-[12px] text-smoke transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3 border-t border-mist pt-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-[13px] font-medium text-ink">
              {SITE_NAME}
              <span className="mx-1.5 text-fog" aria-hidden>
                ·
              </span>
              <span className="font-normal text-smoke">{SITE_IDENTITY}</span>
            </p>
            <p className="mt-1 font-display text-[12px] leading-relaxed text-fog">
              사업자등록번호 {PUBLISHER_BUSINESS_NUMBER}
              <span className="mx-1.5" aria-hidden>
                ·
              </span>
              문의{" "}
              <a
                href={`mailto:${PUBLISHER_CONTACT_EMAIL}`}
                className="underline underline-offset-2 hover:text-ink"
              >
                {PUBLISHER_CONTACT_EMAIL}
              </a>
            </p>
            <p className="mt-0.5 font-display text-[12px] text-fog">
              © {new Date().getFullYear()} {SITE_NAME}
            </p>
            <p className="mt-2 max-w-xl font-display text-[11px] leading-relaxed text-fog">
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
              제공받습니다. 사이트에는 Google AdSense 등 광고가 표시될 수 있습니다.
            </p>
          </div>
          <nav
            aria-label="사이트 정보"
            className="flex flex-wrap items-center gap-x-4"
          >
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center font-display text-[12px] text-fog transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
