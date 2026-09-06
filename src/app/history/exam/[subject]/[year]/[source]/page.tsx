import type { Metadata } from "next";
import { HISTORY_TRACK } from "@/lib/exam-track/config";
import { HISTORY_SUBJECT_IDS, getHistorySubject, getHistoryConcept, getHistoryExam, getHistoryExamSessions, getHistoryLinkedExams } from "@/lib/history-content";
import {
  TrackExamSessionPage,
  trackExamSessionMetadata,
  trackSessionStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getHistorySubject,
  getConcept: getHistoryConcept,
  getExam: getHistoryExam,
  getExamSessions: getHistoryExamSessions,
  getLinkedExams: getHistoryLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

// 최근 1개년만 미리 만들고, 지난 연도는 첫 방문 때 생성해 캐시한다.
export function generateStaticParams() {
  return trackSessionStaticParams(api, HISTORY_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamSessionMetadata(HISTORY_TRACK, api, subject, year, source);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamSessionPage
      track={HISTORY_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
    />
  );
}
