import sobang from "@/data/firefighter/sobang.json";
import sobangbeop from "@/data/firefighter/sobangbeop.json";
/** 행정법총론은 공무원 트랙과 동일 원본 — 소방 앱과 같이 세 과목을 모두 연다. */
import haengjeongbeop from "@/data/public-service/haengjeongbeop.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

const contentBySubject = {
  sobang,
  sobangbeop,
  haengjeongbeop,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const FIREFIGHTER_SUBJECT_IDS = track.subjectIds;
export const getFirefighterSubject = track.getSubject;
export const getFirefighterConcept = track.getConcept;
export const getFirefighterExam = track.getExam;
export const getFirefighterExamSessions = track.getExamSessions;
export const getFirefighterLinkedExams = track.getLinkedExams;
