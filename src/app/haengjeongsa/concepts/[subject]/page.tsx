import type { Metadata } from "next";
import { HAENGJEONGSA_TRACK } from "@/lib/exam-track/config";
import { HAENGJEONGSA_SUBJECT_IDS, getHaengjeongsaSubject, getHaengjeongsaConcept, getHaengjeongsaExam, getHaengjeongsaExamSessions, getHaengjeongsaLinkedExams } from "@/lib/haengjeongsa-content";
import {
  TrackConceptListPage,
  trackConceptListMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getHaengjeongsaSubject,
  getConcept: getHaengjeongsaConcept,
  getExam: getHaengjeongsaExam,
  getExamSessions: getHaengjeongsaExamSessions,
  getLinkedExams: getHaengjeongsaLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(HAENGJEONGSA_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackConceptListMetadata(HAENGJEONGSA_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackConceptListPage track={HAENGJEONGSA_TRACK} api={api} subjectId={subject} />;
}
