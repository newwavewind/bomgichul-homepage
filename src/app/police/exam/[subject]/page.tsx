import type { Metadata } from "next";
import { POLICE_TRACK } from "@/lib/exam-track/config";
import { getPoliceSubject, getPoliceConcept, getPoliceExam, getPoliceExamSessions, getPoliceLinkedExams } from "@/lib/police-content";
import {
  TrackExamSubjectPage,
  trackExamSubjectMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getPoliceSubject,
  getConcept: getPoliceConcept,
  getExam: getPoliceExam,
  getExamSessions: getPoliceExamSessions,
  getLinkedExams: getPoliceLinkedExams,
};

type Props = { params: Promise<{ subject: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return trackExamSubjectMetadata(POLICE_TRACK, api, subject);
}

export default async function Page({ params }: Props) {
  const { subject } = await params;
  return <TrackExamSubjectPage track={POLICE_TRACK} api={api} subjectId={subject} />;
}
