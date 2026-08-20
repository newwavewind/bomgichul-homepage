import { describe, expect, it } from "vitest";
import { buildCommunityListMetadata } from "@/lib/exam-track/community-seo";

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
});
