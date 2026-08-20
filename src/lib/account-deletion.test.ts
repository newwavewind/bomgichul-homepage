import { describe, expect, it } from "vitest";
import {
  ACCOUNT_DELETION_CONFIRMATION,
  isSameOriginRequest,
  isValidAccountDeletionConfirmation,
} from "@/lib/account-deletion";

describe("account deletion safeguards", () => {
  it("requires the exact Korean confirmation phrase", () => {
    expect(isValidAccountDeletionConfirmation(ACCOUNT_DELETION_CONFIRMATION)).toBe(true);
    expect(isValidAccountDeletionConfirmation("탈퇴")).toBe(false);
    expect(isValidAccountDeletionConfirmation(null)).toBe(false);
  });

  it("accepts same-origin requests and rejects cross-origin requests", () => {
    const requestUrl = "https://www.bomgichul.com/api/account";
    expect(isSameOriginRequest(requestUrl, "https://www.bomgichul.com")).toBe(true);
    expect(isSameOriginRequest(requestUrl, "https://example.com")).toBe(false);
    expect(isSameOriginRequest(requestUrl, "not-a-url")).toBe(false);
  });
});
