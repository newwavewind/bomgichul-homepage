import type { ExamOxCombo } from "@/components/exam/ExamOxQuestion";

/**
 * 「모두 몇 개인가」·「옳은 것을 모두 고르면」 유형의 선택지를 화면 부품이 쓰는 한 모양으로 맞춘다.
 *
 * 트랙마다 데이터를 만든 시기가 달라 모양이 셋이다.
 *  - 공인중개사: `[{ no, label, text, isCorrect }]`   ← 부품이 기대하는 기준 모양
 *  - 경찰:       `[{ no, label, text, is_correct }]`  ← 밑줄 표기
 *  - 공무원:     `["ㄱ", "ㄹ", "ㄴ, ㄷ", "ㄴ, ㄹ"]`      ← 글만 있고 번호·정답 표시가 없다
 *
 * 모양이 다르다고 화면에서 빼 버리면 지문(㉠~㉤)이 그대로 「고르는 선지」로 그려지고,
 * 그 키(`㉠`)는 숫자가 아니라 선택 자체가 성립하지 않는다 — 답도 못 넣고 해설도 못 연다.
 * 그래서 읽는 쪽에서 맞춰 준다.
 *
 * @param raw 트랙 데이터의 comboChoices
 * @param correctChoice 정답 번호. 데이터에 정답 표시가 없는 모양(문자열)에서 이것으로 채운다.
 */
export function toExamOxCombos(raw: unknown, correctChoice?: number): ExamOxCombo[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((entry, index): ExamOxCombo[] => {
    const no = index + 1;

    if (typeof entry === "string") {
      const text = entry.trim();
      if (!text) return [];
      return [{ no, label: circledLabel(no), text, isCorrect: correctChoice === no }];
    }

    if (!entry || typeof entry !== "object") return [];
    const source = entry as Record<string, unknown>;
    const text = typeof source.text === "string" ? source.text.trim() : "";
    if (!text) return [];

    const choiceNo = typeof source.no === "number" ? source.no : no;
    const explicit = typeof source.isCorrect === "boolean"
      ? source.isCorrect
      : typeof source.is_correct === "boolean"
        ? source.is_correct
        : undefined;

    return [{
      no: choiceNo,
      label: typeof source.label === "string" && source.label ? source.label : circledLabel(choiceNo),
      text,
      isCorrect: explicit ?? correctChoice === choiceNo,
      explanation: typeof source.explanation === "string" ? source.explanation : undefined,
    }];
  });
}

const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

function circledLabel(no: number) {
  return CIRCLED[no - 1] ?? String(no);
}
