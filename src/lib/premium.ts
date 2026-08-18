import { PRODUCT_TYPE_BY_SUBJECT } from "@/lib/premium-subjects";
import { getExamQuestionsForSubject, type ExamSubject } from "@/lib/exam-questions";

/** 과목 전체가 무료 공개인지 (프로모션 배너 판단용) */
export function isSubjectFullyFree(subject: ExamSubject): boolean {
  const questions = getExamQuestionsForSubject(subject);
  if (questions.length === 0) return false;
  return questions.every((q) => q.free);
}

/**
 * 홈페이지는 전 과목·전 기능이 무료다.
 *
 * 돈을 받는 곳은 PC앱(app.bomgichul.com — 별도 저장소 `ox-quiz-app` 배포)과 모바일 앱뿐이고,
 * 이 홈페이지에는 잠글 것이 없다. 그래서 아래 두 함수는 언제나 「전부 열림」을 돌려준다.
 *
 * 함수를 지우지 않고 남긴 이유 — 부르는 쪽을 모두 정리했더라도, 나중에 「이 과목 열려
 * 있나」를 물어야 할 자리가 생기면 여기 한 곳만 고치면 되게 하려는 것이다.
 * 앱 구매자의 권한 기록(`user_entitlements`)은 관리자 화면이 그대로 읽고 있어 손대지 않았다.
 */
const ALL_SUBJECTS = Object.keys(PRODUCT_TYPE_BY_SUBJECT) as ExamSubject[];

export async function getUnlockedSubjects(): Promise<Set<ExamSubject>> {
  return new Set(ALL_SUBJECTS);
}

export async function isSubjectUnlocked(): Promise<boolean> {
  return true;
}
