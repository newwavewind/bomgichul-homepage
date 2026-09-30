import {trackWebFunnel} from "@/lib/web-funnel";
import { sendGAEvent } from "@next/third-parties/google";

export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined") return;
  if(name.startsWith("web_")) trackWebFunnel(name,params);
  else sendGAEvent("event", name, params);
}
