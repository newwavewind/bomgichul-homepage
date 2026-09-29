import type { Metadata } from "next";
import { SONHAE_TRACK } from "@/lib/exam-track/config";
import { SONHAE_SUBJECT_IDS, getSonhaeSubject, getSonhaeConcept, getSonhaeExam, getSonhaeExamSessions, getSonhaeLinkedExams } from "@/lib/sonhae-content";
import {
  TrackConceptListPage,
  trackConceptListMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getSonhaeSubject,
  getConcept: getSonhaeConcept,
  getExam: getSonhaeExam,
  getExamSessions: getSonhaeExamSessions,
  getLinkedExams: getSonhaeLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(SONHAE_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackConceptListMetadata(SONHAE_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackConceptListPage track={SONHAE_TRACK} api={api} subjectId={subject} />;
}
