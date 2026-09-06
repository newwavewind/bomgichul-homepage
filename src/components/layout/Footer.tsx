import Link from "next/link";
import { SITE_NAME, SITE_IDENTITY } from "@/lib/constants";

const HUB_LINKS = [
  { href: "/public-service", label: "공무원" },
  { href: "/real-estate", label: "공인중개사" },
  { href: "/police", label: "경찰공무원" },
  { href: "/housing", label: "주택관리사" },
  { href: "/social-worker", label: "사회복지사" },
  { href: "/history", label: "한국사" },
  { href: "/english", label: "공무원 영어" },
] as const;

const CONCEPT_LINKS = [
  { href: "/concepts/broker-law", label: "중개사법 올인원" },
  { href: "/concepts/civillaw", label: "민법 올인원" },
  { href: "/police/concepts/constitution", label: "경찰 헌법 올인원" },
  { href: "/public-service/concepts/hangjunghak", label: "행정학 올인원" },
  { href: "/history/concepts", label: "한국사 개념" },
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
        <nav aria-label="기출 올인원" className="flex flex-wrap gap-x-4 gap-y-2">
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
        <div className="flex flex-col gap-3 border-t border-mist pt-5 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="flex flex-wrap items-center gap-x-4">
            <Link
              href="/terms"
              className="inline-flex min-h-11 items-center font-display text-[12px] text-fog transition-colors hover:text-ink"
            >
              이용약관
            </Link>
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center font-display text-[12px] text-fog transition-colors hover:text-ink"
            >
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
