import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { getPublicServiceExam } from "@/lib/public-service-content";
import { getPublicServiceOriginalPaper } from "@/lib/public-service-original-papers";
import { getDailyPool } from "@/lib/daily-challenge/pool";
import { PublicServiceQuestion } from "./PublicServiceQuestion";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ usePathname: () => "/public-service/exam/hangjunghak/2026/국가직/1" }));
vi.mock("@/lib/client-session", () => ({
  useMe: () => ({ pending: false, user: null }),
  fetchMe: vi.fn(),
}));
beforeAll(() => vi.stubGlobal("React", React));
afterAll(() => vi.unstubAllGlobals());

describe("public service exam layout", () => {
  it("renders the numbered choices only once when the prompt is already in the stem", () => {
    const exam = getPublicServiceExam("hangjunghak", 2026, "국가직", 1)!;
    expect(exam.stem).toContain("POSDCoRB");
    const html = renderToStaticMarkup(React.createElement(PublicServiceQuestion, { exam }));
    expect(html).not.toContain("<fieldset");
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(4);
  });

  it("keeps the original accounting columns inside four separately selectable answers", () => {
    const exam = getPublicServiceExam("hoegyehak", 2026, "국가직", 1)!;
    const paper = getPublicServiceOriginalPaper(exam.id)!;
    const html = renderToStaticMarkup(React.createElement(PublicServiceQuestion, { exam, originalChoices: paper, originalPromptRendered: true }));
    expect(html).toContain(paper.header!.src);
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(4);
    for (const image of paper.rows!) expect(html).toContain(image.src);
    expect(html).not.toContain("/_next/image");
  });

  it("uses the same paper and choices in daily practice without changing the answer", () => {
    const item = getDailyPool("public-service").find((entry) => entry.id === "public-service:hoegyehak:2026:국가직:1")!;
    const paper = getPublicServiceOriginalPaper("회계학-2026-국가직-Q1")!;
    const exam = getPublicServiceExam("hoegyehak", 2026, "국가직", 1)!;
    expect(item.presentation.material?.image).toBe(paper.prompt?.src);
    expect(item.presentation.originalChoiceHeader).toEqual(paper.header);
    expect(item.choices.map((choice) => choice.originalImage)).toEqual(paper.rows);
    expect(item.correctKeys).toEqual([String(exam.correctChoice)]);
  });
});
