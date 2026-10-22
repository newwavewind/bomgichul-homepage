import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildCommunityListMetadata } from "@/lib/exam-track/community-seo";
import { buildArchiveListMetadata } from "@/lib/exam-track/archive-seo";
import { hasPublicListingContent } from "@/lib/exam-track/public-listing-content";

vi.mock("@/lib/exam-track/public-listing-content", () => ({
  hasPublicListingContent: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(hasPublicListingContent).mockReset().mockResolvedValue(true);
});

describe("community list metadata", () => {
  it("creates unique, self-canonical metadata for category filters across exam tracks", async () => {
    const metadata = await buildCommunityListMetadata({
      searchParams: Promise.resolve({ category: "info" }),
      scope: "social_worker",
    });

    expect(metadata.openGraph?.title).toBe(
      "수험정보 | 사회복지사 1급 수험생 커뮤니티 | 봄기출",
    );
    expect(metadata.description).toContain("수험정보 게시판");
    expect(metadata.alternates?.canonical).toBe(
      "/social-worker/community?category=info",
    );
  });

  it("keeps page metadata unique and excludes duplicate-producing query variants", async () => {
    const paged = await buildCommunityListMetadata({
      searchParams: Promise.resolve({ category: "question", page: "2" }),
      scope: "history",
    });
    const sorted = await buildCommunityListMetadata({
      searchParams: Promise.resolve({ category: "question", sort: "views" }),
      scope: "english",
    });

    expect(paged.openGraph?.title).toContain("2페이지");
    expect(paged.description).toContain("현재 2페이지");
    expect(sorted.robots).toMatchObject({ index: false, follow: true });
  });

  it("does not index app-only filters", async () => {
    const metadata = await buildCommunityListMetadata({
      searchParams: Promise.resolve({ category: "feedback" }),
      scope: "public_service",
    });

    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });

  it.each([
    "real_estate", "public_service", "police", "firefighter", "housing", "social_worker",
    "history", "english", "gugeo", "haengjeongsa", "semusa", "sanan", "sonhae", "nomusa",
    "gyeongbi", "gamjeong", "mullyu", "youth",
  ] as const)(
    "does not index confirmed empty %s lists, without changing their canonical URLs",
    async (scope) => {
      vi.mocked(hasPublicListingContent).mockResolvedValue(false);
      const community = await buildCommunityListMetadata({ searchParams: Promise.resolve({}), scope });
      const archive = await buildArchiveListMetadata({ searchParams: Promise.resolve({}), scope, description: "자료실" });
      expect(community.robots).toMatchObject({ index: false, follow: true });
      expect(archive.robots).toMatchObject({ index: false, follow: true });
      expect(community.alternates?.canonical).toBeTruthy();
      expect(archive.alternates?.canonical).toBeTruthy();
    },
  );

  it.each([true, null])("preserves indexing when content exists or lookup is unknown (%s)", async (result) => {
    vi.mocked(hasPublicListingContent).mockResolvedValue(result);
    const community = await buildCommunityListMetadata({ searchParams: Promise.resolve({}), scope: "public_service" });
    const archive = await buildArchiveListMetadata({ searchParams: Promise.resolve({}), scope: "police", description: "자료실" });
    expect(community.robots).toBeUndefined();
    expect(archive.robots).toBeUndefined();
  });
});
