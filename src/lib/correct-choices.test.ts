import { describe, expect, it } from "vitest";
import {
  formatCorrectChoiceLabel,
  getCorrectChoiceNos,
  isAcceptedChoice,
} from "@/lib/correct-choices";

describe("getCorrectChoiceNos", () => {
  it("reads correctChoices array", () => {
    expect(getCorrectChoiceNos({ correctChoice: "2", correctChoices: [2, 5] })).toEqual([
      2, 5,
    ]);
  });

  it("parses 복수정답 from summary", () => {
    expect(
      getCorrectChoiceNos({
        correctChoice: "2",
        explanationSummary: "(복수정답: ②,⑤) 정답은 ②입니다.",
      })
    ).toEqual([2, 5]);
  });

  it("handles 전항정답", () => {
    expect(
      getCorrectChoiceNos({
        correctChoice: "1",
        explanationSummary: "이 문항은 출제 오류로 전항정답 처리되었다.",
      })
    ).toEqual([1, 2, 3, 4, 5]);
  });

  it("falls back to single correctChoice", () => {
    expect(getCorrectChoiceNos({ correctChoice: "3" })).toEqual([3]);
  });
});

describe("formatCorrectChoiceLabel", () => {
  it("joins multi answers", () => {
    expect(formatCorrectChoiceLabel({ correctChoices: [2, 5] })).toBe("②·⑤");
  });
});

describe("isAcceptedChoice", () => {
  it("accepts either multi answer", () => {
    const q = { correctChoices: [2, 5] };
    expect(isAcceptedChoice(q, 2)).toBe(true);
    expect(isAcceptedChoice(q, 5)).toBe(true);
    expect(isAcceptedChoice(q, 3)).toBe(false);
  });
});
