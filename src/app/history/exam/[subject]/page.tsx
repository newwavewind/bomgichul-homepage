import type { Metadata } from "next";
import { HISTORY_TRACK } from "@/lib/exam-track/config";
import { HISTORY_SUBJECT_IDS, getHistorySubject, getHistoryConcept, getHistoryExam, getHistoryExamSessions, getHistoryLinkedExams } from "@/lib/history-content";
import {
  TrackExamSubjectPage,
  trackExamSubjectMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getHistorySubject,
  getConcept: getHistoryConcept,
  getExam: getHistoryExam,
  getExamSessions: getHistoryExamSessions,
  getLinkedExams: getHistoryLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(HISTORY_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackExamSubjectMetadata(HISTORY_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackExamSubjectPage track={HISTORY_TRACK} api={api} subjectId={subject} />;
}
