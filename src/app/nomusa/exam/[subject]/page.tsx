import type { Metadata } from "next";
import { NOMUSA_TRACK } from "@/lib/exam-track/config";
import { NOMUSA_SUBJECT_IDS, getNomusaSubject, getNomusaConcept, getNomusaExam, getNomusaExamSessions, getNomusaLinkedExams } from "@/lib/nomusa-content";
import {
  TrackExamSubjectPage,
  trackExamSubjectMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getNomusaSubject,
  getConcept: getNomusaConcept,
  getExam: getNomusaExam,
  getExamSessions: getNomusaExamSessions,
  getLinkedExams: getNomusaLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(NOMUSA_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackExamSubjectMetadata(NOMUSA_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackExamSubjectPage track={NOMUSA_TRACK} api={api} subjectId={subject} />;
}
