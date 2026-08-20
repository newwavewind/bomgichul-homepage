import Link from "next/link";
import { BackLink } from "@/components/ui/BackLink";
import { ConceptAiButtons } from "@/components/concepts/ConceptAiButtons";
import { ConceptReadBar } from "@/components/concepts/ConceptReadBar";
import { ConceptCommunityPanel } from "@/components/concepts/ConceptCommunityPanel";
import { TrackConceptStatements, type TrackConceptStatement } from "@/components/exam-track/TrackConceptStatements";
import { buildConceptDetailAiPrompt } from "@/lib/ai-links";
import type { ConceptCommunityPost } from "@/types/database";
import type { OceanRank } from "@/lib/ocean-ranks";
import type { ExamTrackConcept } from "@/lib/exam-track/types";
import type { PublicServiceConcept, PublicServiceExam } from "@/lib/public-service-content";
import "@/app/concepts/concepts-ui.css";
import "@/styles/concepts/conceptsEbook.css";
import { ConceptSourcePanel } from "@/components/concepts/ConceptSourcePanel";
import { ConceptStructureBlocks, hasConceptStructure } from "@/components/concepts/ConceptStructureBlocks";

type ConceptLike = ExamTrackConcept | PublicServiceConcept;
type ExamLike = Pick<PublicServiceExam, "id" | "year" | "sourceCode" | "questionNo">;

function plainConceptText(text: string): string {
  return text.replace(/\*\*/g, "");
}

function SectionBlock({
  label,
  index,
  id,
  children,
}: {
  label: string;
  index: number;
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
      </h2>
      <div className="hp-cx-section__body">{children}</div>
    </section>
  );
}

export function TrackConceptDetailView({
  subjectLabel,
  listHref,
  examHrefFor,
  concept,
  linkedExams,
  prev,
  next,
  prevHref,
  nextHref,
  subjectKey,
  userId,
  initialPosts = [],
  authorRanks = {},
  statements = [],
}: {
  subjectLabel: string;
  listHref: string;
  examHrefFor: (exam: ExamLike) => string;
  concept: ConceptLike;
  linkedExams: ExamLike[];
  prev?: ConceptLike | null;
  next?: ConceptLike | null;
  prevHref?: string | null;
  nextHref?: string | null;
  subjectKey: string;
  userId: string | null;
  initialPosts?: ConceptCommunityPost[];
  authorRanks?: Record<string, OceanRank>;
  statements?: TrackConceptStatement[];
}) {
  let sectionIndex = 1;
  const pitfallList = Array.isArray(concept.pitfalls)
    ? concept.pitfalls.filter(Boolean)
    : concept.pitfalls?.trim() ? [concept.pitfalls] : [];
  const hasStructure = hasConceptStructure(concept);
  const returnTo = `${listHref}/${concept.slug}`;
  const aiPrompt = buildConceptDetailAiPrompt({
    subjectLabel,
    titleKo: concept.titleKo,
    chapterKo: concept.chapterKo,
    sectionKo: concept.sectionKo,
    category: concept.category,
    definition: concept.definition,
    intuition: concept.intuition,
    keyPoints: concept.keyPoints ?? [],
    pitfalls: pitfallList.join("\n"),
  });

  return (
    <div className="hp-cx px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href={listHref} emphasized>
          {concept.chapterKo || concept.category}
        </BackLink>

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-heading font-semibold tracking-tight text-ink md:text-heading-lg">{concept.titleKo}</h1>
            <ConceptAiButtons prompt={aiPrompt} isLoggedIn={Boolean(userId)} returnTo={returnTo} subject={subjectKey} />
          </div>
          {concept.titleEn ? (
            <p className="mt-2 font-display text-body-sm text-smoke">{concept.titleEn}</p>
          ) : null}
        </div>

        <ConceptReadBar subject={subjectKey} slug={concept.slug} isLoggedIn={Boolean(userId)} userId={userId} returnTo={returnTo} />

        <ConceptSourcePanel
          sources={concept.sources}
          examLabels={linkedExams.map((exam) => `${exam.year}년 ${exam.sourceCode} ${exam.questionNo}번`)}
        />

        <article className="hp-cx-card">
          <SectionBlock id="cx-sec-definition" label="개념 정리" index={sectionIndex++}>
            {plainConceptText(concept.definition)}
          </SectionBlock>
          {concept.intuition?.trim() ? (
            <SectionBlock id="cx-sec-intuition" label="이해하기" index={sectionIndex++}>
              {plainConceptText(concept.intuition)}
            </SectionBlock>
          ) : null}
          {concept.keyPoints?.length ? (
            <SectionBlock id="cx-sec-keypoints" label="핵심 포인트" index={sectionIndex++}>
              <ol className="hp-cx-bullets">
                {concept.keyPoints.map((point, i) => (
                  <li key={i}>{plainConceptText(point)}</li>
                ))}
              </ol>
            </SectionBlock>
          ) : null}
          {concept.example?.trim() ? (
            <SectionBlock id="cx-sec-example" label="한 줄 예시" index={sectionIndex++}>
              <aside className="hp-cx-map-summary">{plainConceptText(concept.example)}</aside>
            </SectionBlock>
          ) : null}
        </article>

        {pitfallList.length ? <article className="hp-cx-card">
          <SectionBlock id="cx-sec-pitfalls" label="시험 함정" index={sectionIndex++}>
            <ol className="hp-cx-bullets">
              {pitfallList.map((pitfall, index) => <li key={index}>{plainConceptText(pitfall)}</li>)}
            </ol>
          </SectionBlock>
        </article> : null}

        {hasStructure ? <article id="cx-sec-structure" className="hp-cx-card">
          <SectionBlock label="한눈에 보기" index={sectionIndex++}>
            <ConceptStructureBlocks concept={concept} />
          </SectionBlock>
        </article> : null}

        {statements.length > 0 ? (
          <article className="hp-cx-card">
            <SectionBlock label="기출 지문" index={sectionIndex++}>
              <TrackConceptStatements statements={statements} />
            </SectionBlock>
          </article>
        ) : null}

        <article id="cx-sec-related" className="hp-cx-card">
          <section className="hp-cx-section">
            <div className="hp-cx-questions-head">
              <h2 className="hp-cx-section__label">
                <span className="hp-cx-section__index" aria-hidden>
                  {String(sectionIndex).padStart(2, "0")}
                </span>
                <span>관련 기출</span>
              </h2>
              <span className="hp-cx-questions-count">{linkedExams.length}문항</span>
            </div>
            <div className="hp-cx-section__body">
              {linkedExams.length === 0 ? (
                <p className="font-display text-body-sm text-fog">연결된 기출문제가 아직 없어요.</p>
              ) : (
                <div className="hp-cx-related-list">
                  {linkedExams.map((exam) => (
                    <Link key={exam.id} href={examHrefFor(exam)} className="hp-cx-question-row">
                      <span>
                        {exam.year}년 {exam.sourceCode} {exam.questionNo}번
                      </span>
                      <span className="hp-cx-question-row__go">문제 보기 →</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </article>

        <ConceptCommunityPanel subject={subjectKey} conceptSlug={concept.slug} sectionIndex={sectionIndex + 1} userId={userId} initialPosts={initialPosts} authorRanks={authorRanks} returnTo={returnTo} />

        <nav className="hp-cx-pager" aria-label="이전·다음 개념">
          {prev && prevHref ? (
            <Link
              href={prevHref}
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
          {next && nextHref ? (
            <Link
              href={nextHref}
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
      </div>
    </div>
  );
}
