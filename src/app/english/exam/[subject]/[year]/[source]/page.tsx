import type { Metadata } from "next";
import { ENGLISH_TRACK } from "@/lib/exam-track/config";
import { getEnglishSubject, getEnglishConcept, getEnglishExam, getEnglishExamSessions, getEnglishLinkedExams } from "@/lib/english-content";
import {
  TrackExamSessionPage,
  trackExamSessionMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getEnglishSubject,
  getConcept: getEnglishConcept,
  getExam: getEnglishExam,
  getExamSessions: getEnglishExamSessions,
  getLinkedExams: getEnglishLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamSessionMetadata(ENGLISH_TRACK, api, subject, year, source);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamSessionPage
      track={ENGLISH_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
    />
  );
}
