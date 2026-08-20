import { describe, expect, it } from "vitest";
import {
  classifyVisitors,
  shouldTrackVisitPath,
  type VisitAggregateRow,
} from "./site-visits";

function row(overrides: Partial<VisitAggregateRow> = {}): VisitAggregateRow {
  return {
    visitor_id: "visitor-1",
    user_id: null,
    is_local: false,
    client_host: "www.bomgichul.com",
    client_ip: null,
    ip_hash: "network-a",
    path: "/real-estate",
    bot_class: "unknown",
    bot_confidence: 0,
    classification_reasons: [],
    verified_bot_name: null,
    user_agent: "Mozilla/5.0 Safari/537.36",
    engaged: false,
    engagement_ms: 0,
    interaction_count: 0,
    created_at: "2026-08-20T12:00:00.000Z",
    ...overrides,
  };
}

describe("visit classification", () => {
  it("keeps a verified search bot separate", () => {
    const result = classifyVisitors([
      row({ bot_class: "verified_bot", verified_bot_name: "Googlebot" }),
    ]).get("visitor-1");
    expect(result?.visitClass).toBe("verified_bot");
    expect(result?.reasons.join(" ")).toContain("Googlebot");
  });

  it("treats engagement as a human signal", () => {
    const result = classifyVisitors([
      row({ engaged: true, engagement_ms: 12_000, interaction_count: 2 }),
    ]).get("visitor-1");
    expect(result?.visitClass).toBe("likely_human");
  });

  it("flags many new cookies from one daily address hash", () => {
    const rows = Array.from({ length: 10 }, (_, index) =>
      row({ visitor_id: `visitor-${index}`, path: `/exam/civillaw/2025/${index + 1}` })
    );
    expect(classifyVisitors(rows).get("visitor-1")?.visitClass).toBe("suspected_bot");
  });

  it("does not track admin or API pages", () => {
    expect(shouldTrackVisitPath("/admin/visits")).toBe(false);
    expect(shouldTrackVisitPath("/api/analytics/visit")).toBe(false);
    expect(shouldTrackVisitPath("/public-service")).toBe(true);
  });
});
