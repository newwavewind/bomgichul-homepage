import type { Metadata } from "next";
import { GAMJEONG_TRACK } from "@/lib/exam-track/config";
import { GAMJEONG_SUBJECT_IDS, getGamjeongSubject, getGamjeongConcept, getGamjeongExam, getGamjeongExamSessions, getGamjeongLinkedExams } from "@/lib/gamjeong-content";
import {
  TrackExamSessionPage,
  trackExamSessionMetadata,
  trackSessionStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getGamjeongSubject,
  getConcept: getGamjeongConcept,
  getExam: getGamjeongExam,
  getExamSessions: getGamjeongExamSessions,
  getLinkedExams: getGamjeongLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

// 최근 1개년만 미리 만들고, 지난 연도는 첫 방문 때 생성해 캐시한다.
export function generateStaticParams() {
  return trackSessionStaticParams(api, GAMJEONG_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamSessionMetadata(GAMJEONG_TRACK, api, subject, year, source);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamSessionPage
      track={GAMJEONG_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
    />
  );
}
