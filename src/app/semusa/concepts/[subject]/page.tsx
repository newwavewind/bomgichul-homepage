import type { Metadata } from "next";
import { SEMUSA_TRACK } from "@/lib/exam-track/config";
import { SEMUSA_SUBJECT_IDS, getSemusaSubject, getSemusaConcept, getSemusaExam, getSemusaExamSessions, getSemusaLinkedExams } from "@/lib/semusa-content";
import {
  TrackConceptListPage,
  trackConceptListMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getSemusaSubject,
  getConcept: getSemusaConcept,
  getExam: getSemusaExam,
  getExamSessions: getSemusaExamSessions,
  getLinkedExams: getSemusaLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(SEMUSA_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackConceptListMetadata(SEMUSA_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackConceptListPage track={SEMUSA_TRACK} api={api} subjectId={subject} />;
}
