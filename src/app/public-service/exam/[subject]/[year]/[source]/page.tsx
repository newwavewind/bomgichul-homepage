import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicServiceSubject } from "@/lib/public-service-content";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  const data = getPublicServiceSubject(subjectId);
  if (!data) return {};
  return buildPageMetadata({ title: `${year}년 ${source} ${data.subject.label}`, description: `${year}년 9급 ${source} ${data.subject.label} 기출문제와 해설`, path: `/public-service/exam/${subjectId}/${year}/${source}` });
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
      <Link href={`/public-service/exam/${subjectId}`} className="font-display text-body-sm text-fog hover:text-ink">← {data.subject.label} 기출 목록</Link>
      <header className="mt-6 border-b border-mist pb-8"><p className="font-display text-[13px] font-semibold text-electric-blue">{data.subject.label}</p><h1 className="mt-2 font-display text-heading font-semibold text-ink">{year}년 9급 {source}</h1><p className="mt-3 font-display text-body text-smoke">원문 {exams.length}문항 · 선지별 O/X 해설</p></header>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">{exams.map((exam) => (
        <Link key={exam.id} href={`/public-service/exam/${subjectId}/${year}/${source}/${exam.questionNo}`} className="rounded-2xl border border-mist bg-paper p-5 hover:border-carbon">
          <div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-snow font-display font-semibold text-ink">{exam.questionNo}</span><div><p className="line-clamp-2 font-system text-[15px] leading-6 text-ink">{exam.stem}</p><p className="mt-2 font-display text-[12px] text-fog">{exam.category} · {exam.subcategory}</p></div></div>
        </Link>
      ))}</div>
    </div></div>
  );
}
