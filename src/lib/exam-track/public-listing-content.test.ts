import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { hasPublicListingContent } from "@/lib/exam-track/public-listing-content";

vi.mock("@/lib/supabase/public", () => ({ createPublicClient: vi.fn() }));
vi.mock("@/lib/supabase/env", () => ({ isSupabaseConfigured: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(isSupabaseConfigured).mockReturnValue(true);
});

function mockResult(data: { id: string }[] | null, error: object | null) {
  const query = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    then: (resolve: (value: unknown) => unknown) => Promise.resolve({ data, error }).then(resolve),
  };
  vi.mocked(createPublicClient).mockReturnValue({ from: vi.fn().mockReturnValue(query) } as unknown as ReturnType<typeof createPublicClient>);
  return query;
}

describe("public listing content availability", () => {
  it("uses only a successful empty response as evidence of an empty list", async () => {
    mockResult([], null);
    expect(await hasPublicListingContent("police", "community")).toBe(false);
    mockResult([{ id: "public-post" }], null);
    expect(await hasPublicListingContent("police", "community")).toBe(true);
  });

  it("queries the selected exam and only resources for an archive", async () => {
    const query = mockResult([], null);
    await hasPublicListingContent("housing", "archive");
    expect(query.eq).toHaveBeenCalledWith("community_scope", "housing");
    expect(query.eq).toHaveBeenCalledWith("category", "resource");
    expect(query.limit).toHaveBeenCalledWith(1);
  });

  it("keeps errors, missing data, exceptions and absent configuration unknown", async () => {
    mockResult([], { message: "temporarily unavailable" });
    expect(await hasPublicListingContent("police", "community")).toBeNull();
    mockResult(null, null);
    expect(await hasPublicListingContent("police", "community")).toBeNull();
    vi.mocked(createPublicClient).mockImplementation(() => { throw new Error("offline"); });
    expect(await hasPublicListingContent("police", "community")).toBeNull();
    vi.mocked(isSupabaseConfigured).mockReturnValue(false);
    expect(await hasPublicListingContent("police", "community")).toBeNull();
  });
});
