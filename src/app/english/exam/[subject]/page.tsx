import type { Metadata } from "next";
import { ENGLISH_TRACK } from "@/lib/exam-track/config";
import { ENGLISH_SUBJECT_IDS, getEnglishSubject, getEnglishConcept, getEnglishExam, getEnglishExamSessions, getEnglishLinkedExams } from "@/lib/english-content";
import {
  TrackExamSubjectPage,
  trackExamSubjectMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getEnglishSubject,
  getConcept: getEnglishConcept,
  getExam: getEnglishExam,
  getExamSessions: getEnglishExamSessions,
  getLinkedExams: getEnglishLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(ENGLISH_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackExamSubjectMetadata(ENGLISH_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackExamSubjectPage track={ENGLISH_TRACK} api={api} subjectId={subject} />;
}
