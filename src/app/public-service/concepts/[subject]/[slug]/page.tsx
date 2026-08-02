import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicServiceConcept, getPublicServiceSubject } from "@/lib/public-service-content";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ subject: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject: subjectId, slug } = await params;
  const data = getPublicServiceSubject(subjectId);
  const concept = getPublicServiceConcept(subjectId, slug);
  if (!data || !concept) return {};
  return buildPageMetadata({ title: `${concept.titleKo} | ${data.subject.label}`, description: concept.definition.slice(0, 150), path: `/public-service/concepts/${subjectId}/${slug}` });
}

export default async function PublicServiceConceptDetailPage({ params }: Props) {
  const { subject: subjectId, slug } = await params;
  const data = getPublicServiceSubject(subjectId);
  const concept = getPublicServiceConcept(subjectId, slug);
  if (!data || !concept) notFound();
  const linkedExams = (concept.questionRefs ?? []).map((ref) => ref.examId
    ? data.exams.find((exam) => exam.id === ref.examId)
    : data.exams.find((exam) => exam.year === ref.year && exam.sourceCode === ref.sourceCode && exam.questionNo === ref.questionNo)).filter(Boolean).slice(0, 12);
  return (
    <div className="px-4 py-8 md:py-12"><article className="mx-auto max-w-4xl">
      <Link href={`/public-service/concepts/${subjectId}`} className="font-display text-body-sm text-fog hover:text-ink">← {data.subject.label} 개념 목록</Link>
      <header className="mt-6 rounded-[var(--radius-largecards)] border-[1.5px] border-carbon bg-paper p-6 shadow-[var(--shadow-card)] md:p-9">
        <p className="font-display text-[13px] font-semibold text-electric-blue">{concept.chapterKo} · {concept.sectionKo || concept.subcategory}</p>
        <h1 className="mt-3 font-display text-heading font-semibold text-ink">{concept.titleKo}</h1>
        {concept.titleEn ? <p className="mt-1 font-display text-body-sm text-fog">{concept.titleEn}</p> : null}
        <p className="mt-6 whitespace-pre-line font-system text-[16px] leading-8 text-ink">{concept.definition}</p>
      </header>
      <div className="mt-6 space-y-6">
        {concept.intuition ? <ContentSection title="이해하기"><p>{concept.intuition}</p></ContentSection> : null}
        {concept.keyPoints?.length ? <ContentSection title="핵심 포인트"><ol className="space-y-3">{concept.keyPoints.map((point, index) => <li key={index} className="flex gap-3"><span className="font-display font-semibold text-electric-blue">{index + 1}</span><span>{point}</span></li>)}</ol></ContentSection> : null}
        {concept.example ? <ContentSection title="예시"><p>{concept.example}</p></ContentSection> : null}
        {concept.pitfalls ? <ContentSection title="시험 함정" accent><p>{concept.pitfalls}</p></ContentSection> : null}
        {concept.pitfallCards?.length ? <ContentSection title="틀린 표현 바로잡기" accent><div className="space-y-4">{concept.pitfallCards.map((card, index) => <div key={index} className="rounded-2xl border border-mist bg-paper p-4"><p className="text-coral">✕ {card.wrong}</p><p className="mt-3 border-t border-mist pt-3 text-leaf">○ {card.correct}</p></div>)}</div></ContentSection> : null}
        {linkedExams.length ? <ContentSection title="연결 기출문제"><div className="grid gap-3 sm:grid-cols-2">{linkedExams.map((exam) => exam ? <Link key={exam.id} href={`/public-service/exam/${subjectId}/${exam.year}/${exam.sourceCode}/${exam.questionNo}`} className="rounded-xl border border-mist px-4 py-3 font-display text-body-sm hover:border-carbon">{exam.year}년 {exam.sourceCode} {exam.questionNo}번 →</Link> : null)}</div></ContentSection> : null}
      </div>
    </article></div>
  );
}

function ContentSection({ title, children, accent = false }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return <section className={`rounded-[var(--radius-largecards)] border p-6 md:p-8 ${accent ? "border-amber/30 bg-[#fffbeb]" : "border-mist bg-paper"}`}><h2 className="font-display text-subheading font-semibold text-ink">{title}</h2><div className="mt-4 whitespace-pre-line font-system text-[15px] leading-7 text-smoke">{children}</div></section>;
}
