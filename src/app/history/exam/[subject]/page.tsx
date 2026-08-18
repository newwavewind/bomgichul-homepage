import type { Metadata } from "next";
import { HISTORY_TRACK } from "@/lib/exam-track/config";
import { getHistorySubject, getHistoryConcept, getHistoryExam, getHistoryExamSessions, getHistoryLinkedExams } from "@/lib/history-content";
import {
  TrackExamSubjectPage,
  trackExamSubjectMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getHistorySubject,
  getConcept: getHistoryConcept,
  getExam: getHistoryExam,
  getExamSessions: getHistoryExamSessions,
  getLinkedExams: getHistoryLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackExamSubjectMetadata(HISTORY_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackExamSubjectPage track={HISTORY_TRACK} api={api} subjectId={subject} />;
}
