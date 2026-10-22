import { describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import { SITE_URL } from "@/lib/constants";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo";
import {
  buildStaticSitemapGroup,
  buildSitemapGroup,
  publicContentPath,
  renderSitemapIndex,
  SITEMAP_GROUPS,
  sitemapChildUrl,
} from "@/lib/sitemap";
import { hasPublicListingContent } from "@/lib/exam-track/public-listing-content";

vi.mock("@/lib/exam-track/public-listing-content", () => ({ hasPublicListingContent: vi.fn() }));
vi.mock("@/lib/supabase/env", () => ({ isSupabaseConfigured: () => false }));

describe("search engine foundations", () => {
  it("publishes one canonical host to crawlers", () => {
    const result = robots();
    expect(result.host).toBe(SITE_URL);
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it("connects website and organization entities with stable ids", () => {
    const organization = buildOrganizationJsonLd();
    const website = buildWebSiteJsonLd();

    expect(organization["@id"]).toBe(`${SITE_URL}/#organization`);
    expect(website["@id"]).toBe(`${SITE_URL}/#website`);
    expect(website.publisher["@id"]).toBe(organization["@id"]);
    expect(website.alternateName).toContain("bomgichul.com");
    expect(website.potentialAction?.target?.urlTemplate).toBe(
      `${SITE_URL}/search?q={search_term_string}`,
    );
    expect(organization.sameAs).toContain(
      "https://play.google.com/store/apps/details?id=com.sanghyun.police",
    );
    expect(organization.sameAs).toContain(
      "https://apps.apple.com/kr/app/id6815671838",
    );
  });

  it("uses each exam's canonical archive path in the sitemap", () => {
    expect(
      publicContentPath({
        id: "resource-id",
        category: "resource",
        community_scope: "public_service",
      }),
    ).toBe("/public-service/archive/resource-id");
    expect(
      publicContentPath({
        id: "post-id",
        category: "general",
        community_scope: "police",
      }),
    ).toBe("/police/community/post-id");
  });

  it("omits hidden exams while publishing existing English concepts", async () => {
    const historyUrls = buildStaticSitemapGroup("history").map((entry) => entry.url);
    const englishUrls = buildStaticSitemapGroup("english").map((entry) => entry.url);

    expect(historyUrls).toEqual([]);
    expect(englishUrls).toContain(`${SITE_URL}/english/concepts/gong9`);
  });

  it("lists every published exam hub in the home CollectionPage entity", async () => {
    const { buildPlatformHomeJsonLd } = await import("@/lib/seo");
    const home = buildPlatformHomeJsonLd();
    const urls = home.mainEntity.itemListElement.map(
      (item: { url: string }) => item.url,
    );
    expect(home.mainEntity.numberOfItems).toBe(17);
    for (const path of [
      "/public-service",
      "/real-estate",
      "/police",
      "/firefighter",
      "/housing",
      "/social-worker",
      "/english",
      "/gugeo",
      "/haengjeongsa",
      "/semusa",
      "/sanan",
      "/sonhae",
      "/nomusa",
      "/gyeongbi",
      "/gamjeong",
      "/mullyu",
      "/youth",
    ]) {
      expect(urls).toContain(`${SITE_URL}${path}`);
    }
    expect(urls).not.toContain(`${SITE_URL}/history`);
  });

  it("publishes a sitemap index with one independently crawlable feed per exam", () => {
    const index = renderSitemapIndex();

    expect(index).toContain("<sitemapindex");
    for (const group of SITEMAP_GROUPS) {
      expect(index).toContain(`<loc>${sitemapChildUrl(group)}</loc>`);
      expect(buildStaticSitemapGroup(group).length).toBeGreaterThan(0);
    }
  });

  it("lists youth exam rounds without question-level URLs", () => {
    // 청소년상담사는 앞 트랙들의 기본 정책대로 과목·회차까지만 싣는다(문항 URL 은 회차 목록의 링크로 발견된다).
    const urls = buildStaticSitemapGroup("youth").map((entry) => decodeURI(entry.url));
    expect(urls).toContain(`${SITE_URL}/youth/exam/g1_beop`);
    expect(urls).toContain(`${SITE_URL}/youth/exam/g1_beop/2025/제24회`);
    expect(urls.some((url) => /\/youth\/exam\/[^/]+\/\d{4}\/[^/]+\/\d+$/.test(url))).toBe(false);
  });

  it("keeps every exam URL inside its own sitemap", () => {
    const cases = [
      ["public-service", "/public-service/"],
      ["police", "/police/"],
      ["firefighter", "/firefighter/"],
      ["housing", "/housing/"],
      ["social-worker", "/social-worker/"],
      ["english", "/english/"],
      ["gugeo", "/gugeo/"],
      ["haengjeongsa", "/haengjeongsa/"],
      ["semusa", "/semusa/"],
      ["sanan", "/sanan/"],
      ["sonhae", "/sonhae/"],
      ["nomusa", "/nomusa/"],
      ["gyeongbi", "/gyeongbi/"],
      ["gamjeong", "/gamjeong/"],
      ["mullyu", "/mullyu/"],
      ["youth", "/youth/"],
    ] as const;

    for (const [group, prefix] of cases) {
      const urls = buildStaticSitemapGroup(group).map((entry) => entry.url);
      const base = `${SITE_URL}${prefix.slice(0, -1)}`;
      expect(urls.every((url) => url === base || url.startsWith(`${base}/`))).toBe(true);
      expect(new Set(urls).size).toBe(urls.length);
    }
  });

  it("omits only confirmed empty public listings across existing and new exams", async () => {
    for (const group of ["real-estate", "police", "housing", "gamjeong", "mullyu", "youth"] as const) {
      const prefix = group === "real-estate" ? "" : `/${group}`;
      const listingUrls = [`${SITE_URL}${prefix}/community`, `${SITE_URL}${prefix}/archive`];
      vi.mocked(hasPublicListingContent).mockResolvedValue(false);
      const emptyUrls = (await buildSitemapGroup(group)).map(({ url }) => url);
      for (const url of listingUrls) expect(emptyUrls).not.toContain(url);
      for (const result of [true, null]) {
        vi.mocked(hasPublicListingContent).mockResolvedValue(result);
        const availableUrls = (await buildSitemapGroup(group)).map(({ url }) => url);
        for (const url of listingUrls) expect(availableUrls).toContain(url);
      }
    }
  });
});
