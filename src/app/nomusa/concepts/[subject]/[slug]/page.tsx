import type { Metadata } from "next";
import { NOMUSA_TRACK } from "@/lib/exam-track/config";
import { NOMUSA_SUBJECT_IDS, getNomusaSubject, getNomusaConcept, getNomusaExam, getNomusaExamSessions, getNomusaLinkedExams } from "@/lib/nomusa-content";
import {
  TrackConceptDetailPage,
  trackConceptDetailMetadata,
  trackConceptStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getNomusaSubject,
  getConcept: getNomusaConcept,
  getExam: getNomusaExam,
  getExamSessions: getNomusaExamSessions,
  getLinkedExams: getNomusaLinkedExams,
};

type Props = { params: Promise<{ subject: string; slug: string }> };

// 과목당 앞 10개만 미리 만들고, 나머지는 첫 방문 때 생성해 캐시한다.
export function generateStaticParams() {
  return trackConceptStaticParams(api, NOMUSA_SUBJECT_IDS);
}

// 커뮤니티 글이 실리는 페이지 — 한 시간마다 다시 그린다.
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, slug } = await params;
  return trackConceptDetailMetadata(NOMUSA_TRACK, api, subject, slug);
}

export default async function Page({ params }: Props) {
  const { subject, slug } = await params;
  return <TrackConceptDetailPage track={NOMUSA_TRACK} api={api} subjectId={subject} slug={slug} />;
}
