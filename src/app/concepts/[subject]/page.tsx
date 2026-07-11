import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { BackLink } from "@/components/ui/BackLink";
import { ConceptPartList } from "@/components/concepts/ConceptPartList";
import {
  EXAM_SUBJECTS,
  ARCHIVE_SUBJECT_MAP,
  SUBJECT_LANDING_INFO,
  SITE_NAME,
} from "@/lib/constants";
import {
  getConceptsForSubject,
  getConceptQuestionCount,
  type Concept,
} from "@/lib/concepts";
import type { ExamSubject } from "@/lib/exam-questions";
import { absoluteUrl } from "@/lib/seo";
import "../concepts-ui.css";

interface SectionGroup {
  section: string;
  orderNo: string;
  items: Concept[];
}

interface PartGroup {
  chapter: string;
  sections: SectionGroup[];
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

/**
 * 앱 목차별과 같이 PART(chapterKo) → CHAPTER(sectionKo) 순으로 묶고,
 * PART 안에서 CHAPTER에 01, 02… 번호를 붙인다.
 */
function groupByPartAndSection(concepts: Concept[]): PartGroup[] {
  const parts: PartGroup[] = [];

  for (const concept of concepts) {
    const chapter = concept.chapterKo ?? concept.category;
    let part = parts.find((p) => p.chapter === chapter);
    if (!part) {
      part = { chapter, sections: [] };
      parts.push(part);
    }

    const section = concept.sectionKo ?? concept.category;
    let sectionGroup = part.sections.find((s) => s.section === section);
    if (!sectionGroup) {
      sectionGroup = {
        section,
        orderNo: String(part.sections.length + 1).padStart(2, "0"),
        items: [],
      };
      part.sections.push(sectionGroup);
    }
    sectionGroup.items.push(concept);
  }

  for (const part of parts) {
    for (const section of part.sections) {
      section.items = orderWithChildrenAfterParent(section.items);
    }
  }

  return parts;
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
  const title = `${label} 기출 all-in-one`;
  const description = `${label} 기출 해설에서 뽑은 핵심 개념을 목차 순서로 정리했습니다.`;

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
  const groups = groupByPartAndSection(concepts);
  const questionCounts = Object.fromEntries(
    concepts.map((c) => [c.slug, getConceptQuestionCount(subject, c)])
  );

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <BackLink href="/study#concepts">과목 목록으로</BackLink>

        <p className="mb-4 font-display text-body-sm text-fog">
          <Link href="/study#concepts" className="hover:text-ink">
            기출 all-in-one
          </Link>{" "}
          / {label}
        </p>

        <div className="mb-8">
          <EyebrowLabel className="mb-2">개념 · 공인중개사 {info.round}</EyebrowLabel>
          <SectionHeading as="h1">
            <span className="text-electric-blue">기출</span> all-in-one
          </SectionHeading>
          <p className="mt-3 max-w-2xl font-display text-body text-smoke">
            {label} 기출 해설에서 뽑은 핵심 개념을 목차 순서로 정리했습니다.
          </p>
          <p className="mt-2 font-display text-body-sm text-fog">
            개념 {concepts.length}개 · 대단원 {groups.length}개
          </p>
        </div>

        <ConceptPartList
          subject={subject}
          groups={groups}
          questionCounts={questionCounts}
        />
      </div>
    </div>
  );
}
