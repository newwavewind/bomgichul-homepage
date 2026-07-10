import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import { BackLink } from "@/components/ui/BackLink";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SITE_NAME } from "@/lib/constants";
import {
  getConcept,
  getConceptsForSubject,
  getConceptQuestions,
  getConceptStatements,
  getAllConceptParams,
  type ConceptStatement,
} from "@/lib/concepts";
import type { ExamSubject } from "@/lib/exam-questions";
import { absoluteUrl } from "@/lib/seo";

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
  labelKo,
  children,
}: {
  label: string;
  labelKo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-mist/60 py-5 last:border-b-0">
      <p className="mb-2 font-display text-[12px] font-semibold uppercase tracking-wide text-electric-blue">
        {label} <span className="text-fog">{labelKo}</span>
      </p>
      <div className="font-display text-body text-ink">{children}</div>
    </div>
  );
}

function StatementList({
  statements,
  subject,
  variant,
}: {
  statements: ConceptStatement[];
  subject: string;
  variant: "correct" | "incorrect";
}) {
  if (statements.length === 0) return null;

  return (
    <ul className="space-y-4">
      {statements.map((statement) => (
        <li
          key={`${statement.year}-${statement.questionNo}-${statement.text}`}
          className={`rounded-[var(--radius-input)] border px-4 py-3 ${
            variant === "correct"
              ? "border-emerald-200/80 bg-emerald-50/40"
              : "border-rose-200/80 bg-rose-50/40"
          }`}
        >
          <p className="font-display text-body text-ink">{statement.text}</p>
          <Link
            href={`/exam/${subject}/${statement.year}/${statement.questionNo}`}
            className="mt-2 inline-block font-display text-body-sm text-fog hover:text-ink"
          >
            {statement.year}년 · {statement.questionNo}번 문제 →
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
  const parent = concept.parentSlug ? getConcept(subject, concept.parentSlug) : undefined;
  const siblingConcepts = getConceptsForSubject(subject);
  const currentIndex = siblingConcepts.findIndex((c) => c.slug === slug);
  const prev = currentIndex > 0 ? siblingConcepts[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < siblingConcepts.length - 1
      ? siblingConcepts[currentIndex + 1]
      : undefined;

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href={`/concepts/${subject}`}>{label} 개념 목록으로</BackLink>

        <p className="mb-4 font-display text-body-sm text-fog">
          <Link href="/study#concepts" className="hover:text-ink">
            개념 목록
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
          <p className="mt-1 font-display text-body-sm text-fog">{concept.titleEn}</p>
          <p className="mt-2 font-display text-body-sm text-smoke">
            {label} · {concept.subcategory}
          </p>
        </div>

        <ElevatedCard className="mb-10 px-6">
          <SectionBlock label="DEFINITION" labelKo="정의">
            {concept.definition}
          </SectionBlock>
          <SectionBlock label="INTUITION" labelKo="직관">
            {concept.intuition}
          </SectionBlock>
          <SectionBlock label="KEY POINTS" labelKo="핵심 포인트">
            <ul className="list-disc space-y-1.5 pl-5">
              {concept.keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </SectionBlock>
          <SectionBlock label="PITFALLS" labelKo="자주 헷갈리는 점">
            {concept.pitfalls}
          </SectionBlock>
          <SectionBlock label="EXAMPLE" labelKo="작은 예시">
            {concept.example}
          </SectionBlock>
        </ElevatedCard>

        {(statements.correct.length > 0 || statements.incorrect.length > 0) && (
          <ElevatedCard className="mb-10 px-6">
            {statements.correct.length > 0 && (
              <SectionBlock label="CORRECT STATEMENTS" labelKo="옳은 지문">
                <StatementList
                  statements={statements.correct}
                  subject={subject}
                  variant="correct"
                />
              </SectionBlock>
            )}
            {statements.incorrect.length > 0 && (
              <SectionBlock label="INCORRECT STATEMENTS" labelKo="틀린 지문">
                <StatementList
                  statements={statements.incorrect}
                  subject={subject}
                  variant="incorrect"
                />
              </SectionBlock>
            )}
          </ElevatedCard>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-subheading font-semibold text-ink">
            이 개념을 사용한 문제
          </h2>
          <span className="font-display text-body-sm text-fog">{questions.length}문항</span>
        </div>

        <ElevatedCard className="mb-8 overflow-hidden">
          {questions.length === 0 ? (
            <p className="px-5 py-6 font-display text-body-sm text-smoke">
              연결된 기출문제가 아직 없어요.
            </p>
          ) : (
            questions.map((q) => (
              <Link
                key={`${q.year}-${q.questionNo}`}
                href={`/exam/${subject}/${q.year}/${q.questionNo}`}
                className="flex items-center justify-between gap-3 border-b border-mist/60 px-5 py-4 transition-colors last:border-b-0 hover:bg-snow"
              >
                <span className="font-display text-body-sm text-ink">
                  {q.year}년 · {q.questionNo}번
                </span>
                <span className="font-display text-body-sm text-fog">문제 보기 →</span>
              </Link>
            ))
          )}
        </ElevatedCard>

        <div className="flex items-center justify-between">
          {prev ? (
            <Link
              href={`/concepts/${subject}/${prev.slug}`}
              className="font-display text-body-sm text-smoke hover:text-ink"
            >
              ← {prev.titleKo}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/concepts/${subject}/${next.slug}`}
              className="font-display text-body-sm text-smoke hover:text-ink"
            >
              {next.titleKo} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
