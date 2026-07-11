/** 홈페이지·관리자 화면 공통 — 표시 시각은 항상 대한민국(Asia/Seoul) 기준 */

export const KST_TIMEZONE = "Asia/Seoul";

const KST = KST_TIMEZONE;

/** YYYY-MM-DD (KST) */
export function formatKstDateKey(date: Date = new Date()): string {
  return date.toLocaleDateString("en-CA", { timeZone: KST });
}

export function formatKstDate(
  iso: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!iso) return "—";
  const date = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("ko-KR", {
    timeZone: KST,
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

export function formatKstDateLong(iso: string | Date | null | undefined): string {
  return formatKstDate(iso, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatKstDateTime(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const date = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("ko-KR", {
    timeZone: KST,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatKstDateTimeShort(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const date = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("ko-KR", {
    timeZone: KST,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatKstTime(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const date = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("ko-KR", {
    timeZone: KST,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function kstYmdParts(date: Date): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: KST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { y: get("year"), m: get("month"), d: get("day") };
}

export function isSameKstDay(a: Date, b: Date = new Date()): boolean {
  const left = kstYmdParts(a);
  const right = kstYmdParts(b);
  return left.y === right.y && left.m === right.m && left.d === right.d;
}

/** 상대 시간 + 오래된 항목은 KST 날짜 */
export function formatKstRelative(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const date = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(date.getTime())) return "—";

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return formatKstDate(date);
}

/** 채팅용: 오늘(KST)이면 시각만, 아니면 날짜+시각 */
export function formatKstChatTime(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const date = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(date.getTime())) return "—";

  if (isSameKstDay(date)) {
    return formatKstTime(date);
  }
  return formatKstDateTimeShort(date);
}
