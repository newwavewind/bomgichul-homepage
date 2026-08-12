import { describe, expect, it } from "vitest";

import { toExamOxCombos } from "./combo-choices";

/*
 * 트랙 데이터의 comboChoices 모양이 셋이라, 하나라도 못 알아보면 그 문항은
 * 답을 넣을 수도 해설을 열 수도 없게 된다(지문이 선지 자리에 들어가고 그 키가
 * 숫자가 아니라 선택이 성립하지 않는다). 화면에서는 「그냥 안 눌리는 문제」로만
 * 보여 눈으로는 못 잡으므로 세 모양을 모두 여기서 센다.
 */

describe("toExamOxCombos", () => {
  it("공인중개사 모양(isCorrect)을 그대로 읽는다", () => {
    const combos = toExamOxCombos(
      [
        { no: 1, label: "①", text: "ㄱ, ㄴ", isCorrect: false },
        { no: 2, label: "②", text: "ㄱ, ㄷ", isCorrect: true },
      ],
      2,
    );
    expect(combos).toEqual([
      { no: 1, label: "①", text: "ㄱ, ㄴ", isCorrect: false, explanation: undefined },
      { no: 2, label: "②", text: "ㄱ, ㄷ", isCorrect: true, explanation: undefined },
    ]);
  });

  it("경찰 모양(is_correct)도 정답 표시를 살린다", () => {
    const combos = toExamOxCombos(
      [
        { no: 1, label: "①", text: "1개", is_correct: false },
        { no: 3, label: "③", text: "3개", is_correct: true },
      ],
      3,
    );
    expect(combos.map((c) => c.isCorrect)).toEqual([false, true]);
    expect(combos[1]).toMatchObject({ no: 3, label: "③", text: "3개" });
  });

  it("공무원 모양(문자열 배열)에 번호·기호·정답을 채운다", () => {
    const combos = toExamOxCombos(["ㄱ", "ㄹ", "ㄴ, ㄷ", "ㄴ, ㄹ"], 4);
    expect(combos).toHaveLength(4);
    expect(combos[0]).toEqual({ no: 1, label: "①", text: "ㄱ", isCorrect: false });
    expect(combos[3]).toEqual({ no: 4, label: "④", text: "ㄴ, ㄹ", isCorrect: true });
  });

  it("정답 표시가 없으면 정답 번호로 메운다", () => {
    const combos = toExamOxCombos([{ no: 1, label: "①", text: "1개" }, { no: 2, label: "②", text: "2개" }], 2);
    expect(combos.map((c) => c.isCorrect)).toEqual([false, true]);
  });

  it("선택지가 없거나 모양이 낯설면 빈 배열을 준다 — 지문이 선지 자리로 새지 않도록", () => {
    expect(toExamOxCombos(undefined, 1)).toEqual([]);
    expect(toExamOxCombos([], 1)).toEqual([]);
    expect(toExamOxCombos([null, "", { text: "  " }, 42], 1)).toEqual([]);
  });
});
