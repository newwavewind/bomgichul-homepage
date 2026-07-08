import { describe, expect, it } from "vitest";
import { PRODUCT_TYPE_BY_SUBJECT, subjectFromProductType } from "@/lib/premium-subjects";

describe("subjectFromProductType", () => {
  it("round-trips every subject through its product type", () => {
    for (const [subject, productType] of Object.entries(PRODUCT_TYPE_BY_SUBJECT)) {
      expect(subjectFromProductType(productType)).toBe(subject);
    }
  });

  it("returns null for an unknown product type", () => {
    expect(subjectFromProductType("not_a_real_product")).toBeNull();
  });
});
