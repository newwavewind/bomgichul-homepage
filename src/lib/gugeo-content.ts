import gugeo from "@/data/gugeo/gugeo.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

const contentBySubject = {
  gugeo,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const GUGEO_SUBJECT_IDS = track.subjectIds;
export const getGugeoSubject = track.getSubject;
export const getGugeoConcept = track.getConcept;
export const getGugeoExam = track.getExam;
export const getGugeoExamSessions = track.getExamSessions;
export const getGugeoLinkedExams = track.getLinkedExams;
