import type { Metadata } from "next";
import { FIREFIGHTER_TRACK } from "@/lib/exam-track/config";
import { FIREFIGHTER_SUBJECT_IDS, getFirefighterSubject, getFirefighterConcept, getFirefighterExam, getFirefighterExamSessions, getFirefighterLinkedExams } from "@/lib/firefighter-content";
import {
  TrackExamSessionPage,
  trackExamSessionMetadata,
  trackSessionStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getFirefighterSubject,
  getConcept: getFirefighterConcept,
  getExam: getFirefighterExam,
  getExamSessions: getFirefighterExamSessions,
  getLinkedExams: getFirefighterLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

// 최근 1개년만 미리 만들고, 지난 연도는 첫 방문 때 생성해 캐시한다.
export function generateStaticParams() {
  return trackSessionStaticParams(api, FIREFIGHTER_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamSessionMetadata(FIREFIGHTER_TRACK, api, subject, year, source);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamSessionPage
      track={FIREFIGHTER_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
    />
  );
}
