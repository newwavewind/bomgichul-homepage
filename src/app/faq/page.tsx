import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import { PrimaryButton, OutlineButton } from "@/components/ui/Button";
import { FAQAccordion } from "@/components/ui/FAQ";
import { GuideContent } from "@/components/faq/GuideContent";
import { buildPageMetadata } from "@/lib/seo";
import {
  communityBaseHref,
  communityScopeLabel,
  faqTitle,
  trackHubHref,
} from "@/lib/exam-track/community";
import { faqDescription, faqItemsForScope } from "@/lib/exam-track/faq";
import { CommunityHubNav } from "@/components/community/CommunityHubNav";
import type { CommunityScope } from "@/types/database";

export const metadata: Metadata = buildPageMetadata({
  title: "이용 안내",
  description: faqDescription("real_estate"),
  path: "/faq",
});

export async function FaqBoard({
  scope = "real_estate",
}: {
  scope?: CommunityScope;
}) {
  const items = faqItemsForScope(scope);
  const label = communityScopeLabel(scope);
  const hub = trackHubHref(scope);
  const community = communityBaseHref(scope);
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-12 max-w-2xl">
          <EyebrowLabel className="mb-2">DOCS</EyebrowLabel>
          <SectionHeading as="h1">{faqTitle(scope)}</SectionHeading>
          <p className="mt-4 font-display text-body text-smoke">
            {label} 학습 홈부터 기출 올인원, 기출문제, 커뮤니티까지 — 지금
            사이트에 있는 기능을 화면 순서대로 안내합니다.
            {scope === "real_estate" ? " 뉴스·프리미엄 안내도 포함합니다." : ""}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryButton href={hub}>학습 홈 열기</PrimaryButton>
            <OutlineButton href="#faq">짧은 질문만 보기</OutlineButton>
          </div>
        </div>

        <CommunityHubNav scope={scope} />

        <GuideContent scope={scope} />

        <section id="faq" className="mt-16 scroll-mt-24">
          <div className="mb-8 max-w-xl">
            <EyebrowLabel className="mb-2">FAQ</EyebrowLabel>
            <SectionHeading as="h2">자주 묻는 질문</SectionHeading>
            <p className="mt-3 font-display text-body-sm text-smoke">
              위 가이드를 다 읽지 않아도, 궁금한 점만 빠르게 확인할 수 있어요.
            </p>
          </div>
          <div className="mx-auto max-w-2xl rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper px-5 shadow-[var(--shadow-card)] md:px-8">
            <FAQAccordion items={items} />
          </div>
        </section>

        <ElevatedCard className="mt-12 p-8 text-center">
          <SectionHeading as="h2" className="mb-3">
            더 궁금한 점이 있나요?
          </SectionHeading>
          <p className="mx-auto max-w-md font-display text-body-sm text-smoke">
            {label} 커뮤니티 「질문」에 남겨 주세요. 다른 수험생과 함께 답을
            찾아볼 수 있어요.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <PrimaryButton href={`${community}?category=question`}>
              {label} 커뮤니티에서 질문하기
            </PrimaryButton>
          </div>
        </ElevatedCard>
      </div>
    </div>
  );
}

export default async function FaqPage() {
  return <FaqBoard scope="real_estate" />;
}
