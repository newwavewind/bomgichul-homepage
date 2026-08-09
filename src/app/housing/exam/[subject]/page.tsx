import type { Metadata } from "next";
import { HOUSING_TRACK } from "@/lib/exam-track/config";
import { getHousingSubject, getHousingConcept, getHousingExam, getHousingExamSessions, getHousingLinkedExams } from "@/lib/housing-content";
import {
  TrackExamSubjectPage,
  trackExamSubjectMetadata,
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
  return trackExamSubjectMetadata(HOUSING_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackExamSubjectPage track={HOUSING_TRACK} api={api} subjectId={subject} />;
}
