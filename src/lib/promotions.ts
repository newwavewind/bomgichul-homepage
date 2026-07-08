import type { ExamSubject } from "@/lib/exam-questions";
import { isSubjectFullyFree } from "@/lib/premium";

export interface SubjectFreeEvent {
  badge: string;
  title: string;
  description: string;
}

/** 한시적 무료 이벤트 과목 (전 연도 free와 함께 사용) */
const FREE_EVENTS: Partial<Record<ExamSubject, SubjectFreeEvent>> = {
  realestate: {
    badge: "봄기출 출시 이벤트",
    title: "부동산학개론 전 기능 한시 무료",
    description:
      "2016~2025년 전 연도 기출·해설, 랜덤 연습, AI 해설 질문까지 로그인 없이 무료로 이용할 수 있어요. 이벤트는 별도 공지 시 종료됩니다.",
  },
};

export function getSubjectFreeEvent(subject: ExamSubject): SubjectFreeEvent | null {
  return FREE_EVENTS[subject] ?? null;
}

export function isSubjectFreeEventActive(subject: ExamSubject): boolean {
  return Boolean(getSubjectFreeEvent(subject)) && isSubjectFullyFree(subject);
}
