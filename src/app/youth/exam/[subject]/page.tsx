import type { Metadata } from "next";
import { YOUTH_TRACK } from "@/lib/exam-track/config";
import { YOUTH_SUBJECT_IDS, getYouthSubject, getYouthConcept, getYouthExam, getYouthExamSessions, getYouthLinkedExams } from "@/lib/youth-content";
import {
  TrackExamSubjectPage,
  trackExamSubjectMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getYouthSubject,
  getConcept: getYouthConcept,
  getExam: getYouthExam,
  getExamSessions: getYouthExamSessions,
  getLinkedExams: getYouthLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(YOUTH_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackExamSubjectMetadata(YOUTH_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackExamSubjectPage track={YOUTH_TRACK} api={api} subjectId={subject} />;
}
