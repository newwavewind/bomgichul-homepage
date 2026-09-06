import type { Metadata } from "next";
import { HISTORY_TRACK } from "@/lib/exam-track/config";
import { getHistorySubject, getHistoryConcept, getHistoryExam, getHistoryExamSessions, getHistoryLinkedExams } from "@/lib/history-content";
import {
  TrackExamDetailPage,
  trackExamDetailMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getHistorySubject,
  getConcept: getHistoryConcept,
  getExam: getHistoryExam,
  getExamSessions: getHistoryExamSessions,
  getLinkedExams: getHistoryLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string; no: string }> };

// 문항 페이지는 수천 쪽이라 빌드 때는 하나도 만들지 않고, 첫 방문 때 생성해
// 캐시한다(빈 배열이라도 있어야 정적 렌더가 된다 — 이 판 Next 규칙).
export function generateStaticParams() {
  return [];
}

// 공개 메모가 실리는 페이지 — 한 시간마다 다시 그린다.
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamDetailMetadata(HISTORY_TRACK, api, subject, year, source, no);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamDetailPage
      track={HISTORY_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
      no={no}
    />
  );
}
