import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import english from "@/data/english/gong9.json";
import type { ExamTrackExam } from "@/lib/exam-track/types";
import { TrackPracticeQuestion } from "./TrackPracticeQuestion";

vi.mock("next/navigation", () => ({ usePathname: () => "/english/exam/gong9" }));
vi.mock("@/lib/client-session", () => ({
  useMe: () => ({ pending: false, user: null }),
  fetchMe: vi.fn(),
}));
// Next supplies the automatic JSX runtime; Vitest also renders imported TSX here.
beforeAll(() => vi.stubGlobal("React", React));
afterAll(() => vi.unstubAllGlobals());

function render(exam: ExamTrackExam) {
  return renderToStaticMarkup(React.createElement(TrackPracticeQuestion, {
    exam, loginNext: "/english/exam/gong9", initialAttemptResult: null, onAttempt: () => {},
  }));
}

describe("practice question materials", () => {
  it("renders the original recycling passage image before the choices for English 2026 national Q7", () => {
    const exam = english.exams.find((q) => q.year === 2026 && q.sourceCode === "국가직" && q.questionNo === 7)!;
    const html = render(exam as ExamTrackExam);
    expect(html).toContain("national-2026-q6.webp");
    expect(html).toContain("7번 문항 자료 크게 보기");
    expect(html.indexOf("<figure")).toBeLessThan(html.indexOf("web-question-choices"));
    for (const item of exam.items) expect(html).toContain(item.text);
  });

  it("renders table cells, the following prompt, and choice column headings", () => {
    const html = render({
      id: "table", year: 2026, sourceCode: "test", questionNo: 1,
      stem: "다음 자료를 보고 계산하시오.", stemTail: "기말 금액으로 옳은 것은?",
      table: { headers: ["구분", "금액"], rows: [["기초", "1,000"]] },
      choiceHeaders: ["차변", "대변"], correctChoice: 1,
      items: [{ key: "1", label: "①", text: "100/200" }, { key: "2", label: "②", text: "300/400" }],
    });
    expect(html).toContain("<table");
    for (const text of ["기초", "1,000", "기말 금액으로 옳은 것은?", "차변", "대변"]) expect(html).toContain(text);
  });

  it("keeps compound statements in the passage and renders numeric answer combinations", () => {
    const html = render({
      id: "combo", year: 2026, sourceCode: "test", questionNo: 2,
      stem: "옳은 것을 모두 고른 것은?", correctChoice: 2,
      items: [{ key: "ㄱ", label: "ㄱ", text: "첫 번째 진술" }, { key: "ㄴ", label: "ㄴ", text: "두 번째 진술" }],
      comboChoices: ["ㄱ", "ㄱ, ㄴ"],
    });
    expect(html).toContain("<fieldset");
    expect(html).toContain("첫 번째 진술");
    expect(html).toContain("두 번째 진술");
    expect(html).toContain("ㄱ, ㄴ");
    expect(html).toContain("②");
  });
});
