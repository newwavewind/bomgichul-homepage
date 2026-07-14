import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { BackLink } from "@/components/ui/BackLink";
import { ARCHIVE_SUBJECT_MAP, EXAM_SUBJECTS, SITE_NAME } from "@/lib/constants";
import {
  getConcept,
  getConceptsForSubject,
  getConceptQuestions,
  getConceptStatements,
  getAllConceptParams,
  type ConceptStatement,
} from "@/lib/concepts";
import {
  buildPitfallCards,
  getConceptEnhancement,
} from "@/lib/concept-enhancements";
import { ConceptPitfallCards } from "@/components/concepts/ConceptVisualEnhancements";
import { ConceptVisualGuide } from "@/components/concepts/ConceptKindGuides";
import type { ExamSubject } from "@/lib/exam-questions";
import { absoluteUrl } from "@/lib/seo";
import { appendReturnTo } from "@/lib/return-to";
import "../../concepts-ui.css";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface ConceptDetailPageProps {
  params: Promise<{ subject: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllConceptParams();
}

export async function generateMetadata({
  params,
}: ConceptDetailPageProps): Promise<Metadata> {
  const { subject, slug } = await params;
  if (!isValidSubject(subject)) return {};

  const concept = getConcept(subject, slug);
  if (!concept) return {};

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${concept.titleKo} | ${label} 개념`;
  const description = concept.definition;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/concepts/${subject}/${slug}`) },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/concepts/${subject}/${slug}`),
    },
  };
}

function SectionBlock({
  label,
  index,
  children,
}: {
  label: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <section className="hp-cx-section">
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

function StatementList({
  statements,
  subject,
  returnTo,
}: {
  statements: ConceptStatement[];
  subject: string;
  returnTo: string;
}) {
  if (statements.length === 0) return null;

  return (
    <ul className="hp-cx-statements">
      {statements.map((statement, i) => (
        <li key={`${statement.year}-${statement.questionNo}-${i}`}>
          <Link
            href={appendReturnTo(
              `/exam/${subject}/${statement.year}/${statement.questionNo}`,
              returnTo
            )}
            className="hp-cx-statement"
          >
            <span className="hp-cx-statement__num" aria-hidden>
              {i + 1}
            </span>
            <span className="hp-cx-statement__body">
              <span className="hp-cx-statement__text">
                {statement.text}
                {statement.modified ? (
                  <span className="hp-cx-statement__modified">수정</span>
                ) : null}
              </span>
              <span className="hp-cx-statement__meta">
                {statement.year}년 · {statement.questionNo}번 →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
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
  const pitfallCards = buildPitfallCards(concept, questions);
  const returnTo = `/concepts/${subject}/${slug}`;
  const parent = concept.parentSlug ? getConcept(subject, concept.parentSlug) : undefined;
  const siblingConcepts = getConceptsForSubject(subject);
  const currentIndex = siblingConcepts.findIndex((c) => c.slug === slug);
  const prev = currentIndex > 0 ? siblingConcepts[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < siblingConcepts.length - 1
      ? siblingConcepts[currentIndex + 1]
      : undefined;
  const statementsIndex = enhancement ? 6 : 5;
  const relatedIndex = statements.length > 0 ? statementsIndex + 1 : statementsIndex;

  return (
    <div className="hp-cx px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href={`/concepts/${subject}`}>{label} 개념 목록으로</BackLink>

        <p className="mb-4 font-display text-body-sm text-fog">
          <Link href="/study#concepts" className="hover:text-ink">
            기출 all-in-one
          </Link>{" "}
          /{" "}
          <Link href={`/concepts/${subject}`} className="hover:text-ink">
            {label}
          </Link>
        </p>

        <div className="mb-8">
          <EyebrowLabel className="mb-2">
            {concept.category} · {questions.length}문항 등장
          </EyebrowLabel>
          {parent && (
            <p className="mb-2 font-display text-body-sm text-fog">
              <span className="mr-1.5 inline-flex items-center rounded-full border border-electric-blue/40 px-1.5 py-0.5 font-display text-[10px] font-semibold text-electric-blue">
                하위개념
              </span>
              <Link href={`/concepts/${subject}/${parent.slug}`} className="hover:text-ink">
                {parent.titleKo}
              </Link>
              의 하위개념이에요
            </p>
          )}
          <SectionHeading as="h1">{concept.titleKo}</SectionHeading>
          <p className="mt-2 font-display text-body-sm text-smoke">
            {label} · {concept.subcategory}
          </p>
        </div>

        <article className="hp-cx-card">
          <SectionBlock label="개념 정리" index={1}>
            {concept.definition}
          </SectionBlock>
          <SectionBlock label="이해하기" index={2}>
            {concept.intuition}
          </SectionBlock>
          <SectionBlock label="핵심 포인트" index={3}>
            <ol className="hp-cx-bullets">
              {concept.keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ol>
          </SectionBlock>
          <SectionBlock label="함정 포인트" index={4}>
            <ConceptPitfallCards cards={pitfallCards} fallback={concept.pitfalls} />
          </SectionBlock>
        </article>

        <div className="concepts-screen hp-cx-kind-host">
          <ConceptVisualGuide guide={enhancement} />
        </div>

        {statements.length > 0 && (
          <article className="hp-cx-card">
            <SectionBlock label="기출 지문" index={statementsIndex}>
              <StatementList
                statements={statements}
                subject={subject}
                returnTo={returnTo}
              />
            </SectionBlock>
          </article>
        )}

        <article className="hp-cx-card">
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
              {questions.length === 0 ? (
                <p className="font-display text-body-sm text-smoke">
                  연결된 기출문제가 아직 없어요.
                </p>
              ) : (
                <div className="hp-cx-related-list">
                  {questions.map((q) => (
                    <Link
                      key={`${q.year}-${q.questionNo}`}
                      href={appendReturnTo(
                        `/exam/${subject}/${q.year}/${q.questionNo}`,
                        returnTo
                      )}
                      className="hp-cx-question-row"
                    >
                      <span>
                        {q.year}년 · {q.questionNo}번
                      </span>
                      <span className="hp-cx-question-row__go">문제 보기 →</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </article>

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
      </div>
    </div>
  );
}
