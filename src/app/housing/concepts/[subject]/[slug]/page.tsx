import type { Metadata } from "next";
import { HOUSING_TRACK } from "@/lib/exam-track/config";
import { getHousingSubject, getHousingConcept, getHousingExam, getHousingExamSessions, getHousingLinkedExams } from "@/lib/housing-content";
import {
  TrackConceptDetailPage,
  trackConceptDetailMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getHousingSubject,
  getConcept: getHousingConcept,
  getExam: getHousingExam,
  getExamSessions: getHousingExamSessions,
  getLinkedExams: getHousingLinkedExams,
};

type Props = { params: Promise<{ subject: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, slug } = await params;
  return trackConceptDetailMetadata(HOUSING_TRACK, api, subject, slug);
}

export default async function Page({ params }: Props) {
  const { subject, slug } = await params;
  return <TrackConceptDetailPage track={HOUSING_TRACK} api={api} subjectId={subject} slug={slug} />;
}
