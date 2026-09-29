import nodong1 from "@/data/nomusa/nodong1.json";
import nodong2 from "@/data/nomusa/nodong2.json";
import minbeop from "@/data/nomusa/minbeop.json";
import sahoeboheom from "@/data/nomusa/sahoeboheom.json";
import gyeongyeong from "@/data/nomusa/gyeongyeong.json";
import gyeongje from "@/data/nomusa/gyeongje.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

/** 1차 객관식만. 2차는 확정답안이 없어 웹 OX 트랙에 싣지 않는다. */
const contentBySubject = {
  nodong1,
  nodong2,
  minbeop,
  sahoeboheom,
  gyeongyeong,
  gyeongje,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const NOMUSA_SUBJECT_IDS = track.subjectIds;
export const getNomusaSubject = track.getSubject;
export const getNomusaConcept = track.getConcept;
export const getNomusaExam = track.getExam;
export const getNomusaExamSessions = track.getExamSessions;
export const getNomusaLinkedExams = track.getLinkedExams;
