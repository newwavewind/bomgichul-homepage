import type { Metadata } from "next";
import { SOCIAL_WORKER_TRACK } from "@/lib/exam-track/config";
import { SOCIAL_WORKER_SUBJECT_IDS, getSocialWorkerSubject, getSocialWorkerConcept, getSocialWorkerExam, getSocialWorkerExamSessions, getSocialWorkerLinkedExams } from "@/lib/social-worker-content";
import {
  TrackExamSubjectPage,
  trackExamSubjectMetadata,
  trackSubjectStaticParams,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getSocialWorkerSubject,
  getConcept: getSocialWorkerConcept,
  getExam: getSocialWorkerExam,
  getExamSessions: getSocialWorkerExamSessions,
  getLinkedExams: getSocialWorkerLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

// 과목은 소수라 전부 미리 만들어 정적으로 캐시한다.
export function generateStaticParams() {
  return trackSubjectStaticParams(SOCIAL_WORKER_SUBJECT_IDS);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackExamSubjectMetadata(SOCIAL_WORKER_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackExamSubjectPage track={SOCIAL_WORKER_TRACK} api={api} subjectId={subject} />;
}
