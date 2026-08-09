/** 학습 본문은 마크다운 강조 없이 원문을 일반 텍스트로 표시한다. */
export function plainStudyText(text: string): string {
  return text.replace(/\*+/g, "");
}
