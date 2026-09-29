import minbeop from "@/data/haengjeongsa/minbeop.json";
import haengjeongbeop from "@/data/haengjeongsa/haengjeongbeop.json";
import haengjeonghak from "@/data/haengjeongsa/haengjeonghak.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

/** 1차 객관식만. 2차 주관식은 확정답안이 없어 웹 OX 트랙에 싣지 않는다. */
const contentBySubject = {
  minbeop,
  haengjeongbeop,
  haengjeonghak,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const HAENGJEONGSA_SUBJECT_IDS = track.subjectIds;
export const getHaengjeongsaSubject = track.getSubject;
export const getHaengjeongsaConcept = track.getConcept;
export const getHaengjeongsaExam = track.getExam;
export const getHaengjeongsaExamSessions = track.getExamSessions;
export const getHaengjeongsaLinkedExams = track.getLinkedExams;
