import type { ExamSubject } from "@/lib/exam-questions";

/**
 * ox-quiz-app(모바일 앱)의 인앱결제 productId. PC 학습 코드 발급/등록이
 * 이 productId 문자열을 그대로 product_type으로 사용하므로 여기서도 동일하게 맞춘다.
 * (ox-quiz-app/src/subjects/registry.js, src/lib/pcAccessCodes.js 참고)
 *
 * 서버 전용 모듈(@/lib/supabase/server)에 의존하지 않는 순수 매핑이라
 * 클라이언트 컴포넌트에서도 안전하게 import할 수 있다.
 */
export const PRODUCT_TYPE_BY_SUBJECT: Record<ExamSubject, string> = {
  civillaw: "premium_unlock",
  realestate: "premium_unlock_realestate",
  "broker-law": "premium_unlock_agency",
  "registry-law": "premium_unlock_registration",
  "realestate-tax": "premium_unlock_tax",
  "realestate-public-law": "premium_unlock_publiclaw",
};

const SUBJECT_BY_PRODUCT_TYPE: Record<string, ExamSubject> = Object.fromEntries(
  Object.entries(PRODUCT_TYPE_BY_SUBJECT).map(([subject, productType]) => [
    productType,
    subject as ExamSubject,
  ])
);

export function subjectFromProductType(productType: string): ExamSubject | null {
  return SUBJECT_BY_PRODUCT_TYPE[productType] ?? null;
}
