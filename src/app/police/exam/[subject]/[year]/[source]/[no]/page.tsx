import type { Metadata } from "next";
import { POLICE_TRACK } from "@/lib/exam-track/config";
import { getPoliceSubject, getPoliceConcept, getPoliceExam, getPoliceExamSessions, getPoliceLinkedExams } from "@/lib/police-content";
import {
  TrackExamDetailPage,
  trackExamDetailMetadata,
} from "@/lib/exam-track/pages";

const api = {
  getSubject: getPoliceSubject,
  getConcept: getPoliceConcept,
  getExam: getPoliceExam,
  getExamSessions: getPoliceExamSessions,
  getLinkedExams: getPoliceLinkedExams,
};

type Props = { params: Promise<{ subject: string; year: string; source: string; no: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  return trackExamDetailMetadata(POLICE_TRACK, api, subject, year, source, no);
}

export default async function Page({ params }: Props) {
  const { subject, year, source: encodedSource, no } = await params;
  const source = decodeURIComponent(encodedSource);
  return (
    <TrackExamDetailPage
      track={POLICE_TRACK}
      api={api}
      subjectId={subject}
      year={year}
      source={source}
      no={no}
    />
  );
}
