import accounting from "@/data/housing/accounting.json";
import facilities from "@/data/housing/facilities.json";
import civilLaw from "@/data/housing/civil-law.json";
import housingLaw from "@/data/housing/housing-law.json";
import housingAdmin from "@/data/housing/housing-admin.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

const contentBySubject = {
  accounting,
  facilities,
  "civil-law": civilLaw,
  "housing-law": housingLaw,
  "housing-admin": housingAdmin,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const HOUSING_SUBJECT_IDS = track.subjectIds;
export const getHousingSubject = track.getSubject;
export const getHousingConcept = track.getConcept;
export const getHousingExam = track.getExam;
export const getHousingExamSessions = track.getExamSessions;
export const getHousingLinkedExams = track.getLinkedExams;
