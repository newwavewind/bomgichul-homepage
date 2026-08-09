import constitution from "@/data/police/constitution.json";
import criminalLaw from "@/data/police/criminal-law.json";
import policeScience from "@/data/police/police-science.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

const contentBySubject = {
  constitution,
  "criminal-law": criminalLaw,
  "police-science": policeScience,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const POLICE_SUBJECT_IDS = track.subjectIds;
export const getPoliceSubject = track.getSubject;
export const getPoliceConcept = track.getConcept;
export const getPoliceExam = track.getExam;
export const getPoliceExamSessions = track.getExamSessions;
export const getPoliceLinkedExams = track.getLinkedExams;
