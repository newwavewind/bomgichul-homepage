import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BackLink } from "@/components/ui/BackLink";
import { SectionHeading } from "@/components/ui/Typography";
import { ARCHIVE_SUBJECT_MAP, EXAM_SUBJECTS, SITE_NAME } from "@/lib/constants";
import {
  getConcept,
  getConceptsForSubject,
  getConceptQuestions,
  getConceptStatements,
  getAllConceptParams,
} from "@/lib/concepts";
import {
  getConceptEnhancement,
} from "@/lib/concept-enhancements";
import { ConceptVisualGuide } from "@/components/concepts/ConceptVisualEnhancements";
import {
  ConceptRelatedExamList,
  ConceptStatementList,
} from "@/components/concepts/ConceptExamLinks";
import { ConceptReadBar } from "@/components/concepts/ConceptReadBar";
import { ConceptCommunityPanel } from "@/components/concepts/ConceptCommunityPanel";
import { ConceptAiButtons } from "@/components/concepts/ConceptAiButtons";
import { ConceptSourcePanel } from "@/components/concepts/ConceptSourcePanel";
import { ConceptStructureBlocks, hasConceptStructure } from "@/components/concepts/ConceptStructureBlocks";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import type { ExamSubject } from "@/lib/exam-questions";
import { absoluteUrl, buildBreadcrumbJsonLd, buildConceptLearningResourceJsonLd, conceptSeoTitle, truncateDescription } from "@/lib/seo";
import { getConceptCommunityPosts } from "@/lib/concept-community";
import { getUserActivityScores } from "@/lib/activity";
import { buildConceptDetailAiPrompt } from "@/lib/ai-links";
import "../../concepts-ui.css";
import "@/styles/concepts/conceptsEbook.css";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

// 커뮤니티 글(모두의 개념)이 실리는 페이지라 한 시간마다 다시 굽는다.
export const revalidate = 3600;

function plainConceptText(text: string): string {
  return text.replace(/\*\*/g, "");
}

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface ConceptDetailPageProps {
  params: Promise<{ subject: string; slug: string }>;
}

export function generateStaticParams() {
  // 전체 개념은 1,900장이 넘어 전량을 사전 렌더하면 빌드가 수직으로 늘어난다.
  // 과목당 앞 10개만 미리 굽고, 나머지는 dynamicParams 기본값(true)에 따라
  // 첫 방문 때 생성·캐시된다(ISR).
  const PRERENDER_PER_SUBJECT = 10;
  const seen: Record<string, number> = {};
  return getAllConceptParams().filter(({ subject }) => {
    seen[subject] = (seen[subject] ?? 0) + 1;
    return seen[subject] <= PRERENDER_PER_SUBJECT;
  });
}

export async function generateMetadata({
  params,
}: ConceptDetailPageProps): Promise<Metadata> {
  const { subject, slug } = await params;
  if (!isValidSubject(subject)) return {};

  const concept = getConcept(subject, slug);
  if (!concept) return {};

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${conceptSeoTitle(concept.titleKo, concept.sectionKo)} | 공인중개사 ${label} 기출 올인원`;
  const description = truncateDescription(
    `${label} · ${concept.titleKo}. ${concept.definition}${
      concept.intuition ? ` ${concept.intuition}` : ""
    }${concept.pitfalls ? ` 함정: ${concept.pitfalls}` : ""}`
  );

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/concepts/${subject}/${slug}`) },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/concepts/${subject}/${slug}`),
      type: "article",
      // 레이아웃의 og 이미지는 세그먼트 openGraph 정의에 통째로 덮인다 — 다시 넣는다.
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
      locale: "ko_KR",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

function SectionBlock({
  label,
  index,
  badge,
  id,
  children,
}: {
  label: string;
  index: number;
  badge?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="hp-cx-section" id={id}>
      <h2 className="hp-cx-section__label">
        <span className="hp-cx-section__index" aria-hidden>
          {String(index).padStart(2, "0")}
        </span>
        <span>{label}</span>
        {badge ? (
          <span
            className="hp-cx-correct-pack-badge"
            title="O 선지와, 틀린 선지를 해설로 고친 옳은 문장만 모았습니다"
          >
            {badge}
          </span>
        ) : null}
      </h2>
      <div className="hp-cx-section__body">{children}</div>
    </section>
  );
}

export default async function ConceptDetailPage({ params }: ConceptDetailPageProps) {
  const { subject, slug } = await params;
  if (!isValidSubject(subject)) notFound();

  const concept = getConcept(subject, slug);
  if (!concept) notFound();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const questions = getConceptQuestions(subject, concept);
  const statements = getConceptStatements(subject, concept);
  const enhancement = getConceptEnhancement(concept);
  const returnTo = `/concepts/${subject}/${slug}`;
  // 정적 렌더 유지 — 글 본문은 뷰어 없이 공개 데이터로 굽고, 「내 좋아요·추천」
  // 표시는 클라이언트(ConceptCommunityPanel)가 /api/concept-community/personal 로 덧입힌다.
  const communityPosts = await getConceptCommunityPosts(subject, slug, null);
  const communityAuthorIds = [
    ...communityPosts.map((post) => post.user_id),
    ...communityPosts.flatMap((post) => post.comments.map((comment) => comment.user_id)),
  ];
  const communityAuthorActivity = await getUserActivityScores(communityAuthorIds);
  const communityAuthorRanks = Object.fromEntries(
    Object.entries(communityAuthorActivity).map(([userId, activity]) => [
      userId,
      activity.rank,
    ])
  );
  const parent = concept.parentSlug ? getConcept(subject, concept.parentSlug) : undefined;
  const siblingConcepts = getConceptsForSubject(subject);
  const currentIndex = siblingConcepts.findIndex((c) => c.slug === slug);
  const prev = currentIndex > 0 ? siblingConcepts[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < siblingConcepts.length - 1
      ? siblingConcepts[currentIndex + 1]
      : undefined;
  const hasExample = Boolean(concept.example?.trim());
  const pitfallList = Array.isArray(concept.pitfalls)
    ? concept.pitfalls.filter(Boolean)
    : concept.pitfalls?.trim() ? [concept.pitfalls] : [];
  const hasStructure = hasConceptStructure(concept);
  const exampleIndex = hasExample ? 4 : null;
  const pitfallsIndex = pitfallList.length ? 4 + (hasExample ? 1 : 0) : null;
  const afterCore = 4 + (hasExample ? 1 : 0) + (pitfallList.length ? 1 : 0);
  const structureIndex = hasStructure ? afterCore : null;
  const statementsIndex = afterCore + (hasStructure ? 1 : 0) + (enhancement ? 1 : 0);
  const relatedIndex = statements.length > 0 ? statementsIndex + 1 : statementsIndex;
  const communityIndex = relatedIndex + 1;
  const aiPrompt = buildConceptDetailAiPrompt({
    subjectLabel: label,
    titleKo: concept.titleKo,
    chapterKo: concept.chapterKo,
    sectionKo: concept.sectionKo,
    category: concept.category,
    definition: concept.definition,
    intuition: concept.intuition,
    keyPoints: concept.keyPoints,
    pitfalls: pitfallList.join("\n"),
  });

  const conceptPath = `/concepts/${subject}/${slug}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "기출 all-in-one", path: "/" },
    { name: label, path: `/concepts/${subject}` },
    { name: concept.titleKo, path: conceptPath },
  ]);
  const learningResourceJsonLd = buildConceptLearningResourceJsonLd({
    title: concept.titleKo,
    description: concept.definition,
    path: conceptPath,
    subjectLabel: label,
  });

  return (
    <div className="hp-cx px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }}
      />
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href={`/concepts/${subject}`} emphasized>
          {concept.chapterKo || concept.category}
        </BackLink>

        <div className="mb-8">
          {parent && (
            <p className="mb-2 font-display text-body-sm text-fog">
              <span className="mr-1.5 inline-flex items-center rounded-full border border-ios-blue/40 px-1.5 py-0.5 font-display text-[10px] font-semibold text-ios-blue">
                하위개념
              </span>
              <Link href={`/concepts/${subject}/${parent.slug}`} className="hover:text-ink">
                {parent.titleKo}
              </Link>
              의 하위개념이에요
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
            <SectionHeading as="h1" className="w-auto max-w-full shrink">
              {concept.titleKo}
            </SectionHeading>
            {concept.amendmentNotice ? (
              <span className="cx-amend-badge" title={concept.amendmentNotice}>
                개정 반영
              </span>
            ) : null}
            <ConceptAiButtons
              prompt={aiPrompt}
              returnTo={returnTo}
              subject={subject}
            />
          </div>
          <p className="mt-2 font-display text-body-sm text-smoke">
            {label} · {concept.subcategory}
          </p>
        </div>

        <ConceptReadBar subject={subject} slug={slug} returnTo={returnTo} />

        <ConceptSourcePanel
          sources={concept.sources}
          examLabels={questions.map((question) => `${question.year}년 ${question.questionNo}번`)}
          amendmentNotice={concept.amendmentNotice}
        />

        <article className="hp-cx-card">
          <SectionBlock id="cx-sec-definition" label="개념 정리" index={1}>
            {plainConceptText(concept.definition)}
          </SectionBlock>
          <SectionBlock id="cx-sec-intuition" label="이해하기" index={2}>
            {plainConceptText(concept.intuition)}
          </SectionBlock>
          <SectionBlock id="cx-sec-keypoints" label="핵심 포인트" index={3}>
            <ol className="hp-cx-bullets">
              {concept.keyPoints.map((point, i) => (
                <li key={i}>{plainConceptText(point)}</li>
              ))}
            </ol>
          </SectionBlock>
          {hasExample && exampleIndex != null ? (
            <SectionBlock id="cx-sec-example" label="한 줄 예시" index={exampleIndex}>
              <aside className="hp-cx-map-summary">{plainConceptText(concept.example!)}</aside>
            </SectionBlock>
          ) : null}
          {pitfallList.length && pitfallsIndex != null ? (
            <SectionBlock id="cx-sec-pitfalls" label="시험 함정" index={pitfallsIndex}>
              <ol className="hp-cx-bullets">
                {pitfallList.map((pitfall, index) => <li key={index}>{plainConceptText(pitfall)}</li>)}
              </ol>
            </SectionBlock>
          ) : null}
        </article>

        {hasStructure && structureIndex != null ? (
          <article id="cx-sec-structure" className="hp-cx-card">
            <SectionBlock label="한눈에 보기" index={structureIndex}>
              <ConceptStructureBlocks concept={concept} />
            </SectionBlock>
          </article>
        ) : null}

        {enhancement ? (
          <div id="cx-sec-visual" className="concepts-screen hp-cx-kind-host cx-toc-anchor">
            <ConceptVisualGuide guide={enhancement} />
          </div>
        ) : null}

        {statements.length > 0 && (
          <article id="cx-sec-statements" className="hp-cx-card">
            <SectionBlock label="기출 지문" index={statementsIndex} badge="옳은 지문 모음">
              <ConceptStatementList statements={statements} subject={subject} />
            </SectionBlock>
          </article>
        )}

        <article id="cx-sec-related" className="hp-cx-card">
          <section className="hp-cx-section">
            <div className="hp-cx-questions-head">
              <h2 className="hp-cx-section__label">
                <span className="hp-cx-section__index" aria-hidden>
                  {String(relatedIndex).padStart(2, "0")}
                </span>
                <span>관련 기출</span>
              </h2>
              <span className="hp-cx-questions-count">{questions.length}문항</span>
            </div>
            <div className="hp-cx-section__body">
              <ConceptRelatedExamList questions={questions} subject={subject} />
            </div>
          </section>
        </article>

        {/* userId 를 내리지 않는다 — 패널이 useMe 로 스스로 알아내고,
            좋아요·추천의 「내 것」 표시는 personal API 로 덧입힌다. */}
        <ConceptCommunityPanel
          subject={subject}
          conceptSlug={slug}
          sectionIndex={communityIndex}
          initialPosts={communityPosts}
          authorRanks={communityAuthorRanks}
          returnTo={returnTo}
        />

        <nav className="hp-cx-pager" aria-label="이전·다음 개념">
          {prev ? (
            <Link
              href={`/concepts/${subject}/${prev.slug}`}
              className="hp-cx-pager__btn hp-cx-pager__btn--prev"
              aria-label={`이전: ${prev.titleKo}`}
            >
              <span className="hp-cx-pager__arrow" aria-hidden>
                ←
              </span>
              <span className="hp-cx-pager__label">이전</span>
            </Link>
          ) : (
            <span className="hp-cx-pager__btn hp-cx-pager__btn--disabled" aria-hidden>
              <span className="hp-cx-pager__arrow">←</span>
              <span className="hp-cx-pager__label">이전</span>
            </span>
          )}
          {next ? (
            <Link
              href={`/concepts/${subject}/${next.slug}`}
              className="hp-cx-pager__btn hp-cx-pager__btn--next"
              aria-label={`다음: ${next.titleKo}`}
            >
              <span className="hp-cx-pager__label">다음</span>
              <span className="hp-cx-pager__arrow" aria-hidden>
                →
              </span>
            </Link>
          ) : (
            <span className="hp-cx-pager__btn hp-cx-pager__btn--disabled" aria-hidden>
              <span className="hp-cx-pager__label">다음</span>
              <span className="hp-cx-pager__arrow">→</span>
            </span>
          )}
        </nav>
        <SimpleAppInstallStrip scope="real_estate" />
      </div>
    </div>
  );
}
