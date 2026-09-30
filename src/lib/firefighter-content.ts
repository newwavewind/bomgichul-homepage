import sobang from "@/data/firefighter/sobang.json";
import sobangbeop from "@/data/firefighter/sobangbeop.json";
/**
 * 행정법총론은 소방 앱의 소방공무원 공채 행정법총론이다(2018~2026, 소방청 출제).
 * 예전에는 공무원 트랙의 국가직 9급 행정법을 국가직 회차만 걸러 보여 줬는데, 소방공무원
 * 시험과 문항이 다르다 — scripts/sync-app-explanations.mjs 가 소방 앱에서 싣는다.
 */
import haengjeongbeop from "@/data/firefighter/haengjeongbeop.json";
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
