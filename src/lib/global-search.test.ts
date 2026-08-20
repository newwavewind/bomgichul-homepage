import { describe, expect, it } from "vitest";
import { searchAllQuestions } from "./global-search";

describe("global question search", () => {
  it("understands a two digit year and question number", () => {
    const results = searchAllQuestions("민법 25년 49번");
    expect(results.some((item) => item.title.includes("2025년") && item.title.includes("49번"))).toBe(true);
  });
});
