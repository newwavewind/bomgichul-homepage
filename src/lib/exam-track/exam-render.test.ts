import { describe, expect, it } from "vitest";
import { examRenderKind, isRenderableExam } from "./exam-render";

describe("examRenderKind", () => {
  it("발문이 있는 객관식은 objective", () => {
    expect(examRenderKind({ stem: "옳은 것은?", items: [{}] })).toBe("objective");
  });

  it("발문과 빈칸 정답이 있는 주관식은 subjective", () => {
    expect(
      examRenderKind({
        kind: "subjective",
        prompt: "( )에 들어갈 용어를 쓰시오.",
        blanks: [{ label: "ㄱ", answer: "주택단지" }],
      }),
    ).toBe("subjective");
  });

  it("본문이 없는 빈 껍데기 레코드는 렌더 불가 — 500 대신 404·sitemap 제외", () => {
    expect(examRenderKind({ items: [] })).toBeNull();
    expect(examRenderKind({ stem: "   ", items: [] })).toBeNull();
    expect(isRenderableExam(undefined)).toBe(false);
  });

  it("주관식인데 빈칸 정답이 비어 있으면 렌더 불가", () => {
    expect(examRenderKind({ kind: "subjective", prompt: "쓰시오.", blanks: [] })).toBeNull();
    expect(
      examRenderKind({ kind: "subjective", prompt: "쓰시오.", blanks: [{ label: "ㄱ", answer: " " }] }),
    ).toBeNull();
  });
});
