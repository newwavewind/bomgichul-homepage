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

  it("keeps unknown URLs as real 404s", () => {
    expect(
      getLegacySeoRedirect("/public-service/concepts/bokji/not-a-real-slug"),
    ).toBeNull();
  });
});
