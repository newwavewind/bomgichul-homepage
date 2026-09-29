import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { SITE_URL } from "@/lib/constants";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo";
import {
  buildStaticSitemapGroup,
  publicContentPath,
  renderSitemapIndex,
  SITEMAP_GROUPS,
  sitemapChildUrl,
} from "@/lib/sitemap";

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
      "https://play.google.com/store/apps/details?id=com.sanghyun.semusa",
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

  it("only publishes concept routes that actually exist for history and English", async () => {
    const historyUrls = buildStaticSitemapGroup("history").map((entry) => entry.url);
    const englishUrls = buildStaticSitemapGroup("english").map((entry) => entry.url);

    expect(historyUrls).toContain(`${SITE_URL}/history/concepts`);
    expect(historyUrls).not.toContain(`${SITE_URL}/history/concepts/simhwa`);
    expect(englishUrls).not.toContain(`${SITE_URL}/english/concepts/gong9`);
  });

  it("lists every published exam hub in the home CollectionPage entity", async () => {
    const { buildPlatformHomeJsonLd } = await import("@/lib/seo");
    const home = buildPlatformHomeJsonLd();
    const urls = home.mainEntity.itemListElement.map(
      (item: { url: string }) => item.url,
    );
    expect(home.mainEntity.numberOfItems).toBe(14);
    for (const path of [
      "/public-service",
      "/real-estate",
      "/police",
      "/firefighter",
      "/housing",
      "/social-worker",
      "/history",
      "/english",
      "/gugeo",
      "/haengjeongsa",
      "/semusa",
      "/sanan",
      "/sonhae",
      "/nomusa",
    ]) {
      expect(urls).toContain(`${SITE_URL}${path}`);
    }
  });

  it("publishes a sitemap index with one independently crawlable feed per exam", () => {
    const index = renderSitemapIndex();

    expect(index).toContain("<sitemapindex");
    for (const group of SITEMAP_GROUPS) {
      expect(index).toContain(`<loc>${sitemapChildUrl(group)}</loc>`);
      expect(buildStaticSitemapGroup(group).length).toBeGreaterThan(0);
    }
  });

  it("keeps every exam URL inside its own sitemap", () => {
    const cases = [
      ["public-service", "/public-service/"],
      ["police", "/police/"],
      ["firefighter", "/firefighter/"],
      ["housing", "/housing/"],
      ["social-worker", "/social-worker/"],
      ["history", "/history/"],
      ["english", "/english/"],
      ["gugeo", "/gugeo/"],
      ["haengjeongsa", "/haengjeongsa/"],
      ["semusa", "/semusa/"],
      ["sanan", "/sanan/"],
      ["sonhae", "/sonhae/"],
      ["nomusa", "/nomusa/"],
    ] as const;

    for (const [group, prefix] of cases) {
      const urls = buildStaticSitemapGroup(group).map((entry) => entry.url);
      const base = `${SITE_URL}${prefix.slice(0, -1)}`;
      expect(urls.every((url) => url === base || url.startsWith(`${base}/`))).toBe(true);
      expect(new Set(urls).size).toBe(urls.length);
    }
  });
});
