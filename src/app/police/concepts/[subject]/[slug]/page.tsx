import type { Metadata } from "next";
import { POLICE_TRACK } from "@/lib/exam-track/config";
import { getPoliceSubject, getPoliceConcept, getPoliceExam, getPoliceExamSessions, getPoliceLinkedExams } from "@/lib/police-content";
import {
  TrackConceptDetailPage,
  trackConceptDetailMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getPoliceSubject,
  getConcept: getPoliceConcept,
  getExam: getPoliceExam,
  getExamSessions: getPoliceExamSessions,
  getLinkedExams: getPoliceLinkedExams,
};

type Props = { params: Promise<{ subject: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, slug } = await params;
  return trackConceptDetailMetadata(POLICE_TRACK, api, subject, slug);
}

export default async function Page({ params }: Props) {
  const { subject, slug } = await params;
  return <TrackConceptDetailPage track={POLICE_TRACK} api={api} subjectId={subject} slug={slug} />;
}
