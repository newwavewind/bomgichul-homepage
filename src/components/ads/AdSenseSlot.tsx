"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import {
  ADSENSE_CLIENT,
  type AdSensePlacement,
  adsenseSlotFor,
  canShowAdSense,
} from "@/lib/ads/config";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type AdSenseSlotProps = {
  placement: AdSensePlacement;
  className?: string;
  /** CLS 완화용 최소 높이 */
  minHeight?: number;
};

export function AdSenseSlot({
  placement,
  className = "",
  minHeight = 100,
}: AdSenseSlotProps) {
  const pushedRef = useRef(false);
  const slot = adsenseSlotFor(placement);

  useEffect(() => {
    if (!canShowAdSense(placement) || pushedRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // 승인 전·차단기·중복 push 등은 무시
    }
  }, [placement, slot]);

  if (!canShowAdSense(placement)) {
    return null;
  }

  return (
    <aside
      className={`adsense-slot w-full overflow-hidden ${className}`.trim()}
      aria-label="광고"
      data-ad-placement={placement}
      style={{ minHeight }}
    >
      <Script
        id="adsense-loader"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
