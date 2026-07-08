import { describe, expect, it } from "vitest";
import { buildExamItemAiPrompt } from "@/lib/ai-links";

const baseInput = {
  subjectLabel: "부동산학개론",
  year: 2016,
  round: 27,
  questionNo: 34,
  category: "부동산개발 및 관리론",
  stem: "다음 중 옳은 것은?",
  correctChoice: "1",
  item: {
    key: "1",
    label: "①",
    text: "ㄱ: 제품, ㄴ: 판매촉진",
    answer: "O",
    explanation: "정답 해설입니다.",
  },
};

describe("buildExamItemAiPrompt", () => {
  it("includes the source metadata, stem, and choice text", () => {
    const prompt = buildExamItemAiPrompt(baseInput);
    expect(prompt).toContain("부동산학개론");
    expect(prompt).toContain("2016년");
    expect(prompt).toContain("제27회");
    expect(prompt).toContain("34번");
    expect(prompt).toContain(baseInput.stem);
    expect(prompt).toContain(baseInput.item.text);
  });

  it("marks the item as the correct choice when key matches correctChoice", () => {
    const prompt = buildExamItemAiPrompt(baseInput);
    expect(prompt).toContain("이 보기가 기출 정답입니다");
  });

  it("does not claim correctness when the item is not the correct choice", () => {
    const prompt = buildExamItemAiPrompt({
      ...baseInput,
      item: { ...baseInput.item, key: "2" },
    });
    expect(prompt).not.toContain("이 보기가 기출 정답입니다");
  });

  it("omits the explanation when includeExplanation is false", () => {
    const prompt = buildExamItemAiPrompt({ ...baseInput, includeExplanation: false });
    expect(prompt).not.toContain(baseInput.item.explanation);
  });

  it("includes the explanation by default", () => {
    const prompt = buildExamItemAiPrompt(baseInput);
    expect(prompt).toContain(baseInput.item.explanation);
  });

  it("caps the prompt length at 6000 characters", () => {
    const prompt = buildExamItemAiPrompt({
      ...baseInput,
      item: { ...baseInput.item, explanation: "가".repeat(10000) },
    });
    expect(prompt.length).toBeLessThanOrEqual(6000);
  });
});
