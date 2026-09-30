/**
 * 정답 번호 목록 — 기출 JSON 을 불러오지 않는 작은 모듈(화면 쪽에서 쓴다).
 *
 * 확정답안이 둘 이상을 정답으로 인정한 문항(복수정답·전항정답)은 correctChoices 에 번호를 모두 싣는다.
 * 앱 채점기(getCorrectChoiceNos)와 같게, 그 가운데 무엇을 골라도 정답이다.
 */
type AnswerKeySource = { correctChoice?: string | number | null; correctChoices?: number[] };

/**
 * 정답 번호를 글자로 — 복수정답·전항정답이면 「1,3」처럼 목록으로 적는다.
 * 목록 글자를 받는 화면은 matchesCorrectChoice 로 비교한다.
 */
export function answerKeyString(question: AnswerKeySource): string {
  return question.correctChoices?.length ? question.correctChoices.join(",") : String(question.correctChoice ?? "");
}

/** 고른 번호가 정답 목록(「3」 또는 「1,3」)에 드는지 */
export function matchesCorrectChoice(correct: string | undefined, value: string | number | undefined | null): boolean {
  if (value == null || value === "" || !correct) return false;
  return correct.split(",").map((part) => part.trim()).includes(String(value));
}
