import type { Metadata } from "next";
import { HOUSING_TRACK } from "@/lib/exam-track/config";
import { getHousingSubject, getHousingConcept, getHousingExam, getHousingExamSessions, getHousingLinkedExams } from "@/lib/housing-content";
import {
  TrackConceptListPage,
  trackConceptListMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getHousingSubject,
  getConcept: getHousingConcept,
  getExam: getHousingExam,
  getExamSessions: getHousingExamSessions,
  getLinkedExams: getHousingLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackConceptListMetadata(HOUSING_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackConceptListPage track={HOUSING_TRACK} api={api} subjectId={subject} />;
}
