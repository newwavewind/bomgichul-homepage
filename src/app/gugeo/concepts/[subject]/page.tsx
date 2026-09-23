import type { Metadata } from "next";
import { GUGEO_TRACK } from "@/lib/exam-track/config";
import { GUGEO_SUBJECT_IDS, getGugeoSubject, getGugeoConcept, getGugeoExam, getGugeoExamSessions, getGugeoLinkedExams } from "@/lib/gugeo-content";
import {
  TrackConceptListPage,
  trackConceptListMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getGugeoSubject,
  getConcept: getGugeoConcept,
  getExam: getGugeoExam,
  getExamSessions: getGugeoExamSessions,
  getLinkedExams: getGugeoLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(GUGEO_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackConceptListMetadata(GUGEO_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackConceptListPage track={GUGEO_TRACK} api={api} subjectId={subject} />;
}
