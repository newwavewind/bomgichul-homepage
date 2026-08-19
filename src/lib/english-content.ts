import gong9 from "@/data/english/gong9.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

/**
 * 공무원 영어는 지금 9급 하나만 싣는다.
 *
 * 앱에 있는 구문 올인원과 기출 단어장은 옮기지 않았다. 둘 다 문항에 딸린
 * 해설이 아니라 그 자체로 한 권짜리 학습물이라, 웹에 반쪽만 올리면 어느
 * 쪽에서도 제구실을 못 한다. 웹에는 기출 학습만 둔다.
 */
const contentBySubject = {
  gong9,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const ENGLISH_SUBJECT_IDS = track.subjectIds;
export const getEnglishSubject = track.getSubject;
export const getEnglishConcept = track.getConcept;
export const getEnglishExam = track.getExam;
export const getEnglishExamSessions = track.getExamSessions;
export const getEnglishLinkedExams = track.getLinkedExams;
