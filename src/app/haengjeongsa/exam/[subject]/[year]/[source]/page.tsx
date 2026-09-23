import type { Metadata } from "next";
import { HAENGJEONGSA_TRACK } from "@/lib/exam-track/config";
import { HAENGJEONGSA_SUBJECT_IDS, getHaengjeongsaSubject, getHaengjeongsaConcept, getHaengjeongsaExam, getHaengjeongsaExamSessions, getHaengjeongsaLinkedExams } from "@/lib/haengjeongsa-content";
import {
  TrackExamSessionPage,
  trackExamSessionMetadata,
  trackSessionStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getHaengjeongsaSubject,
  getConcept: getHaengjeongsaConcept,
  getExam: getHaengjeongsaExam,
  getExamSessions: getHaengjeongsaExamSessions,
  getLinkedExams: getHaengjeongsaLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

// 최근 1개년만 미리 만들고, 지난 연도는 첫 방문 때 생성해 캐시한다.
export function generateStaticParams() {
  return trackSessionStaticParams(api, HAENGJEONGSA_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamSessionMetadata(HAENGJEONGSA_TRACK, api, subject, year, source);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamSessionPage
      track={HAENGJEONGSA_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
    />
  );
}
