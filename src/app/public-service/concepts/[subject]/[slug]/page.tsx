import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrackConceptDetailView } from "@/components/exam-track/TrackConceptDetailView";
import {
  getPublicServiceConcept,
  getPublicServiceSubject,
  type PublicServiceExam,
} from "@/lib/public-service-content";
import { buildPageMetadata, conceptSeoTitle, truncateDescription } from "@/lib/seo";
import { getUser } from "@/lib/auth";
import { getConceptCommunityPosts } from "@/lib/concept-community";
import { getUserActivityScores } from "@/lib/activity";
import type { TrackConceptStatement } from "@/components/exam-track/TrackConceptStatements";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { findTrackConceptsForExamQuestion } from "@/lib/exam-track/concept-matches";

type Props = { params: Promise<{ subject: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId, slug } = await params;
  const data = getPublicServiceSubject(subjectId);
  const concept = getPublicServiceConcept(subjectId, slug);
  if (!data || !concept) return {};
  return buildPageMetadata({
    title: `${conceptSeoTitle(concept.titleKo, concept.sectionKo)} | 9급 공무원 ${data.subject.label} 기출 올인원`,
    description: truncateDescription(
      `9급 공무원 ${data.subject.label} · ${concept.titleKo}. ${concept.definition}`,
    ),
    path: `/public-service/concepts/${subjectId}/${slug}`,
  });
}

export default async function PublicServiceConceptDetailPage({ params }: Props) {
  const { subject: subjectId, slug } = await params;
  const data = getPublicServiceSubject(subjectId);
  const concept = getPublicServiceConcept(subjectId, slug);
  if (!data || !concept) notFound();

  const linkedExams = data.exams
    .filter((exam) =>
      findTrackConceptsForExamQuestion(data, exam).some(
        (matched) => matched.slug === concept.slug,
      ),
    )
    .slice(0, 12);

  const index = data.concepts.findIndex((item) => item.slug === slug);
  const prev = index > 0 ? data.concepts[index - 1] : null;
  const next =
    index >= 0 && index < data.concepts.length - 1 ? data.concepts[index + 1] : null;
  const listHref = `/public-service/concepts/${subjectId}`;
  const subjectKey = `public_service:${subjectId}`;
  const user = await getUser();
  const communityPosts = await getConceptCommunityPosts(subjectKey, slug, user?.id ?? null);
  const authorIds = [...communityPosts.map((post) => post.user_id), ...communityPosts.flatMap((post) => post.comments.map((comment) => comment.user_id))];
  const activity = await getUserActivityScores(authorIds);
  const authorRanks = Object.fromEntries(Object.entries(activity).map(([id, value]) => [id, value.rank]));
  const hrefFor = (exam: PublicServiceExam) => `/public-service/exam/${subjectId}/${exam.year}/${encodeURIComponent(exam.sourceCode)}/${exam.questionNo}`;
  const tagged = data.exams.flatMap((exam) => exam.items.filter((item) => item.taxonomy_unit_id === slug).map((item) => ({ exam, item })));
  const candidates = tagged.length > 0 ? tagged : linkedExams.flatMap((exam) => exam.items.map((item) => ({ exam, item })));
  const seen = new Set<string>();
  const statements: TrackConceptStatement[] = candidates
    .filter(({ item }) => item.text.trim().length > 8 && (item.answer === "O" || item.answer === "X"))
    .filter(({ item }) => (seen.has(item.text.trim()) ? false : (seen.add(item.text.trim()), true)))
    .map(({ exam, item }, index) => ({ id: `${exam.id}:${item.key}:${index}`, text: item.text, answer: item.answer, explanation: item.explanation, sourceLabel: `${exam.year}년 ${exam.sourceCode} ${exam.questionNo}번`, href: hrefFor(exam) }));

  return (
    <>
    <TrackConceptDetailView
      subjectLabel={data.subject.label}
      listHref={listHref}
      concept={concept}
      linkedExams={linkedExams}
      examHrefFor={(exam) => `/public-service/exam/${subjectId}/${exam.year}/${encodeURIComponent(exam.sourceCode)}/${exam.questionNo}`}
      prev={prev}
      next={next}
      prevHref={prev ? `${listHref}/${prev.slug}` : null}
      nextHref={next ? `${listHref}/${next.slug}` : null}
      subjectKey={subjectKey}
      userId={user?.id ?? null}
      initialPosts={communityPosts}
      authorRanks={authorRanks}
      statements={statements}
    />
    <div className="px-4 pb-8">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <SimpleAppInstallStrip scope="public_service" />
      </div>
    </div>
    </>
  );
}
