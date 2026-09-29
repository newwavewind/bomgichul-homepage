import type { Metadata } from "next";
import { GUGEO_TRACK } from "@/lib/exam-track/config";
import { GUGEO_SUBJECT_IDS, getGugeoSubject, getGugeoConcept, getGugeoExam, getGugeoExamSessions, getGugeoLinkedExams } from "@/lib/gugeo-content";
import {
  TrackExamSessionPage,
  trackExamSessionMetadata,
  trackSessionStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getGugeoSubject,
  getConcept: getGugeoConcept,
  getExam: getGugeoExam,
  getExamSessions: getGugeoExamSessions,
  getLinkedExams: getGugeoLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

// 최근 1개년만 미리 만들고, 지난 연도는 첫 방문 때 생성해 캐시한다.
export function generateStaticParams() {
  return trackSessionStaticParams(api, GUGEO_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamSessionMetadata(GUGEO_TRACK, api, subject, year, source);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamSessionPage
      track={GUGEO_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
    />
  );
}
