import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import { FAQAccordion } from "@/components/ui/FAQ";
import { GuideContent } from "@/components/faq/GuideContent";
import { FAQ_ITEMS, SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "이용 안내",
  description:
    "봄기출 홈페이지 이용 안내. 학습 홈, 기출 all-in-one, 기출문제, 커뮤니티, 자료실, 무료·프리미엄을 쉽게 설명합니다.",
  alternates: { canonical: absoluteUrl("/faq") },
  openGraph: {
    title: `이용 안내 | ${SITE_NAME}`,
    description:
      "봄기출 홈페이지 기능을 하나씩 설명하는 가이드와 자주 묻는 질문입니다.",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className="px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-12 max-w-2xl">
          <EyebrowLabel className="mb-2">DOCS</EyebrowLabel>
          <SectionHeading as="h1">봄기출 홈페이지 이용 안내</SectionHeading>
          <p className="mt-4 font-display text-body text-smoke">
            예전 FAQ는 지웠습니다. 지금 사이트에 있는 기능을 기준으로, 화면을 따라가며
            하나씩 설명하는 버전으로 다시 썼어요.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton href="/">학습 홈 열기</PrimaryButton>
            <OutlineButton href="#faq">짧은 질문만 보기</OutlineButton>
          </div>
        </div>

        <GuideContent />

        <section id="faq" className="mt-16 scroll-mt-24">
          <div className="mb-8 max-w-xl">
            <EyebrowLabel className="mb-2">FAQ</EyebrowLabel>
            <SectionHeading as="h2">자주 묻는 질문</SectionHeading>
            <p className="mt-3 font-display text-body-sm text-smoke">
              위 가이드를 다 읽지 않아도, 궁금한 점만 빠르게 확인할 수 있어요.
            </p>
          </div>
          <div className="mx-auto max-w-2xl rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper px-5 shadow-[var(--shadow-card)] md:px-8">
            <FAQAccordion items={FAQ_ITEMS} />
          </div>
        </section>

        <ElevatedCard className="mt-12 p-8 text-center">
          <SectionHeading as="h2" className="mb-3">
            더 궁금한 점이 있나요?
          </SectionHeading>
          <p className="mx-auto max-w-md font-display text-body-sm text-smoke">
            커뮤니티 「질문」에 남겨 주세요. 다른 수험생과 함께 답을 찾아볼 수 있어요.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <PrimaryButton href="/community?category=question">커뮤니티에 질문하기</PrimaryButton>
          </div>
        </ElevatedCard>
      </div>
    </div>
  );
}
