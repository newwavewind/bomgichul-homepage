import type { Metadata } from "next";
import { SOCIAL_WORKER_TRACK } from "@/lib/exam-track/config";
import { getSocialWorkerSubject, getSocialWorkerConcept, getSocialWorkerExam, getSocialWorkerExamSessions, getSocialWorkerLinkedExams } from "@/lib/social-worker-content";
import {
  TrackExamSessionPage,
  trackExamSessionMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getSocialWorkerSubject,
  getConcept: getSocialWorkerConcept,
  getExam: getSocialWorkerExam,
  getExamSessions: getSocialWorkerExamSessions,
  getLinkedExams: getSocialWorkerLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamSessionMetadata(SOCIAL_WORKER_TRACK, api, subject, year, source);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamSessionPage
      track={SOCIAL_WORKER_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
    />
  );
}
