import { describe, expect, it } from "vitest";
import {
  isPublicCommunityScopeVisible,
  isPublicExamPathVisible,
  isPublicExamVisible,
} from "@/lib/public-exam-visibility";

describe("public exam visibility", () => {
  it("keeps the history product public", () => {
    expect(isPublicExamVisible("history")).toBe(true);
    expect(isPublicExamPathVisible("/history/exam/simhwa")).toBe(true);
    expect(isPublicCommunityScopeVisible("history")).toBe(true);
  });

  it("keeps other products public", () => {
    expect(isPublicExamVisible("public-service")).toBe(true);
    expect(isPublicExamPathVisible("/public-service/daily")).toBe(true);
    expect(isPublicCommunityScopeVisible("public_service")).toBe(true);
  });
});
