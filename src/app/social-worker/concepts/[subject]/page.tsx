import type { Metadata } from "next";
import { SOCIAL_WORKER_TRACK } from "@/lib/exam-track/config";
import { getSocialWorkerSubject, getSocialWorkerConcept, getSocialWorkerExam, getSocialWorkerExamSessions, getSocialWorkerLinkedExams } from "@/lib/social-worker-content";
import {
  TrackConceptListPage,
  trackConceptListMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getSocialWorkerSubject,
  getConcept: getSocialWorkerConcept,
  getExam: getSocialWorkerExam,
  getExamSessions: getSocialWorkerExamSessions,
  getLinkedExams: getSocialWorkerLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackConceptListMetadata(SOCIAL_WORKER_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackConceptListPage track={SOCIAL_WORKER_TRACK} api={api} subjectId={subject} />;
}
