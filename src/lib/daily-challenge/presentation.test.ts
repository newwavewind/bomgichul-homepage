import { describe, expect, it } from "vitest";
import { itemsRepeatComboChoices } from "@/lib/daily-challenge/presentation";

describe("itemsRepeatComboChoices", () => {
  it("detects public-service answer choices duplicated in items", () => {
    expect(
      itemsRepeatComboChoices(
        [
          { text: "ㄱ, ㄷ" },
          { text: "ㄴ, ㄹ" },
          { text: "ㄱ, ㄴ, ㄷ" },
          { text: "ㄱ, ㄴ, ㄹ" },
        ],
        ["ㄱ, ㄷ", "ㄴ, ㄹ", "ㄱ, ㄴ, ㄷ", "ㄱ, ㄴ, ㄹ"],
      ),
    ).toBe(true);
  });

  it("keeps real ㄱ~ㄹ prompt items above combination answers", () => {
    expect(
      itemsRepeatComboChoices(
        [
          { text: "검사의 신뢰도를 강조한다." },
          { text: "선발적 교육관에 바탕을 둔다." },
          { text: "검사점수의 부적편포를 기대한다." },
          { text: "평가 결과를 상대적인 서열과 관계없이 판단한다." },
        ],
        ["ㄱ, ㄴ", "ㄱ, ㄹ", "ㄴ, ㄷ", "ㄷ, ㄹ"],
      ),
    ).toBe(false);
  });

  it("keeps prompt items when combo answers use the police object shape", () => {
    expect(
      itemsRepeatComboChoices(
        [
          { text: "헌법재판소의 결정에 기속된다." },
          { text: "대법원의 판결에 기속된다." },
        ],
        [
          { no: 1, label: "①", text: "ㄱ" },
          { no: 2, label: "②", text: "ㄴ" },
        ],
      ),
    ).toBe(false);
  });

  it("does not suppress image prompt items", () => {
    expect(
      itemsRepeatComboChoices(
        [{ text: "A", image: "/figure.png" }, { text: "B" }],
        [{ text: "A" }, { text: "B" }],
      ),
    ).toBe(false);
  });
});
