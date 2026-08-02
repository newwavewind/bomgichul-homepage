import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicServiceQuestion } from "@/components/public-service/PublicServiceQuestion";
import { QuestionStem } from "@/components/exam/QuestionStem";
import { getPublicServiceExam, getPublicServiceSubject } from "@/lib/public-service-content";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ subject: string; year: string; source: string; no: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  const data = getPublicServiceSubject(subjectId);
  const exam = getPublicServiceExam(subjectId, Number(year), source, Number(no));
  if (!data || !exam) return {};
  return buildPageMetadata({ title: `${year}년 ${source} ${data.subject.label} ${no}번`, description: exam.stem, path: `/public-service/exam/${subjectId}/${year}/${source}/${no}` });
}

export default async function PublicServiceExamDetailPage({ params }: Props) {
  const { subject: subjectId, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  const data = getPublicServiceSubject(subjectId);
  const exam = getPublicServiceExam(subjectId, Number(year), source, Number(no));
  if (!data || !exam) notFound();
  const session = data.exams.filter((item) => item.year === Number(year) && item.sourceCode === source).sort((a, b) => a.questionNo - b.questionNo);
  const position = session.findIndex((item) => item.questionNo === exam.questionNo);
  const previous = position > 0 ? session[position - 1] : null;
  const next = position >= 0 && position < session.length - 1 ? session[position + 1] : null;
  return (
    <div className="px-4 py-8 md:py-12"><article className="mx-auto max-w-4xl">
      <Link href={`/public-service/exam/${subjectId}/${year}/${source}`} className="font-display text-body-sm text-fog hover:text-ink">← {year}년 {source} 목록</Link>
      <header className="mt-6 rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-paper p-6 shadow-[var(--shadow-card)] md:p-9">
        <p className="font-display text-[13px] font-semibold text-electric-blue">{data.subject.label} · {year}년 {source}</p>
        <div className="mt-5"><QuestionStem stem={exam.stem} questionNo={exam.questionNo} /></div>
        {(exam.category || exam.subcategory) ? (
          <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="문항 분류">
            <span className="font-display text-[12px] text-fog">분류</span>
            {exam.category ? <span className="rounded-full bg-snow px-3 py-1 font-display text-[12px] text-smoke">{exam.category}</span> : null}
            {exam.subcategory && exam.subcategory !== exam.category ? <span className="rounded-full bg-snow px-3 py-1 font-display text-[12px] text-smoke">{exam.subcategory}</span> : null}
          </div>
        ) : null}
      </header>
      <div className="mt-6"><PublicServiceQuestion exam={exam} /></div>
      <nav className="mt-8 grid grid-cols-2 gap-3">
        {previous ? <Link href={`/public-service/exam/${subjectId}/${year}/${source}/${previous.questionNo}`} className="rounded-2xl border border-mist px-4 py-3 font-display text-body-sm hover:border-carbon">← {previous.questionNo}번</Link> : <span />}
        {next ? <Link href={`/public-service/exam/${subjectId}/${year}/${source}/${next.questionNo}`} className="rounded-2xl border border-mist px-4 py-3 text-right font-display text-body-sm hover:border-carbon">{next.questionNo}번 →</Link> : null}
      </nav>
    </article></div>
  );
}
