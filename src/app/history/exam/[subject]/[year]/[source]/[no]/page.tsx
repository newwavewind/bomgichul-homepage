import type { Metadata } from "next";
import { HISTORY_TRACK } from "@/lib/exam-track/config";
import { getHistorySubject, getHistoryConcept, getHistoryExam, getHistoryExamSessions, getHistoryLinkedExams } from "@/lib/history-content";
import {
  TrackExamDetailPage,
  trackExamDetailMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getHistorySubject,
  getConcept: getHistoryConcept,
  getExam: getHistoryExam,
  getExamSessions: getHistoryExamSessions,
  getLinkedExams: getHistoryLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string; no: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamDetailMetadata(HISTORY_TRACK, api, subject, year, source, no);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamDetailPage
      track={HISTORY_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
      no={no}
    />
  );
}
