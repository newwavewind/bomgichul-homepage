import { describe, expect, it } from "vitest";
import { appendReturnTo, isValidReturnTo, parseConceptReturnTo } from "@/lib/return-to";

describe("isValidReturnTo", () => {
  it("accepts concept detail paths", () => {
    expect(isValidReturnTo("/concepts/civillaw/types-of-real-right-change")).toBe(true);
  });

  it("rejects external and arbitrary paths", () => {
    expect(isValidReturnTo("//evil.com")).toBe(false);
    expect(isValidReturnTo("/exam/civillaw/2025/41")).toBe(false);
    expect(isValidReturnTo(undefined)).toBe(false);
  });
});

describe("appendReturnTo", () => {
  it("appends encoded from query", () => {
    expect(
      appendReturnTo("/exam/civillaw/2025/41", "/concepts/civillaw/types-of-real-right-change")
    ).toBe("/exam/civillaw/2025/41?from=%2Fconcepts%2Fcivillaw%2Ftypes-of-real-right-change");
  });
});

describe("parseConceptReturnTo", () => {
  it("parses subject and slug", () => {
    expect(parseConceptReturnTo("/concepts/realestate-tax/property-tax-base-date")).toEqual({
      subject: "realestate-tax",
      slug: "property-tax-base-date",
    });
  });
});
