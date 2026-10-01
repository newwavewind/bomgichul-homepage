import { describe, expect, it } from "vitest";
import {
  ADS_ENABLED,
  canShowAdSense,
  canShowCoupang,
  adsensePublisherId,
} from "@/lib/ads/config";

describe("ads config", () => {
  it("keeps ads off when env is unset or false", () => {
    expect(ADS_ENABLED).toBe(false);
    expect(canShowAdSense("exam")).toBe(false);
    expect(canShowAdSense("hub")).toBe(false);
    expect(canShowCoupang()).toBe(false);
  });

  it("strips ca-pub- prefix for ads.txt publisher id when empty", () => {
    expect(adsensePublisherId()).toBe("");
  });
});
