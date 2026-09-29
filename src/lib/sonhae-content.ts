import sangbeop from "@/data/sonhae/sangbeop.json";
import nongeoeop from "@/data/sonhae/nongeoeop.json";
import nonghak from "@/data/sonhae/nonghak.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

/** 1차 객관식만. 2차는 확정답안이 없어 웹 OX 트랙에 싣지 않는다. */
const contentBySubject = {
  sangbeop,
  nongeoeop,
  nonghak,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const SONHAE_SUBJECT_IDS = track.subjectIds;
export const getSonhaeSubject = track.getSubject;
export const getSonhaeConcept = track.getConcept;
export const getSonhaeExam = track.getExam;
export const getSonhaeExamSessions = track.getExamSessions;
export const getSonhaeLinkedExams = track.getLinkedExams;
