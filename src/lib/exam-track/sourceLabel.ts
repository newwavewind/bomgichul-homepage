/**
 * 소방 앱은 출처(국가직·지방직)를 화면에 적지 않는다.
 * 데이터 칸 이름(sourceCode)은 URL·저장 키로 남기고, 보이는 글자만 가린다.
 * @see firebomgichul/src/subjects/examSourceLabel.js
 */
export function trackHidesExamSourceLabel(trackId: string): boolean {
  return trackId === "firefighter";
}

/** 「2026년 국가직 3번」→ 소방에서는 「2026년 3번」 */
export function formatExamRefLabel(
  trackId: string,
  year: number,
  sourceCode: string,
  questionNo?: number,
): string {
  const hide = trackHidesExamSourceLabel(trackId);
  if (questionNo != null) {
    return hide ? `${year}년 ${questionNo}번` : `${year}년 ${sourceCode} ${questionNo}번`;
  }
  return hide ? `${year}년` : `${year}년 ${sourceCode}`;
}
