export type ConceptTocItem = {
  id: string;
  label: string;
  title: string;
};

export function buildConceptDetailTocItems({
  hasPitfalls,
  hasExample,
  hasVisual,
  hasStatements,
  pitfallsIndex,
  exampleIndex,
}: {
  hasPitfalls: boolean;
  hasExample: boolean;
  hasVisual: boolean;
  hasStatements: boolean;
  pitfallsIndex?: number | null;
  exampleIndex?: number | null;
}): ConceptTocItem[] {
  const items: ConceptTocItem[] = [
    { id: "cx-sec-definition", label: "01", title: "개념 정리" },
    { id: "cx-sec-intuition", label: "02", title: "이해하기" },
    { id: "cx-sec-keypoints", label: "03", title: "핵심 포인트" },
  ];
  if (hasPitfalls) {
    items.push({
      id: "cx-sec-pitfalls",
      label: String(pitfallsIndex ?? 4).padStart(2, "0"),
      title: "시험 함정",
    });
  }
  if (hasExample) {
    items.push({
      id: "cx-sec-example",
      label: String(exampleIndex ?? 5).padStart(2, "0"),
      title: "한 줄 예시",
    });
  }
  if (hasVisual) {
    items.push({ id: "cx-sec-visual", label: "VISUAL", title: "VISUAL PLUS" });
  }
  if (hasStatements) {
    items.push({ id: "cx-sec-statements", label: "지문", title: "기출 지문" });
  }
  items.push({ id: "cx-sec-related", label: "기출", title: "관련 기출" });
  return items;
}
