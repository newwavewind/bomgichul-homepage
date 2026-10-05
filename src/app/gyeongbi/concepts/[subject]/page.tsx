import type { Metadata } from "next";
import { GYEONGBI_TRACK } from "@/lib/exam-track/config";
import { GYEONGBI_SUBJECT_IDS, getGyeongbiSubject, getGyeongbiConcept, getGyeongbiExam, getGyeongbiExamSessions, getGyeongbiLinkedExams } from "@/lib/gyeongbi-content";
import {
  TrackConceptListPage,
  trackConceptListMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getGyeongbiSubject,
  getConcept: getGyeongbiConcept,
  getExam: getGyeongbiExam,
  getExamSessions: getGyeongbiExamSessions,
  getLinkedExams: getGyeongbiLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(GYEONGBI_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackConceptListMetadata(GYEONGBI_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackConceptListPage track={GYEONGBI_TRACK} api={api} subjectId={subject} />;
}
