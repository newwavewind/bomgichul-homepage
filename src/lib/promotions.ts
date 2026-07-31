import type { ExamSubject } from "@/lib/exam-questions";
import { isSubjectFullyFree } from "@/lib/premium";

export interface SubjectFreeEvent {
  badge: string;
  title: string;
  description: string;
}

/** 한시적 무료 이벤트 과목 (전 연도 free와 함께 사용) */
const FREE_EVENTS: Partial<Record<ExamSubject, SubjectFreeEvent>> = {
  // 2026년 7월 부동산학개론 출시 이벤트 종료 (2026-08-01~)
};

export function getSubjectFreeEvent(subject: ExamSubject): SubjectFreeEvent | null {
  return FREE_EVENTS[subject] ?? null;
}

export function isSubjectFreeEventActive(subject: ExamSubject): boolean {
  return Boolean(getSubjectFreeEvent(subject)) && isSubjectFullyFree(subject);
}
