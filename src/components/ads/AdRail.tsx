import { AdSenseSlot } from "@/components/ads/AdSenseSlot";
import { CoupangPartnersSlot } from "@/components/ads/CoupangPartnersSlot";
import type { AdSensePlacement } from "@/lib/ads/config";

type AdRailProps = {
  /** 애드센스 슬롯 배치 키 */
  adsense?: AdSensePlacement | null;
  /** 쿠팡 위젯 표시 */
  coupang?: boolean;
  className?: string;
  /** 세로 간격 (기본 mt-8) */
  spacingClassName?: string;
};

/**
 * 페이지 공통 광고 레일 — 애드센스·쿠팡을 서로 다른 슬롯으로 분리.
 */
export function AdRail({
  adsense = null,
  coupang = false,
  className = "",
  spacingClassName = "mt-8 space-y-6",
}: AdRailProps) {
  if (!adsense && !coupang) return null;

  return (
    <div className={`${spacingClassName} ${className}`.trim()}>
      {adsense ? <AdSenseSlot placement={adsense} /> : null}
      {coupang ? <CoupangPartnersSlot /> : null}
    </div>
  );
}
