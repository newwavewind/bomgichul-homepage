import type { Metadata } from "next";
import { FIREFIGHTER_TRACK } from "@/lib/exam-track/config";
import { FIREFIGHTER_SUBJECT_IDS, getFirefighterSubject, getFirefighterConcept, getFirefighterExam, getFirefighterExamSessions, getFirefighterLinkedExams } from "@/lib/firefighter-content";
import {
  TrackConceptListPage,
  trackConceptListMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getFirefighterSubject,
  getConcept: getFirefighterConcept,
  getExam: getFirefighterExam,
  getExamSessions: getFirefighterExamSessions,
  getLinkedExams: getFirefighterLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(FIREFIGHTER_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackConceptListMetadata(FIREFIGHTER_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackConceptListPage track={FIREFIGHTER_TRACK} api={api} subjectId={subject} />;
}
