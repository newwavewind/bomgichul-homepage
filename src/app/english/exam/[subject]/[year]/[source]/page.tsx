import type { Metadata } from "next";
import { ENGLISH_TRACK } from "@/lib/exam-track/config";
import { ENGLISH_SUBJECT_IDS, getEnglishSubject, getEnglishConcept, getEnglishExam, getEnglishExamSessions, getEnglishLinkedExams } from "@/lib/english-content";
import {
  TrackExamSessionPage,
  trackExamSessionMetadata,
  trackSessionStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getEnglishSubject,
  getConcept: getEnglishConcept,
  getExam: getEnglishExam,
  getExamSessions: getEnglishExamSessions,
  getLinkedExams: getEnglishLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

// 최근 1개년만 미리 만들고, 지난 연도는 첫 방문 때 생성해 캐시한다.
export function generateStaticParams() {
  return trackSessionStaticParams(api, ENGLISH_SUBJECT_IDS);
}

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
