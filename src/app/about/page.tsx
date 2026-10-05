import type { Metadata } from "next";
import Link from "next/link";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import {
  PUBLISHER_BUSINESS_NUMBER,
  PUBLISHER_CONTACT_EMAIL,
  PUBLISHER_LEGAL_NAME,
  SITE_NAME,
  SITE_PLATFORM,
  SITE_URL,
} from "@/lib/constants";
import { absoluteUrl, buildOrganizationJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "소개",
  description:
    "봄기출은 공무원·공인중개사·경찰·소방 등 국가시험 기출문제와 자체 해설·핵심 개념을 무료로 제공하는 학습 사이트입니다. 운영 주체와 문의 방법을 안내합니다.",
  path: "/about",
});

const CONTENT_PILLARS = [
  {
    title: "기출문제와 해설",
    body: "시행기관이 공개한 기출을 과목·연도별로 정리하고, 봄기출이 직접 쓴 선지 해설과 쉬운 해설을 붙입니다. 홈페이지 학습 기능은 로그인만 하면 전부 무료입니다.",
  },
  {
    title: "기출 올인원 개념",
    body: "단원별 핵심 개념·조문·판례 포인트를 카드로 묶어, 문제만 푸는 학습이 아니라 개념을 다시 짚을 수 있게 합니다.",
  },
  {
    title: "수험생 커뮤니티",
    body: "오류 신고, 학습 질문, 자료실을 시험별로 운영합니다. 앱에서 보낸 문항 오류 제보도 해당 시험 커뮤니티에 모아 공개합니다.",
  },
] as const;

const EXAM_TRACKS = [
  { href: "/public-service", label: "9급 공무원" },
  { href: "/real-estate", label: "공인중개사" },
  { href: "/police", label: "경찰공무원" },
  { href: "/firefighter", label: "소방공무원" },
  { href: "/housing", label: "주택관리사" },
  { href: "/social-worker", label: "사회복지사 1급" },
  { href: "/history", label: "한국사능력검정" },
  { href: "/english", label: "공무원 영어" },
  { href: "/gugeo", label: "공무원 국어" },
  { href: "/haengjeongsa", label: "행정사" },
  { href: "/semusa", label: "세무사" },
  { href: "/sanan", label: "산업안전지도사" },
  { href: "/sonhae", label: "손해평가사" },
  { href: "/nomusa", label: "공인노무사" },
] as const;

export default function AboutPage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `${SITE_NAME} 소개`,
    url: absoluteUrl("/about"),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: buildOrganizationJsonLd(),
  };

  return (
    <div className="px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mx-auto max-w-2xl">
          <EyebrowLabel className="mb-2">ABOUT</EyebrowLabel>
          <SectionHeading as="h1">{SITE_NAME} 소개</SectionHeading>
          <p className="mt-4 font-display text-body leading-relaxed text-smoke">
            {SITE_NAME}은 {SITE_PLATFORM}입니다. 국가시험 기출을 한곳에 모아, 자체
            해설과 개념 정리로 수험생이 바로 학습할 수 있게 만드는 것이 목표입니다.
          </p>

          <section className="mt-10">
            <h2 className="mb-3 font-display text-subheading font-semibold text-ink">
              무엇을 제공하나요
            </h2>
            <p className="font-display text-body-sm leading-relaxed text-smoke">
              단순 문제 모음이 아니라, 과목·단원 구조와 해설·개념을 함께 둡니다.
              모바일 앱과 PC 학습 서비스도 같은 봄기출 브랜드로 운영하며, 홈페이지는
              광고·제휴와 별개로 학습 본문을 먼저 보여 줍니다.
            </p>
            <ul className="mt-5 space-y-4">
              {CONTENT_PILLARS.map((item) => (
                <li key={item.title} className="rounded-[var(--radius-cards)] border border-mist bg-paper px-5 py-4">
                  <h3 className="font-display text-[15px] font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 font-display text-body-sm leading-relaxed text-smoke">
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="mb-3 font-display text-subheading font-semibold text-ink">
              다루는 시험
            </h2>
            <p className="mb-4 font-display text-body-sm leading-relaxed text-smoke">
              아래 시험 허브에서 기출·개념·커뮤니티로 바로 들어갈 수 있습니다.
            </p>
            <ul className="flex flex-wrap gap-2">
              {EXAM_TRACKS.map((track) => (
                <li key={track.href}>
                  <Link
                    href={track.href}
                    className="inline-flex min-h-10 items-center rounded-full border border-mist bg-snow px-3.5 font-display text-[13px] font-semibold text-ink transition-colors hover:border-carbon hover:bg-paper"
                  >
                    {track.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="mb-3 font-display text-subheading font-semibold text-ink">
              콘텐츠와 저작권
            </h2>
            <p className="font-display text-body-sm leading-relaxed text-smoke">
              기출 지문·보기는 각 시험 시행기관이 공개한 자료이며 저작권은 해당
              기관에 있습니다. 해설, 쉬운 해설, 기출 올인원 개념 정리, 분류 체계와
              화면 구성은 {SITE_NAME}이 직접 작성·편집한 원작입니다. 개인 학습
              목적 외 무단 복제·배포는 이용약관에서 금지합니다.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="mb-3 font-display text-subheading font-semibold text-ink">
              광고·제휴
            </h2>
            <p className="font-display text-body-sm leading-relaxed text-smoke">
              사이트 운영을 위해 Google AdSense 등 광고와 쿠팡파트너스 제휴를 이용할
              수 있습니다. 광고는 학습 본문을 가리지 않도록 배치하며, 쿠키·맞춤형
              광고에 관한 안내는{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
                개인정보처리방침
              </Link>
              을 따릅니다.
            </p>
          </section>

          <section id="contact" className="mt-10 scroll-mt-24">
            <h2 className="mb-3 font-display text-subheading font-semibold text-ink">
              운영 주체·문의
            </h2>
            <ul className="list-disc space-y-1.5 pl-5 font-display text-body-sm leading-relaxed text-smoke">
              <li>상호: {PUBLISHER_LEGAL_NAME}</li>
              <li>사업자등록번호: {PUBLISHER_BUSINESS_NUMBER}</li>
              <li>
                문의 이메일:{" "}
                <a
                  href={`mailto:${PUBLISHER_CONTACT_EMAIL}`}
                  className="underline underline-offset-2 hover:text-ink"
                >
                  {PUBLISHER_CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            <p className="mt-3 font-display text-body-sm leading-relaxed text-smoke">
              문항 오류·서비스 문의는 이메일로 받습니다. 이용 조건은{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-ink">
                이용약관
              </Link>
              , 개인정보 처리는{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
                개인정보처리방침
              </Link>
              을 확인해 주세요. 별도 문의 페이지만 필요하면{" "}
              <Link href="/contact" className="underline underline-offset-2 hover:text-ink">
                문의하기
              </Link>
              로 이동할 수 있습니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
