import type { Metadata } from "next";
import { SANAN_TRACK } from "@/lib/exam-track/config";
import { SANAN_SUBJECT_IDS, getSananSubject, getSananConcept, getSananExam, getSananExamSessions, getSananLinkedExams } from "@/lib/sanan-content";
import {
  TrackExamSessionPage,
  trackExamSessionMetadata,
  trackSessionStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getSananSubject,
  getConcept: getSananConcept,
  getExam: getSananExam,
  getExamSessions: getSananExamSessions,
  getLinkedExams: getSananLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

// 최근 1개년만 미리 만들고, 지난 연도는 첫 방문 때 생성해 캐시한다.
export function generateStaticParams() {
  return trackSessionStaticParams(api, SANAN_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamSessionMetadata(SANAN_TRACK, api, subject, year, source);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamSessionPage
      track={SANAN_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
    />
  );
}
