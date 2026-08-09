import type { Metadata } from "next";
import { HOUSING_TRACK } from "@/lib/exam-track/config";
import { getHousingSubject, getHousingConcept, getHousingExam, getHousingExamSessions, getHousingLinkedExams } from "@/lib/housing-content";
import {
  TrackExamDetailPage,
  trackExamDetailMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getHousingSubject,
  getConcept: getHousingConcept,
  getExam: getHousingExam,
  getExamSessions: getHousingExamSessions,
  getLinkedExams: getHousingLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string; no: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamDetailMetadata(HOUSING_TRACK, api, subject, year, source, no);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamDetailPage
      track={HOUSING_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
      no={no}
    />
  );
}
