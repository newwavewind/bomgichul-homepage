import type { Metadata } from "next";
import { ENGLISH_TRACK } from "@/lib/exam-track/config";
import { getEnglishSubject, getEnglishConcept, getEnglishExam, getEnglishExamSessions, getEnglishLinkedExams } from "@/lib/english-content";
import {
  TrackExamDetailPage,
  trackExamDetailMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getEnglishSubject,
  getConcept: getEnglishConcept,
  getExam: getEnglishExam,
  getExamSessions: getEnglishExamSessions,
  getLinkedExams: getEnglishLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string; no: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamDetailMetadata(ENGLISH_TRACK, api, subject, year, source, no);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamDetailPage
      track={ENGLISH_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
      no={no}
    />
  );
}
