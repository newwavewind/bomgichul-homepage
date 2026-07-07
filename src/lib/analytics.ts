import { sendGAEvent } from "@next/third-parties/google";

export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined") return;
  sendGAEvent("event", name, params);
}
