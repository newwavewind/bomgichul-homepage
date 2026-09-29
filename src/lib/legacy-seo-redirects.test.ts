import { describe, expect, it } from "vitest";
import { getLegacySeoRedirect } from "./legacy-seo-redirects";

describe("getLegacySeoRedirect", () => {
  it("redirects Search Console's old public-service concept URLs", () => {
    expect(
      getLegacySeoRedirect(
        "/public-service/concepts/gyoyukhak/gyk-edu-thought",
      ),
    ).toBe("/public-service/concepts/gyoyukhak/gy-gyoyuk-cheolhak");
    expect(
      getLegacySeoRedirect(
        "/public-service/concepts/nodongbeop/labor-geunrogamdok",
      ),
    ).toBe(
      "/public-service/concepts/nodongbeop/labor-geunrogamdokgwan",
    );
  });

  it("redirects the retired history level URL to its concept hub", () => {
    expect(getLegacySeoRedirect("/history/concepts/simhwa")).toBe(
      "/history/concepts",
    );
  });

  it("redirects retired public-service firefighter URLs to /firefighter", () => {
    expect(
      getLegacySeoRedirect(
        "/public-service/concepts/sobang/fire-inhwa-balhwa",
      ),
    ).toBe("/firefighter/concepts/sobang/sb-yeonso-hyeongtae");
    expect(getLegacySeoRedirect("/public-service/concepts/sobang")).toBe(
      "/firefighter/concepts/sobang",
    );
    expect(
      getLegacySeoRedirect("/public-service/exam/sobangbeop/2024/국가직"),
    ).toBe("/firefighter/exam/sobangbeop/2024/국가직");
  });

  it("keeps unknown URLs as real 404s", () => {
    expect(
      getLegacySeoRedirect("/public-service/concepts/bokji/not-a-real-slug"),
    ).toBeNull();
  });
});
