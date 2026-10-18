import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getPublicServiceExamSessions, getPublicServiceSubject, PUBLIC_SERVICE_SUBJECT_IDS } from "@/lib/public-service-content";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

// 최근 1개년만 미리 만들고, 지난 연도는 첫 방문 때 생성해 캐시한다.
export function generateStaticParams() {
  return PUBLIC_SERVICE_SUBJECT_IDS.flatMap((subject) => {
    const sessions = getPublicServiceExamSessions(subject);
    const latestYear = Math.max(...sessions.map((session) => session.year), 0);
    return sessions
      .filter((session) => session.year === latestYear)
      .map((session) => ({ subject, year: String(session.year), source: session.sourceCode }));
  });
}

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
  return redirect(
    `/public-service/exam/${subjectId}/${year}/${encodeURIComponent(source)}/${exams[0].questionNo}`,
  );
}
