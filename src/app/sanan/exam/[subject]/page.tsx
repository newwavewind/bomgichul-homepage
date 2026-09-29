import type { Metadata } from "next";
import { SANAN_TRACK } from "@/lib/exam-track/config";
import { SANAN_SUBJECT_IDS, getSananSubject, getSananConcept, getSananExam, getSananExamSessions, getSananLinkedExams } from "@/lib/sanan-content";
import {
  TrackExamSubjectPage,
  trackExamSubjectMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getSananSubject,
  getConcept: getSananConcept,
  getExam: getSananExam,
  getExamSessions: getSananExamSessions,
  getLinkedExams: getSananLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(SANAN_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackExamSubjectMetadata(SANAN_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackExamSubjectPage track={SANAN_TRACK} api={api} subjectId={subject} />;
}
