/**
 * 광고·제휴 슬롯 설정.
 * 승인 전에는 NEXT_PUBLIC_ADS_ENABLED=false 로 슬롯을 숨긴다.
 */

function envFlag(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function envString(value: string | undefined): string {
  return (value ?? "").trim();
}

export const ADS_ENABLED = envFlag(process.env.NEXT_PUBLIC_ADS_ENABLED);

export const ADSENSE_CLIENT = envString(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);
export const ADSENSE_SLOT_EXAM = envString(process.env.NEXT_PUBLIC_ADSENSE_SLOT_EXAM);
export const ADSENSE_SLOT_HUB = envString(process.env.NEXT_PUBLIC_ADSENSE_SLOT_HUB);
export const ADSENSE_SLOT_CONCEPT = envString(
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONCEPT || process.env.NEXT_PUBLIC_ADSENSE_SLOT_HUB
);

/** 쿠팡파트너스 추천인(트래킹) 코드 — AF… 형태 */
export const COUPANG_TRACKING_CODE = envString(process.env.NEXT_PUBLIC_COUPANG_PARTNERS_ID);
/** 다이나믹/검색 위젯 숫자 ID (파트너스에서 HTML 복사 시 "id") */
export const COUPANG_WIDGET_ID = envString(process.env.NEXT_PUBLIC_COUPANG_WIDGET_ID);

export const COUPANG_DISCLOSURE =
  "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

export type AdSensePlacement = "exam" | "hub" | "concept";

export function adsenseSlotFor(placement: AdSensePlacement): string {
  switch (placement) {
    case "exam":
      return ADSENSE_SLOT_EXAM;
    case "hub":
      return ADSENSE_SLOT_HUB;
    case "concept":
      return ADSENSE_SLOT_CONCEPT;
    default:
      return "";
  }
}

export function canShowAdSense(placement: AdSensePlacement): boolean {
  return ADS_ENABLED && Boolean(ADSENSE_CLIENT) && Boolean(adsenseSlotFor(placement));
}

export function canShowCoupang(): boolean {
  return ADS_ENABLED && Boolean(COUPANG_TRACKING_CODE) && Boolean(COUPANG_WIDGET_ID);
}

/** ads.txt 한 줄용 publisher ID (ca-pub- 접두 제거) */
export function adsensePublisherId(): string {
  return ADSENSE_CLIENT.replace(/^ca-pub-/i, "");
}
