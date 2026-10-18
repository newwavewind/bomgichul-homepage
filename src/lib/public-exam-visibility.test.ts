import { describe, expect, it } from "vitest";
import {
  isPublicCommunityScopeVisible,
  isPublicExamPathVisible,
  isPublicExamVisible,
} from "@/lib/public-exam-visibility";

describe("public exam visibility", () => {
  it("temporarily hides the history product", () => {
    expect(isPublicExamVisible("history")).toBe(false);
    expect(isPublicExamPathVisible("/history/exam/simhwa")).toBe(false);
    expect(isPublicCommunityScopeVisible("history")).toBe(false);
  });

  it("keeps other products public", () => {
    expect(isPublicExamVisible("public-service")).toBe(true);
    expect(isPublicExamPathVisible("/public-service/daily")).toBe(true);
    expect(isPublicCommunityScopeVisible("public_service")).toBe(true);
  });
});
