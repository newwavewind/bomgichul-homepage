import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrackConceptDetailView } from "@/components/exam-track/TrackConceptDetailView";
import {
  getPublicServiceConcept,
  getPublicServiceSubject,
  type PublicServiceExam,
} from "@/lib/public-service-content";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ subject: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId, slug } = await params;
  const data = getPublicServiceSubject(subjectId);
  const concept = getPublicServiceConcept(subjectId, slug);
  if (!data || !concept) return {};
  return buildPageMetadata({
    title: `${concept.titleKo} | ${data.subject.label}`,
    description: concept.definition.slice(0, 150),
    path: `/public-service/concepts/${subjectId}/${slug}`,
  });
}

export default async function PublicServiceConceptDetailPage({ params }: Props) {
  const { subject: subjectId, slug } = await params;
  const data = getPublicServiceSubject(subjectId);
  const concept = getPublicServiceConcept(subjectId, slug);
  if (!data || !concept) notFound();

  const linkedExams = (concept.questionRefs ?? [])
    .map((ref) =>
      ref.examId
        ? data.exams.find((exam) => exam.id === ref.examId)
        : data.exams.find(
            (exam) =>
              exam.year === ref.year &&
              exam.sourceCode === ref.sourceCode &&
              exam.questionNo === ref.questionNo,
          ),
    )
    .filter((exam): exam is PublicServiceExam => Boolean(exam))
    .slice(0, 12);

  const index = data.concepts.findIndex((item) => item.slug === slug);
  const prev = index > 0 ? data.concepts[index - 1] : null;
  const next =
    index >= 0 && index < data.concepts.length - 1 ? data.concepts[index + 1] : null;
  const listHref = `/public-service/concepts/${subjectId}`;

  return (
    <TrackConceptDetailView
      subjectLabel={data.subject.label}
      listHref={listHref}
      concept={concept}
      linkedExams={linkedExams}
      examHrefFor={(exam) =>
        `/public-service/exam/${subjectId}/${exam.year}/${encodeURIComponent(exam.sourceCode)}/${exam.questionNo}`
      }
      prev={prev}
      next={next}
      prevHref={prev ? `${listHref}/${prev.slug}` : null}
      nextHref={next ? `${listHref}/${next.slug}` : null}
    />
  );
}
