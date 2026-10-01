"use client";

import { useEffect, useId, useRef } from "react";
import Script from "next/script";
import {
  COUPANG_DISCLOSURE,
  COUPANG_TRACKING_CODE,
  COUPANG_WIDGET_ID,
  canShowCoupang,
} from "@/lib/ads/config";

declare global {
  interface Window {
    PartnersCoupang?: {
      G: new (options: Record<string, unknown>) => unknown;
    };
  }
}

type CoupangPartnersSlotProps = {
  className?: string;
  /** 위젯 높이 (px) */
  height?: number;
};

export function CoupangPartnersSlot({
  className = "",
  height = 160,
}: CoupangPartnersSlotProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const reactId = useId().replace(/:/g, "");

  useEffect(() => {
    if (!canShowCoupang() || mountedRef.current || !hostRef.current) return;

    const mount = () => {
      if (!window.PartnersCoupang?.G || !hostRef.current || mountedRef.current) return;
      hostRef.current.innerHTML = "";
      const marker = document.createElement("div");
      marker.setAttribute("data-coupang-marker", reactId);
      hostRef.current.appendChild(marker);
      try {
        // eslint-disable-next-line no-new
        new window.PartnersCoupang.G({
          id: Number(COUPANG_WIDGET_ID),
          template: "carousel",
          trackingCode: COUPANG_TRACKING_CODE,
          width: "100%",
          height: String(height),
          border: false,
        });
        mountedRef.current = true;
      } catch {
        // 위젯 ID 미승인·스크립트 차단 등은 조용히 무시
      }
    };

    mount();
    const timer = window.setTimeout(mount, 400);
    return () => window.clearTimeout(timer);
  }, [height, reactId]);

  if (!canShowCoupang()) {
    return null;
  }

  return (
    <aside
      className={`coupang-partners-slot w-full ${className}`.trim()}
      aria-label="제휴 상품 추천"
      data-affiliate="coupang"
    >
      <p className="mb-2 font-display text-[11px] leading-relaxed text-fog">
        {COUPANG_DISCLOSURE}
      </p>
      <Script
        id="coupang-partners-g"
        src="https://ads-partners.coupang.com/g.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (!hostRef.current || mountedRef.current || !window.PartnersCoupang?.G) return;
          try {
            hostRef.current.innerHTML = "";
            // eslint-disable-next-line no-new
            new window.PartnersCoupang.G({
              id: Number(COUPANG_WIDGET_ID),
              template: "carousel",
              trackingCode: COUPANG_TRACKING_CODE,
              width: "100%",
              height: String(height),
              border: false,
            });
            mountedRef.current = true;
          } catch {
            // ignore
          }
        }}
      />
      <div
        ref={hostRef}
        className="w-full overflow-hidden rounded-xl border border-mist bg-snow"
        style={{ minHeight: height }}
      />
    </aside>
  );
}
