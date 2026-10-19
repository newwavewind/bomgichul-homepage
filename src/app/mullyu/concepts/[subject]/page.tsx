import type { Metadata } from "next";
import { MULLYU_TRACK } from "@/lib/exam-track/config";
import { MULLYU_SUBJECT_IDS, getMullyuSubject, getMullyuConcept, getMullyuExam, getMullyuExamSessions, getMullyuLinkedExams } from "@/lib/mullyu-content";
import {
  TrackConceptListPage,
  trackConceptListMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getMullyuSubject,
  getConcept: getMullyuConcept,
  getExam: getMullyuExam,
  getExamSessions: getMullyuExamSessions,
  getLinkedExams: getMullyuLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(MULLYU_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackConceptListMetadata(MULLYU_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackConceptListPage track={MULLYU_TRACK} api={api} subjectId={subject} />;
}
