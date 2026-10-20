import type { Metadata } from "next";
import { YOUTH_TRACK } from "@/lib/exam-track/config";
import { YOUTH_SUBJECT_IDS, getYouthSubject, getYouthConcept, getYouthExam, getYouthExamSessions, getYouthLinkedExams } from "@/lib/youth-content";
import {
  TrackExamSessionPage,
  trackExamSessionMetadata,
  trackSessionStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getYouthSubject,
  getConcept: getYouthConcept,
  getExam: getYouthExam,
  getExamSessions: getYouthExamSessions,
  getLinkedExams: getYouthLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

// 최근 1개년만 미리 만들고, 지난 연도는 첫 방문 때 생성해 캐시한다.
export function generateStaticParams() {
  return trackSessionStaticParams(api, YOUTH_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamSessionMetadata(YOUTH_TRACK, api, subject, year, source);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamSessionPage
      track={YOUTH_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
    />
  );
}
