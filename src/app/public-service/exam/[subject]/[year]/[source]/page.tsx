import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SimpleAppInstallStrip } from "@/components/ui/SimpleAppInstallStrip";
import { BackLink } from "@/components/ui/BackLink";
import { ExamQuestionListCard } from "@/components/exam/ExamQuestionListCard";
import { getPublicServiceSubject } from "@/lib/public-service-content";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  const data = getPublicServiceSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({ title: `${year}년 9급 공무원 ${source} ${data.subject.label} 기출문제`, description: `${year}년 9급 ${source} ${data.subject.label} 기출문제와 해설`, path: `/public-service/exam/${subjectId}/${year}/${source}` });
}

export default async function PublicServiceExamSessionPage({ params }: Props) {
  const { subject: subjectId, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  const data = getPublicServiceSubject(subjectId);
  if (!data) notFound();
  const exams = data.exams.filter((exam) => exam.year === Number(year) && exam.sourceCode === source).sort((a, b) => a.questionNo - b.questionNo);
  if (!exams.length) notFound();
  return (
    <div className="px-4 py-8 md:py-12"><div className="mx-auto max-w-4xl">
      <BackLink href={`/public-service/exam/${subjectId}`}>{data.subject.label} 기출 목록</BackLink>
      <header className="mt-6 border-b border-mist pb-8"><h1 className="font-display text-heading font-semibold text-ink">{year}년 9급 {source}</h1></header>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">{exams.map((exam) => (
        <ExamQuestionListCard key={exam.id} href={`/public-service/exam/${subjectId}/${year}/${source}/${exam.questionNo}`} questionNo={exam.questionNo} stem={exam.stem} category={exam.category} subcategory={exam.subcategory} />
      ))}</div>
      <SimpleAppInstallStrip scope="public_service" />
    </div></div>
  );
}
