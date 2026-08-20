import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { publicContentPath } from "@/app/sitemap";
import { SITE_URL } from "@/lib/constants";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo";

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
});
