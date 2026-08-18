import simhwa from "@/data/history/simhwa.json";
import { createTrackContent } from "@/lib/exam-track/createTrackContent";
import type { ExamTrackSubjectContent } from "@/lib/exam-track/types";

/** 한국사능력검정은 급수가 곧 과목이다 — 지금은 심화 하나만 싣는다. */
const contentBySubject = {
  simhwa,
} as unknown as Record<string, ExamTrackSubjectContent>;

const track = createTrackContent(contentBySubject);

export const HISTORY_SUBJECT_IDS = track.subjectIds;
export const getHistorySubject = track.getSubject;
export const getHistoryConcept = track.getConcept;
export const getHistoryExam = track.getExam;
export const getHistoryExamSessions = track.getExamSessions;
export const getHistoryLinkedExams = track.getLinkedExams;

/** 회차별 핵심 개념 — 「핵심 개념 모아보기」 화면이 쓴다. */
export function getHistoryConceptCards(subjectId = "simhwa") {
  const data = track.getSubject(subjectId);
  if (!data) return [];
  return data.exams
    .filter((exam) => exam.concept)
    .map((exam) => ({
      examId: exam.id,
      round: exam.round ?? 0,
      sourceCode: exam.sourceCode,
      year: exam.year,
      questionNo: exam.questionNo,
      category: exam.category ?? "",
      subcategory: exam.subcategory ?? "",
      concept: exam.concept!,
    }))
    .sort((a, b) => b.round - a.round || a.questionNo - b.questionNo);
}

/** 모아보기 화면의 회차 탭 */
export function getHistoryRounds(subjectId = "simhwa") {
  const cards = getHistoryConceptCards(subjectId);
  const seen = new Map<number, { round: number; sourceCode: string; year: number; count: number }>();
  for (const card of cards) {
    const found = seen.get(card.round);
    if (found) found.count += 1;
    else seen.set(card.round, { round: card.round, sourceCode: card.sourceCode, year: card.year, count: 1 });
  }
  return [...seen.values()].sort((a, b) => b.round - a.round);
}
