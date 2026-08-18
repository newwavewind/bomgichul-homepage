import type { Metadata } from "next";
import { BackLink } from "@/components/ui/BackLink";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { HistoryConceptCollection } from "@/components/history/HistoryConceptCollection";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { HISTORY_TRACK } from "@/lib/exam-track/config";
import { getHistoryConceptCards, getHistoryRounds } from "@/lib/history-content";
import { buildPageMetadata, buildPublicServiceLearningResourceJsonLd } from "@/lib/seo";

const DESCRIPTION =
  "한국사능력검정 심화 250문항에 붙은 핵심 개념을 문제 없이 카드만 모아 봅니다. 회차별·시대별로 골라 개념서처럼 이어 읽으세요.";

export const metadata: Metadata = buildPageMetadata({
  title: "한국사능력검정 핵심 개념 모아보기",
  description: DESCRIPTION,
  path: "/history/concepts",
});

export default function Page() {
  const cards = getHistoryConceptCards();
  const rounds = getHistoryRounds();

  return (
    <div className="px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildPublicServiceLearningResourceJsonLd({
              name: "한국사능력검정 핵심 개념 모아보기",
              description: DESCRIPTION,
              path: "/history/concepts",
              learningResourceType: "Concept",
              educationalLevel: HISTORY_TRACK.educationalLevel,
              aboutName: HISTORY_TRACK.aboutName,
            }),
          ),
        }}
      />
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href="/history">한국사 학습 홈</BackLink>

        <div className="mb-8 mt-6">
          <EyebrowLabel className="mb-2">한국사 전용</EyebrowLabel>
          <SectionHeading as="h1">핵심 개념 모아보기</SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            문항마다 붙는 핵심 개념 카드 {cards.length}장을 문제 없이 모아 놓았습니다. 회차나 시대를
            골라 개념서처럼 이어 읽고, 필요하면 그 자리에서 원래 문제로 넘어가세요.
          </p>
        </div>

        <HistoryConceptCollection cards={cards} rounds={rounds} />
        <SimpleAppInstallStrip scope="history" />
      </div>
    </div>
  );
}
