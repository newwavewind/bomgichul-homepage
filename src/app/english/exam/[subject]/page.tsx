import type { Metadata } from "next";
import { ENGLISH_TRACK } from "@/lib/exam-track/config";
import { getEnglishSubject, getEnglishConcept, getEnglishExam, getEnglishExamSessions, getEnglishLinkedExams } from "@/lib/english-content";
import {
  TrackExamSubjectPage,
  trackExamSubjectMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getEnglishSubject,
  getConcept: getEnglishConcept,
  getExam: getEnglishExam,
  getExamSessions: getEnglishExamSessions,
  getLinkedExams: getEnglishLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackExamSubjectMetadata(ENGLISH_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackExamSubjectPage track={ENGLISH_TRACK} api={api} subjectId={subject} />;
}
