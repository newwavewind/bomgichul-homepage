import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { vi } from "vitest";
import { AdRail } from "./AdRail";

beforeAll(() => vi.stubGlobal("React", React));
afterAll(() => vi.unstubAllGlobals());

describe("ad delivery boundaries", () => {
  it("does not leave an empty advertising rail when ads are disabled", () => {
    expect(renderToStaticMarkup(React.createElement(AdRail, {
      adsense: "hub", coupang: true,
    }))).toBe("");
  });

  it("keeps site verification without injecting the ad loader on every page", () => {
    const layout = readFileSync("src/app/layout.tsx", "utf8");
    const adsTxt = readFileSync("public/ads.txt", "utf8");
    expect(layout).toContain('"google-adsense-account": "ca-pub-2810884671058928"');
    expect(adsTxt).toContain("google.com, pub-2810884671058928, DIRECT");
    expect(layout).not.toContain("pagead2.googlesyndication.com");
  });
});
