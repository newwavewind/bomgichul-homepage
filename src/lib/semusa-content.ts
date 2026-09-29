import jaejeonghak from "@/data/semusa/jaejeonghak.json";
import sebeopgaeron from "@/data/semusa/sebeopgaeron.json";
import hoegyegaeron from "@/data/semusa/hoegyegaeron.json";
import sangbeop from "@/data/semusa/sangbeop.json";
import minbeop from "@/data/semusa/minbeop.json";
import haengjeongsosong from "@/data/semusa/haengjeongsosong.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

/** 1차 객관식만. 2차 논술·계산은 확정답안이 없어 웹 OX 트랙에 싣지 않는다. */
const contentBySubject = {
  jaejeonghak,
  sebeopgaeron,
  hoegyegaeron,
  sangbeop,
  minbeop,
  haengjeongsosong,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const SEMUSA_SUBJECT_IDS = track.subjectIds;
export const getSemusaSubject = track.getSubject;
export const getSemusaConcept = track.getConcept;
export const getSemusaExam = track.getExam;
export const getSemusaExamSessions = track.getExamSessions;
export const getSemusaLinkedExams = track.getLinkedExams;
