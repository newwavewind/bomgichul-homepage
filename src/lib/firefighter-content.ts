import sobang from "@/data/firefighter/sobang.json";
import sobangbeop from "@/data/firefighter/sobangbeop.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

const contentBySubject = {
  sobang,
  sobangbeop,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const FIREFIGHTER_SUBJECT_IDS = track.subjectIds;
export const getFirefighterSubject = track.getSubject;
export const getFirefighterConcept = track.getConcept;
export const getFirefighterExam = track.getExam;
export const getFirefighterExamSessions = track.getExamSessions;
export const getFirefighterLinkedExams = track.getLinkedExams;
