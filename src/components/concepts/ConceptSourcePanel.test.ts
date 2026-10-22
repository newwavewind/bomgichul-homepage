import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { ConceptSourcePanel, type ConceptSource } from "./ConceptSourcePanel";

beforeAll(() => vi.stubGlobal("React", React));
afterAll(() => vi.unstubAllGlobals());

function render(sources: ConceptSource[]) {
  return renderToStaticMarkup(React.createElement(ConceptSourcePanel, { sources }));
}

describe("concept source review dates", () => {
  it("keeps judgment dates in the citation without treating them as review dates", () => {
    const html = render([{
      type: "case",
      name: "대법원 2006. 12. 7. 선고 2004다29736 판결",
      verifiedAt: "2026-08-10",
    }]);
    expect(html).toContain("대법원 2006. 12. 7. 선고 2004다29736 판결");
    expect(html).toContain("표시된 콘텐츠 검수 기준일: 2026-08-10</p>");
  });

  it("does not infer a review date from amendment or authored-content titles", () => {
    const html = render([
      "사회복지사 윤리강령(제5차 개정 2023.4.12)",
      { type: "authored", title: "학습 콘텐츠 (2026-07-16 전면 개편)" },
    ]);
    expect(html).toContain("2023.4.12");
    expect(html).toContain("2026-07-16 전면 개편");
    expect(html).not.toContain("표시된 콘텐츠 검수 기준일");
  });

  it("deduplicates explicit review dates and ignores empty values", () => {
    const html = render([
      { title: "출처 1", verifiedAt: "2026-08-10" },
      { title: "출처 2", verifiedAt: " 2026-08-10 " },
      { title: "출처 3", verifiedAt: " " },
      { title: "출처 4", verifiedAt: "2026-08-11" },
    ]);
    expect(html).toContain("표시된 콘텐츠 검수 기준일: 2026-08-10, 2026-08-11</p>");
  });
});
