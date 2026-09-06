import type { Metadata } from "next";
import { HOUSING_TRACK } from "@/lib/exam-track/config";
import { HOUSING_SUBJECT_IDS, getHousingSubject, getHousingConcept, getHousingExam, getHousingExamSessions, getHousingLinkedExams } from "@/lib/housing-content";
import {
  TrackConceptListPage,
  trackConceptListMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getHousingSubject,
  getConcept: getHousingConcept,
  getExam: getHousingExam,
  getExamSessions: getHousingExamSessions,
  getLinkedExams: getHousingLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(HOUSING_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackConceptListMetadata(HOUSING_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackConceptListPage track={HOUSING_TRACK} api={api} subjectId={subject} />;
}
