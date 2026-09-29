import sanbeop from "@/data/sanan/sanbeop.json";
import sanil from "@/data/sanan/sanil.json";
import gieop from "@/data/sanan/gieop.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

/** 1차 객관식만. 2차는 확정답안이 없어 웹 OX 트랙에 싣지 않는다. */
const contentBySubject = {
  sanbeop,
  sanil,
  gieop,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const SANAN_SUBJECT_IDS = track.subjectIds;
export const getSananSubject = track.getSubject;
export const getSananConcept = track.getConcept;
export const getSananExam = track.getExam;
export const getSananExamSessions = track.getExamSessions;
export const getSananLinkedExams = track.getLinkedExams;
