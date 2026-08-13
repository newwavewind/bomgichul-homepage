import type { Metadata } from "next";
import { SOCIAL_WORKER_TRACK } from "@/lib/exam-track/config";
import { getSocialWorkerSubject, getSocialWorkerConcept, getSocialWorkerExam, getSocialWorkerExamSessions, getSocialWorkerLinkedExams } from "@/lib/social-worker-content";
import {
  TrackConceptDetailPage,
  trackConceptDetailMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getSocialWorkerSubject,
  getConcept: getSocialWorkerConcept,
  getExam: getSocialWorkerExam,
  getExamSessions: getSocialWorkerExamSessions,
  getLinkedExams: getSocialWorkerLinkedExams,
};

type Props = { params: Promise<{ subject: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, slug } = await params;
  return trackConceptDetailMetadata(SOCIAL_WORKER_TRACK, api, subject, slug);
}

export default async function Page({ params }: Props) {
  const { subject, slug } = await params;
  return <TrackConceptDetailPage track={SOCIAL_WORKER_TRACK} api={api} subjectId={subject} slug={slug} />;
}
