import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import { BackLink } from "@/components/ui/BackLink";
import { EXAM_SUBJECTS, ARCHIVE_SUBJECT_MAP, SUBJECT_LANDING_INFO, SITE_NAME } from "@/lib/constants";
import { getConceptsForSubject, getConceptQuestionCount, type Concept } from "@/lib/concepts";
import type { ExamSubject } from "@/lib/exam-questions";
import { absoluteUrl } from "@/lib/seo";

function groupByChapter(concepts: Concept[]): { chapter: string; items: Concept[] }[] {
  const groups: { chapter: string; items: Concept[] }[] = [];
  for (const concept of concepts) {
    const chapter = concept.chapterKo ?? concept.category;
    const existing = groups.find((g) => g.chapter === chapter);
    if (existing) {
      existing.items.push(concept);
    } else {
      groups.push({ chapter, items: [concept] });
    }
  }
  for (const group of groups) {
    group.items = orderWithChildrenAfterParent(group.items);
  }
  return groups;
}

/** 하위개념(parentSlug 있음)을 부모 개념 바로 다음에 오도록 재정렬한다. */
function orderWithChildrenAfterParent(items: Concept[]): Concept[] {
  const bySlug = new Map(items.map((c) => [c.slug, c]));
  const childrenByParent = new Map<string, Concept[]>();
  const topLevel: Concept[] = [];

  for (const concept of items) {
    if (concept.parentSlug && bySlug.has(concept.parentSlug)) {
      const siblings = childrenByParent.get(concept.parentSlug) ?? [];
      siblings.push(concept);
      childrenByParent.set(concept.parentSlug, siblings);
    } else {
      topLevel.push(concept);
    }
  }

  const ordered: Concept[] = [];
  for (const concept of topLevel) {
    ordered.push(concept);
    const children = childrenByParent.get(concept.slug);
    if (children) ordered.push(...children);
  }
  return ordered;
}

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

interface ConceptSubjectPageProps {
  params: Promise<{ subject: string }>;
}

export function generateStaticParams() {
  return VALID_SUBJECTS.map((subject) => ({ subject }));
}

export async function generateMetadata({
  params,
}: ConceptSubjectPageProps): Promise<Metadata> {
  const { subject } = await params;
  if (!isValidSubject(subject)) return {};

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const title = `${label} 개념 목록`;
  const description = `${label} 10개년 기출 해설에서 뽑은 핵심 개념을 정의·직관·핵심 포인트·예시로 정리했습니다.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/concepts/${subject}`) },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/concepts/${subject}`),
    },
  };
}

export default async function ConceptSubjectPage({ params }: ConceptSubjectPageProps) {
  const { subject } = await params;
  if (!isValidSubject(subject)) notFound();

  const label = ARCHIVE_SUBJECT_MAP[subject];
  const info = SUBJECT_LANDING_INFO[subject];
  const concepts = getConceptsForSubject(subject);
  const groups = groupByChapter(concepts);

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href="/study#concepts">과목 목록으로</BackLink>

        <p className="mb-4 font-display text-body-sm text-fog">
          <Link href="/study#concepts" className="hover:text-ink">
            개념 목록
          </Link>{" "}
          / {label}
        </p>

        <div className="mb-10">
          <EyebrowLabel className="mb-2">공인중개사 {info.round} 과목</EyebrowLabel>
          <SectionHeading as="h1">{label} 개념 목록</SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            10개년 기출 해설에서 자주 나오는 주제를 교재 목차 순서로 정리했어요. 개념을 눌러 정의·직관·핵심 포인트를 확인하세요.
          </p>
          <p className="mt-2 font-display text-body-sm text-fog">개념 {concepts.length}개</p>
        </div>

        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.chapter}>
              <h2 className="mb-3 font-display text-body font-semibold text-ink">
                {group.chapter}
              </h2>
              <ElevatedCard className="overflow-hidden">
                {group.items.map((concept) => {
                  const count = getConceptQuestionCount(subject, concept);
                  const isSubConcept = Boolean(concept.parentSlug);
                  return (
                    <Link
                      key={concept.slug}
                      href={`/concepts/${subject}/${concept.slug}`}
                      className={`flex items-center justify-between gap-3 border-b border-mist/60 py-4 transition-colors last:border-b-0 hover:bg-snow ${
                        isSubConcept ? "border-l-[3px] border-l-electric-blue/40 bg-snow/40 pl-8 pr-5" : "px-5"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 font-display text-body-sm text-fog">
                          {isSubConcept && (
                            <span className="inline-flex shrink-0 items-center rounded-full border border-electric-blue/40 px-1.5 py-0.5 font-display text-[10px] font-semibold text-electric-blue">
                              하위개념
                            </span>
                          )}
                          {concept.category}
                          {concept.subcategory !== concept.category ? ` · ${concept.subcategory}` : ""}
                        </p>
                        <h3
                          className={`truncate font-display text-ink ${
                            isSubConcept ? "text-body-sm font-medium" : "text-body font-medium"
                          }`}
                        >
                          {concept.titleKo}
                        </h3>
                      </div>
                      <span className="shrink-0 font-display text-body-sm text-fog">
                        {count}문항
                      </span>
                    </Link>
                  );
                })}
              </ElevatedCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
