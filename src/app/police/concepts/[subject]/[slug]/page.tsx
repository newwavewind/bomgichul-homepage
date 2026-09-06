import type { Metadata } from "next";
import { POLICE_TRACK } from "@/lib/exam-track/config";
import { POLICE_SUBJECT_IDS, getPoliceSubject, getPoliceConcept, getPoliceExam, getPoliceExamSessions, getPoliceLinkedExams } from "@/lib/police-content";
import {
  TrackConceptDetailPage,
  trackConceptDetailMetadata,
  trackConceptStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getPoliceSubject,
  getConcept: getPoliceConcept,
  getExam: getPoliceExam,
  getExamSessions: getPoliceExamSessions,
  getLinkedExams: getPoliceLinkedExams,
};

type Props = { params: Promise<{ subject: string; slug: string }> };

// 과목당 앞 10개만 미리 만들고, 나머지는 첫 방문 때 생성해 캐시한다.
export function generateStaticParams() {
  return trackConceptStaticParams(api, POLICE_SUBJECT_IDS);
}

// 커뮤니티 글이 실리는 페이지 — 한 시간마다 다시 그린다.
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, slug } = await params;
  return trackConceptDetailMetadata(POLICE_TRACK, api, subject, slug);
}

export default async function Page({ params }: Props) {
  const { subject, slug } = await params;
  return <TrackConceptDetailPage track={POLICE_TRACK} api={api} subjectId={subject} slug={slug} />;
}
