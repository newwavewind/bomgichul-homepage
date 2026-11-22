import { describe, expect, it, vi } from "vitest";
import { buildExamItemAiPrompt, openAiService } from "@/lib/ai-links";

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
  it("uses the selected exam, session and multiple answer numbers", () => {
    const prompt = buildExamItemAiPrompt({
      ...baseInput,
      examLabel: "공무원",
      sessionLabel: "국가직",
      correctChoice: "1·4",
    });
    expect(prompt).toContain("[공무원 기출]");
    expect(prompt).toContain("국가직");
    expect(prompt).toContain("①·④");
  });

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

describe("external AI services", () => {
  it("opens Perplexity with the selected question as its query", async () => {
    const open = vi.fn();
    vi.stubGlobal("window", { open });
    try {
      const prompt = "향교를 설명해 주세요.";
      const result = await openAiService("perplexity", prompt);
      expect(result).toMatchObject({ prefilled: true, copied: false });
      const destination = new URL(open.mock.calls[0][0]);
      expect(destination.origin).toBe("https://www.perplexity.ai");
      expect(destination.searchParams.get("q")).toBe(prompt);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("copies the question for Gemini and opens its browser chat", async () => {
    const open = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("window", { open });
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    try {
      const result = await openAiService("gemini", "향교와 서원의 차이를 설명해 주세요.");
      expect(result).toMatchObject({ prefilled: false, copied: true });
      expect(writeText).toHaveBeenCalledWith("향교와 서원의 차이를 설명해 주세요.");
      expect(open).toHaveBeenCalledWith("https://gemini.google.com/app", "_blank", "noopener,noreferrer");
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
