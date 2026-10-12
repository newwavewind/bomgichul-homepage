import type { Metadata } from "next";
import { GAMJEONG_TRACK } from "@/lib/exam-track/config";
import { GAMJEONG_SUBJECT_IDS, getGamjeongSubject, getGamjeongConcept, getGamjeongExam, getGamjeongExamSessions, getGamjeongLinkedExams } from "@/lib/gamjeong-content";
import {
  TrackExamSubjectPage,
  trackExamSubjectMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getGamjeongSubject,
  getConcept: getGamjeongConcept,
  getExam: getGamjeongExam,
  getExamSessions: getGamjeongExamSessions,
  getLinkedExams: getGamjeongLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(GAMJEONG_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackExamSubjectMetadata(GAMJEONG_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackExamSubjectPage track={GAMJEONG_TRACK} api={api} subjectId={subject} />;
}
