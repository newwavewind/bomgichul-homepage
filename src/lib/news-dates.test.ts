import { describe, expect, it } from "vitest";
import {
  formatNewsDateLabel,
  getAdjacentNewsDates,
} from "@/lib/news-dates";

describe("formatNewsDateLabel", () => {
  it("formats date with month, day, and weekday", () => {
    expect(formatNewsDateLabel("2026-07-08")).toBe("7월 8일 (수)");
  });
});

describe("getAdjacentNewsDates", () => {
  const dates = ["2026-07-08", "2026-07-07", "2026-07-06"];

  it("returns older day as prev and newer day as next", () => {
    expect(getAdjacentNewsDates(dates, "2026-07-07")).toEqual({
      prev: "2026-07-06",
      next: "2026-07-08",
    });
  });

  it("returns null next on the newest day", () => {
    expect(getAdjacentNewsDates(dates, "2026-07-08")).toEqual({
      prev: "2026-07-07",
      next: null,
    });
  });

  it("returns null prev on the oldest day", () => {
    expect(getAdjacentNewsDates(dates, "2026-07-06")).toEqual({
      prev: null,
      next: "2026-07-07",
    });
  });
});
