const CHOICE_MARKERS = "①②③④⑤";
const ALL_ACCEPTED = /전\s*항\s*정답|전\s*원\s*정답/;
const MULTI_MARK = /복수\s*정답/;

function circleOrDigitToNo(token: string): number | null {
  const trimmed = token.trim();
  if (!trimmed) return null;
  const circle = CHOICE_MARKERS.indexOf(trimmed[0]);
  if (circle >= 0) return circle + 1;
  const n = Number(trimmed.replace(/[^0-9]/g, ""));
  return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null;
}

/** summary 안의 「복수정답: ②,⑤」 형태에서 번호를 뽑는다. */
function parseMultiFromSummary(summary: string): number[] {
  if (!MULTI_MARK.test(summary)) return [];
  const after = summary.split(/복수\s*정답/)[1] ?? "";
  const chunk = after.split(/[)）\n]/)[0] ?? after;
  const nos: number[] = [];
  for (const part of chunk.split(/[,，·\/\s]+/)) {
    const n = circleOrDigitToNo(part);
    if (n != null && !nos.includes(n)) nos.push(n);
  }
  if (nos.length === 0) {
    for (const ch of chunk) {
      const n = circleOrDigitToNo(ch);
      if (n != null && !nos.includes(n)) nos.push(n);
    }
  }
  return nos;
}

export type CorrectChoiceSource = {
  correctChoice?: string | number | (string | number)[] | null;
  correctChoices?: (string | number)[] | null;
  explanationSummary?: string | null;
};

/**
 * 문항의 정답 번호들. 복수정답·전항정답을 모두 포함한다.
 * 채점·표시는 이 함수 하나만 쓴다.
 */
export function getCorrectChoiceNos(source: CorrectChoiceSource): number[] {
  const summary =
    typeof source.explanationSummary === "string" ? source.explanationSummary : "";
  if (ALL_ACCEPTED.test(summary)) return [1, 2, 3, 4, 5];

  if (Array.isArray(source.correctChoices) && source.correctChoices.length > 0) {
    return source.correctChoices.map(Number).filter((n) => Number.isFinite(n));
  }

  if (Array.isArray(source.correctChoice)) {
    return source.correctChoice.map(Number).filter((n) => Number.isFinite(n));
  }

  const fromSummary = parseMultiFromSummary(summary);
  if (fromSummary.length > 0) return fromSummary;

  if (source.correctChoice != null && source.correctChoice !== "") {
    const n = Number(source.correctChoice);
    return Number.isFinite(n) ? [n] : [];
  }
  return [];
}

export function formatCorrectChoiceLabel(source: CorrectChoiceSource): string {
  const nos = getCorrectChoiceNos(source);
  if (nos.length === 0) return "";
  if (nos.length >= 5) return "전항정답";
  return nos.map((n) => CHOICE_MARKERS[n - 1] ?? String(n)).join("·");
}

export function isAcceptedChoice(
  source: CorrectChoiceSource,
  selected: string | number | null | undefined
): boolean {
  if (selected == null || selected === "") return false;
  const n = Number(selected);
  if (!Number.isFinite(n)) return false;
  return getCorrectChoiceNos(source).includes(n);
}
