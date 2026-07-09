import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading, ElectricHighlight, HandCaption } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import { PrimaryButton, SecondaryButton, OutlineButton } from "@/components/ui/Button";
import { FAQAccordion } from "@/components/ui/FAQ";
import { GuideContent } from "@/components/faq/GuideContent";
import { FAQ_ITEMS, SITE_NAME } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "봄기출 이용 가이드와 자주 묻는 질문. 기능 안내, 무료·프리미엄 범위, 프리미엄 코드 등록 방법을 한곳에서 확인하세요.",
  alternates: { canonical: absoluteUrl("/faq") },
  openGraph: {
    title: `FAQ | ${SITE_NAME}`,
    description:
      "봄기출 이용 가이드와 자주 묻는 질문. 기능 안내, 무료·프리미엄 범위, 프리미엄 코드 등록 방법을 한곳에서 확인하세요.",
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
        <div className="mb-14 max-w-2xl">
          <EyebrowLabel className="mb-2">FAQ</EyebrowLabel>
          <SectionHeading as="h1">봄기출, 이렇게 이용하세요</SectionHeading>
          <p className="mt-4 font-display text-body text-smoke">
            처음 오셨다면 이 페이지 하나로 충분해요. 어떤 기능이 있는지, 무엇이 무료이고 무엇이
            프리미엄인지, 프리미엄 코드는 어떻게 받고 등록하는지 차례로 안내해 드릴게요. 아래
            자주 묻는 질문도 함께 확인하세요.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton href="/study">지금 무료로 풀어보기</PrimaryButton>
            <SecondaryButton href="/study#exam">기출문제 보러가기</SecondaryButton>
            <OutlineButton href="#code">코드 등록 방법 보기</OutlineButton>
            <OutlineButton href="#faq">자주 묻는 질문 보기</OutlineButton>
          </div>
        </div>

        <GuideContent />

        <section id="faq" className="scroll-mt-24">
          <div className="mb-8 max-w-xl">
            <HandCaption className="mb-2">자주 묻는 질문</HandCaption>
            <SectionHeading as="h2">FAQ</SectionHeading>
          </div>
          <div className="mx-auto max-w-2xl rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper px-5 shadow-[var(--shadow-card)] md:px-8">
            <FAQAccordion items={FAQ_ITEMS} />
          </div>
        </section>

        <ElevatedCard className="mt-12 p-8 text-center">
          <SectionHeading as="h2" className="mb-3">
            더 궁금한 점이 있으신가요?
          </SectionHeading>
          <p className="mx-auto max-w-md font-display text-body-sm text-smoke">
            위에서 답을 찾지 못하셨다면 커뮤니티 「질문」 게시판에 남겨주세요. 다른 수험생들이
            답변해 줄 수 있어요. <ElectricHighlight>봄기출</ElectricHighlight>은 계속 나아지고
            있어요.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <PrimaryButton href="/community">커뮤니티에 질문하기</PrimaryButton>
          </div>
        </ElevatedCard>
      </div>
    </div>
  );
}
