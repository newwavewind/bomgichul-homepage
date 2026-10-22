import type { Metadata } from "next";
import { MULLYU_TRACK } from "@/lib/exam-track/config";
import { getMullyuSubject, getMullyuConcept, getMullyuExam, getMullyuExamSessions, getMullyuLinkedExams } from "@/lib/mullyu-content";
import {
  TrackExamDetailPage,
  trackExamDetailMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getMullyuSubject,
  getConcept: getMullyuConcept,
  getExam: getMullyuExam,
  getExamSessions: getMullyuExamSessions,
  getLinkedExams: getMullyuLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string; no: string }> };

// 문항 페이지는 수천 쪽이라 빌드 때는 하나도 만들지 않고, 첫 방문 때 생성해
// 캐시한다(빈 배열이라도 있어야 정적 렌더가 된다 — 이 판 Next 규칙).
export function generateStaticParams() {
  return [];
}

// 공개 메모가 실리는 페이지 — 글을 쓰면 그 자리에서 비우므로(/api/revalidate), 저절로는 하루에 한 번만 다시 그린다(비용).
export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamDetailMetadata(MULLYU_TRACK, api, subject, year, source, no);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamDetailPage
      track={MULLYU_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
      no={no}
    />
  );
}
