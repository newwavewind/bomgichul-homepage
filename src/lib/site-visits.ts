import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const VISITOR_COOKIE = "bomgichul_vid";
export const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const KST_TIMEZONE = "Asia/Seoul";

const SKIP_PREFIXES = [
  "/_next",
  "/api",
  "/admin",
  "/brand",
  "/favicon",
  "/icon",
  "/apple-icon",
  "/robots",
  "/sitemap",
];

export function shouldTrackVisitPath(path: string): boolean {
  if (!path || path === "") return false;
  if (SKIP_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) {
    return false;
  }
  if (/\.[a-z0-9]+$/i.test(path)) return false;
  return true;
}

export function shortVisitorId(visitorId: string): string {
  if (visitorId.length <= 8) return visitorId;
  return `…${visitorId.slice(-8)}`;
}

export function formatVisitPath(path: string): string {
  if (path.length <= 48) return path;
  return `${path.slice(0, 45)}…`;
}

export function formatClientAddress(
  clientHost: string | null,
  clientIp: string | null,
  isLocal: boolean
): string {
  if (clientHost) return clientHost;
  if (clientIp) return clientIp;
  if (isLocal) return "localhost";
  return "—";
}

export type VisitClass =
  | "likely_human"
  | "verified_bot"
  | "suspected_bot"
  | "unknown";

export const VISIT_CLASS_LABELS: Record<VisitClass, string> = {
  likely_human: "사람 추정",
  verified_bot: "검증된 검색봇",
  suspected_bot: "의심 자동화",
  unknown: "판단 보류",
};

export type SiteVisitRow = {
  id: string;
  visitorId: string;
  userId: string | null;
  nickname: string | null;
  path: string;
  referrer: string | null;
  isLocal: boolean;
  clientHost: string | null;
  clientIp: string | null;
  sessionId: string | null;
  userAgent: string | null;
  browserName: string | null;
  deviceType: string | null;
  countryCode: string | null;
  botClass: VisitClass;
  botConfidence: number;
  classificationReasons: string[];
  verifiedBotName: string | null;
  verifiedBotCategory: string | null;
  engaged: boolean;
  engagementMs: number;
  interactionCount: number;
  createdAt: string;
};

export type SiteVisitorSummary = {
  visitorId: string;
  userId: string | null;
  nickname: string | null;
  visitCount: number;
  lastPath: string;
  lastSeenAt: string;
  isLocal: boolean;
  clientHost: string | null;
  clientIp: string | null;
  countryCode: string | null;
  browserName: string | null;
  deviceType: string | null;
  visitClass: VisitClass;
  confidence: number;
  reasons: string[];
  verifiedBotName: string | null;
  engaged: boolean;
  engagementMs: number;
  interactionCount: number;
};

export type SiteVisitStats = {
  visitsToday: number;
  uniqueVisitorsToday: number;
  loggedInVisitsToday: number;
  anonymousVisitorsToday: number;
  visitsLast7Days: number;
};

export type SiteVisitDayStats = {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  anonymousVisitors: number;
  localVisitors: number;
  loggedInVisits: number;
  likelyHumanVisitors: number;
  verifiedBotVisitors: number;
  suspectedBotVisitors: number;
  unknownVisitors: number;
};

export type DailyVisitTrendPoint = SiteVisitDayStats;

export type VisitAggregateRow = {
  visitor_id: string;
  user_id: string | null;
  is_local: boolean;
  client_host: string | null;
  client_ip: string | null;
  ip_hash: string | null;
  path: string;
  bot_class: VisitClass | null;
  bot_confidence: number | null;
  classification_reasons: string[] | null;
  verified_bot_name: string | null;
  user_agent: string | null;
  engaged: boolean | null;
  engagement_ms: number | null;
  interaction_count: number | null;
  created_at: string;
};

type VisitorDetailRow = VisitAggregateRow & {
  browser_name: string | null;
  device_type: string | null;
  country_code: string | null;
  profiles: { nickname: string | null } | Array<{ nickname: string | null }> | null;
};

type VisitorClassification = {
  visitClass: VisitClass;
  confidence: number;
  reasons: string[];
};

const BOT_UA = /bot|crawler|spider|slurp|headless|lighthouse|facebookexternalhit|kakaotalk-scrap|naverbot|yeti/i;

export function classifyVisitors(rows: VisitAggregateRow[]): Map<string, VisitorClassification> {
  const byVisitor = new Map<string, VisitAggregateRow[]>();
  const visitorsByIp = new Map<string, Set<string>>();

  for (const row of rows) {
    const bucket = byVisitor.get(row.visitor_id);
    if (bucket) bucket.push(row);
    else byVisitor.set(row.visitor_id, [row]);
    const address = row.ip_hash || row.client_ip;
    if (address) {
      const ids = visitorsByIp.get(address) ?? new Set<string>();
      ids.add(row.visitor_id);
      visitorsByIp.set(address, ids);
    }
  }

  const result = new Map<string, VisitorClassification>();
  for (const [visitorId, visits] of byVisitor) {
    const reasons = new Set<string>();
    const verified = visits.find((v) => v.bot_class === "verified_bot");
    if (verified) {
      reasons.add(
        verified.verified_bot_name
          ? `${verified.verified_bot_name} 검증 봇`
          : "Vercel 검증 봇"
      );
      result.set(visitorId, { visitClass: "verified_bot", confidence: 100, reasons: [...reasons] });
      continue;
    }

    const explicitBot = visits.some((v) => v.bot_class === "suspected_bot");
    const botUa = visits.some((v) => BOT_UA.test(v.user_agent ?? ""));
    const address = visits.find((v) => v.ip_hash || v.client_ip);
    const addressKey = address?.ip_hash || address?.client_ip || "";
    const cookieCount = addressKey ? visitorsByIp.get(addressKey)?.size ?? 0 : 0;
    const sorted = [...visits].sort((a, b) => a.created_at.localeCompare(b.created_at));
    let rapidPaths = 0;
    for (let i = 0; i < sorted.length; i += 1) {
      const start = new Date(sorted[i].created_at).getTime();
      const paths = new Set<string>();
      for (let j = i; j < sorted.length; j += 1) {
        if (new Date(sorted[j].created_at).getTime() - start > 60_000) break;
        paths.add(sorted[j].path);
      }
      rapidPaths = Math.max(rapidPaths, paths.size);
    }

    if (explicitBot) reasons.add("BotID 자동화 판정");
    if (botUa) reasons.add("자동화 User-Agent");
    if (cookieCount >= 10) reasons.add(`같은 접속망에서 쿠키 ${cookieCount}개`);
    if (rapidPaths >= 8) reasons.add(`1분 내 서로 다른 페이지 ${rapidPaths}개`);

    if (explicitBot || botUa || cookieCount >= 10 || rapidPaths >= 8) {
      const confidence = explicitBot ? 95 : Math.min(95, 65 + (cookieCount >= 10 ? 15 : 0) + (rapidPaths >= 8 ? 15 : 0));
      result.set(visitorId, { visitClass: "suspected_bot", confidence, reasons: [...reasons] });
      continue;
    }

    const loggedIn = visits.some((v) => Boolean(v.user_id));
    const engaged = visits.some((v) => v.engaged || (v.interaction_count ?? 0) > 0 || (v.engagement_ms ?? 0) >= 10_000);
    const verifiedHuman = visits.some((v) => v.bot_class === "likely_human");
    if (loggedIn) reasons.add("로그인 사용자");
    if (engaged) reasons.add("체류 또는 화면 상호작용 확인");
    if (verifiedHuman) reasons.add("BotID 사람 판정");

    if (loggedIn || engaged || verifiedHuman) {
      result.set(visitorId, {
        visitClass: "likely_human",
        confidence: verifiedHuman ? 95 : loggedIn && engaged ? 90 : 75,
        reasons: [...reasons],
      });
    } else {
      result.set(visitorId, {
        visitClass: "unknown",
        confidence: 0,
        reasons: [visits.length === 1 ? "상호작용 없는 1회 방문" : "판정 신호 부족"],
      });
    }
  }
  return result;
}

function adminOrNull() {
  if (!isSupabaseConfigured()) return null;
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

/** YYYY-MM-DD (한국 시간) */
export function toKstDateKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: KST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function parseKstDateKey(dateKey: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return null;
  const parsed = new Date(`${dateKey}T12:00:00+09:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return dateKey;
}

export function kstDayBounds(dateKey: string): { start: string; end: string } {
  const start = `${dateKey}T00:00:00+09:00`;
  const [y, m, d] = dateKey.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1, -9, 0, 0));
  const endKey = toKstDateKey(next);
  const end = `${endKey}T00:00:00+09:00`;
  return { start, end };
}

export function addKstDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T12:00:00+09:00`);
  date.setDate(date.getDate() + days);
  return toKstDateKey(date);
}

function aggregateDayStats(
  dateKey: string,
  rows: VisitAggregateRow[],
  options?: { excludeLocal?: boolean }
): SiteVisitDayStats {
  const scoped = options?.excludeLocal ? rows.filter((r) => !r.is_local) : rows;
  const uniqueVisitors = new Set(scoped.map((r) => r.visitor_id));
  const anonymousVisitors = new Set(
    scoped.filter((r) => !r.user_id).map((r) => r.visitor_id)
  );
  const localVisitors = new Set(
    rows.filter((r) => r.is_local).map((r) => r.visitor_id)
  );
  const classifications = classifyVisitors(scoped);
  const countClass = (visitClass: VisitClass) =>
    [...classifications.values()].filter((value) => value.visitClass === visitClass).length;

  return {
    date: dateKey,
    pageViews: scoped.length,
    uniqueVisitors: uniqueVisitors.size,
    anonymousVisitors: anonymousVisitors.size,
    localVisitors: localVisitors.size,
    loggedInVisits: scoped.filter((r) => r.user_id).length,
    likelyHumanVisitors: countClass("likely_human"),
    verifiedBotVisitors: countClass("verified_bot"),
    suspectedBotVisitors: countClass("suspected_bot"),
    unknownVisitors: countClass("unknown"),
  };
}

function groupRowsByKstDate(rows: VisitAggregateRow[]): Map<string, VisitAggregateRow[]> {
  const map = new Map<string, VisitAggregateRow[]>();
  for (const row of rows) {
    const key = toKstDateKey(new Date(row.created_at));
    const bucket = map.get(key);
    if (bucket) bucket.push(row);
    else map.set(key, [row]);
  }
  return map;
}

async function fetchVisitAggregateRows(
  admin: ReturnType<typeof createAdminClient>,
  start: string,
  end: string
): Promise<VisitAggregateRow[]> {
  const pageSize = 1000;
  const selectCols =
    "visitor_id, user_id, is_local, client_host, client_ip, ip_hash, path, bot_class, bot_confidence, classification_reasons, verified_bot_name, user_agent, engaged, engagement_ms, interaction_count, created_at";

  const first = await admin
    .from("site_visits")
    .select(selectCols, { count: "exact" })
    .gte("created_at", start)
    .lt("created_at", end)
    .order("created_at", { ascending: true })
    .range(0, pageSize - 1);

  if (first.error) throw first.error;

  const rows: VisitAggregateRow[] = [...((first.data ?? []) as VisitAggregateRow[])];
  const total = first.count ?? rows.length;
  if (total <= pageSize) return rows;

  const offsets: number[] = [];
  for (let offset = pageSize; offset < total; offset += pageSize) {
    offsets.push(offset);
  }

  const batches = await Promise.all(
    offsets.map((offset) =>
      admin
        .from("site_visits")
        .select(selectCols)
        .gte("created_at", start)
        .lt("created_at", end)
        .order("created_at", { ascending: true })
        .range(offset, offset + pageSize - 1)
    )
  );

  for (const batch of batches) {
    if (batch.error) throw batch.error;
    rows.push(...((batch.data ?? []) as VisitAggregateRow[]));
  }

  return rows;
}

export async function recordSiteVisit(input: {
  visitorId: string;
  userId: string | null;
  path: string;
  referrer: string | null;
  isLocal: boolean;
  clientHost: string | null;
  clientIp: string | null;
  sessionId: string | null;
  userAgent: string | null;
  browserName: string | null;
  deviceType: string | null;
  acceptLanguage: string | null;
  clientHints: string | null;
  fetchSite: string | null;
  countryCode: string | null;
  ipHash: string | null;
  botClass: VisitClass;
  botConfidence: number;
  classificationReasons: string[];
  verifiedBotName: string | null;
  verifiedBotCategory: string | null;
}): Promise<string | null> {
  const admin = adminOrNull();
  if (!admin) return null;

  const { data, error } = await admin.from("site_visits").insert({
    visitor_id: input.visitorId,
    user_id: input.userId,
    path: input.path.slice(0, 500),
    referrer: input.referrer?.slice(0, 500) ?? null,
    is_local: input.isLocal,
    client_host: input.clientHost?.slice(0, 200) ?? null,
    // 원본 IP는 새 기록부터 저장하지 않고 일별 해시만 사용합니다.
    client_ip: null,
    session_id: input.sessionId?.slice(0, 100) ?? null,
    user_agent: input.userAgent?.slice(0, 500) ?? null,
    browser_name: input.browserName?.slice(0, 80) ?? null,
    device_type: input.deviceType?.slice(0, 40) ?? null,
    accept_language: input.acceptLanguage?.slice(0, 120) ?? null,
    client_hints: input.clientHints?.slice(0, 300) ?? null,
    fetch_site: input.fetchSite?.slice(0, 40) ?? null,
    country_code: input.countryCode?.slice(0, 8) ?? null,
    ip_hash: input.ipHash,
    bot_class: input.botClass,
    bot_confidence: input.botConfidence,
    classification_reasons: input.classificationReasons,
    verified_bot_name: input.verifiedBotName?.slice(0, 120) ?? null,
    verified_bot_category: input.verifiedBotCategory?.slice(0, 120) ?? null,
  }).select("id").single();

  if (error) {
    console.error("site visit insert failed", error.message);
    return null;
  }
  return data.id;
}

export async function updateSiteVisitEngagement(input: {
  visitId: string;
  visitorId: string;
  engagementMs: number;
  interactionCount: number;
}): Promise<void> {
  const admin = adminOrNull();
  if (!admin) return;
  const engaged = input.interactionCount > 0 || input.engagementMs >= 10_000;
  await admin
    .from("site_visits")
    .update({
      engaged,
      engagement_ms: Math.min(Math.max(input.engagementMs, 0), 86_400_000),
      interaction_count: Math.min(Math.max(input.interactionCount, 0), 10_000),
    })
    .eq("id", input.visitId)
    .eq("visitor_id", input.visitorId);
}

export async function getAdminVisitStats(): Promise<SiteVisitStats> {
  const empty: SiteVisitStats = {
    visitsToday: 0,
    uniqueVisitorsToday: 0,
    loggedInVisitsToday: 0,
    anonymousVisitorsToday: 0,
    visitsLast7Days: 0,
  };

  const admin = adminOrNull();
  if (!admin) return empty;

  const today = toKstDateKey();
  const { start: todayStart, end: todayEnd } = kstDayBounds(today);
  const weekStart = kstDayBounds(addKstDays(today, -6)).start;

  // 대시보드는 봇 분류가 필요 없다. 오늘 행만 가볍게 읽고, 7일은 count만.
  // (이전에는 7일치 전체 행을 페이지네이션으로 긁어 ~1만 건+ 왕복이 났음)
  const [todayRes, weekCountRes] = await Promise.all([
    admin
      .from("site_visits")
      .select("visitor_id, user_id, is_local")
      .gte("created_at", todayStart)
      .lt("created_at", todayEnd)
      .order("created_at", { ascending: true })
      .limit(5000),
    admin
      .from("site_visits")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekStart)
      .lt("created_at", todayEnd)
      .eq("is_local", false),
  ]);

  const scoped = (todayRes.data ?? []).filter((row) => !row.is_local);
  const uniqueVisitors = new Set(scoped.map((row) => row.visitor_id));
  const anonymousVisitors = new Set(
    scoped.filter((row) => !row.user_id).map((row) => row.visitor_id)
  );

  return {
    visitsToday: scoped.length,
    uniqueVisitorsToday: uniqueVisitors.size,
    loggedInVisitsToday: scoped.filter((row) => row.user_id).length,
    anonymousVisitorsToday: anonymousVisitors.size,
    visitsLast7Days: weekCountRes.count ?? 0,
  };
}

export async function getAdminVisitStatsForDate(
  dateKey: string,
  options?: { excludeLocal?: boolean }
): Promise<SiteVisitDayStats> {
  const empty: SiteVisitDayStats = {
    date: dateKey,
    pageViews: 0,
    uniqueVisitors: 0,
    anonymousVisitors: 0,
    localVisitors: 0,
    loggedInVisits: 0,
    likelyHumanVisitors: 0,
    verifiedBotVisitors: 0,
    suspectedBotVisitors: 0,
    unknownVisitors: 0,
  };

  const admin = adminOrNull();
  if (!admin) return empty;

  const { start, end } = kstDayBounds(dateKey);
  const data = await fetchVisitAggregateRows(admin, start, end);

  return aggregateDayStats(dateKey, data, options);
}

export async function getAdminDailyVisitTrend(
  fromDateKey: string,
  toDateKey: string,
  options?: { excludeLocal?: boolean }
): Promise<DailyVisitTrendPoint[]> {
  const admin = adminOrNull();
  if (!admin) return [];

  const { start } = kstDayBounds(fromDateKey);
  const { end } = kstDayBounds(toDateKey);

  const data = await fetchVisitAggregateRows(admin, start, end);

  const grouped = groupRowsByKstDate(data);
  const points: DailyVisitTrendPoint[] = [];
  let cursor = fromDateKey;

  while (cursor <= toDateKey) {
    points.push(aggregateDayStats(cursor, grouped.get(cursor) ?? [], options));
    cursor = addKstDays(cursor, 1);
  }

  return points;
}

export async function getAdminMonthVisitorCounts(
  year: number,
  month: number
): Promise<Record<string, number>> {
  const admin = adminOrNull();
  if (!admin) return {};

  const fromDateKey = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const toDateKey = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const trend = await getAdminDailyVisitTrend(fromDateKey, toDateKey);
  return Object.fromEntries(trend.map((point) => [point.date, point.uniqueVisitors]));
}

export async function getAdminRecentVisitsForDate(
  dateKey: string,
  limit = 100
): Promise<SiteVisitRow[]> {
  const admin = adminOrNull();
  if (!admin) return [];

  const { start, end } = kstDayBounds(dateKey);
  const { data } = await admin
    .from("site_visits")
    .select(
      `
      id,
      visitor_id,
      user_id,
      path,
      referrer,
      is_local,
      client_host,
      client_ip,
      session_id,
      user_agent,
      browser_name,
      device_type,
      country_code,
      bot_class,
      bot_confidence,
      classification_reasons,
      verified_bot_name,
      verified_bot_category,
      engaged,
      engagement_ms,
      interaction_count,
      created_at,
      profiles:user_id (nickname)
    `
    )
    .gte("created_at", start)
    .lt("created_at", end)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data) return [];

  return data.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      visitorId: row.visitor_id,
      userId: row.user_id,
      nickname: profile?.nickname ?? null,
      path: row.path,
      referrer: row.referrer,
      isLocal: row.is_local,
      clientHost: row.client_host,
      clientIp: row.client_ip,
      sessionId: row.session_id,
      userAgent: row.user_agent,
      browserName: row.browser_name,
      deviceType: row.device_type,
      countryCode: row.country_code,
      botClass: (row.bot_class as VisitClass) ?? "unknown",
      botConfidence: row.bot_confidence ?? 0,
      classificationReasons: row.classification_reasons ?? [],
      verifiedBotName: row.verified_bot_name,
      verifiedBotCategory: row.verified_bot_category,
      engaged: row.engaged ?? false,
      engagementMs: row.engagement_ms ?? 0,
      interactionCount: row.interaction_count ?? 0,
      createdAt: row.created_at,
    };
  });
}

export async function getAdminRecentVisits(limit = 100): Promise<SiteVisitRow[]> {
  const admin = adminOrNull();
  if (!admin) return [];

  const { data } = await admin
    .from("site_visits")
    .select(
      `
      id,
      visitor_id,
      user_id,
      path,
      referrer,
      is_local,
      client_host,
      client_ip,
      session_id,
      user_agent,
      browser_name,
      device_type,
      country_code,
      bot_class,
      bot_confidence,
      classification_reasons,
      verified_bot_name,
      verified_bot_category,
      engaged,
      engagement_ms,
      interaction_count,
      created_at,
      profiles:user_id (nickname)
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data) return [];

  return data.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      visitorId: row.visitor_id,
      userId: row.user_id,
      nickname: profile?.nickname ?? null,
      path: row.path,
      referrer: row.referrer,
      isLocal: row.is_local,
      clientHost: row.client_host,
      clientIp: row.client_ip,
      sessionId: row.session_id,
      userAgent: row.user_agent,
      browserName: row.browser_name,
      deviceType: row.device_type,
      countryCode: row.country_code,
      botClass: (row.bot_class as VisitClass) ?? "unknown",
      botConfidence: row.bot_confidence ?? 0,
      classificationReasons: row.classification_reasons ?? [],
      verifiedBotName: row.verified_bot_name,
      verifiedBotCategory: row.verified_bot_category,
      engaged: row.engaged ?? false,
      engagementMs: row.engagement_ms ?? 0,
      interactionCount: row.interaction_count ?? 0,
      createdAt: row.created_at,
    };
  });
}

export async function getAdminVisitorSummariesForDate(
  dateKey: string,
  limit = 80
): Promise<SiteVisitorSummary[]> {
  const admin = adminOrNull();
  if (!admin) return [];

  const { start, end } = kstDayBounds(dateKey);
  const data: VisitorDetailRow[] = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const { data: batch, error } = await admin
      .from("site_visits")
      .select(
        `
      visitor_id,
      user_id,
      path,
      is_local,
      client_host,
      client_ip,
      ip_hash,
      user_agent,
      browser_name,
      device_type,
      country_code,
      bot_class,
      bot_confidence,
      classification_reasons,
      verified_bot_name,
      engaged,
      engagement_ms,
      interaction_count,
      created_at,
      profiles:user_id (nickname)
      `
      )
      .gte("created_at", start)
      .lt("created_at", end)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    const rows = (batch ?? []) as unknown as VisitorDetailRow[];
    data.push(...rows);
    if (rows.length < pageSize) break;
  }

  const byVisitor = new Map<string, SiteVisitorSummary>();
  const classifications = classifyVisitors(data as unknown as VisitAggregateRow[]);

  for (const row of data) {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const existing = byVisitor.get(row.visitor_id);
    if (!existing) {
      byVisitor.set(row.visitor_id, {
        visitorId: row.visitor_id,
        userId: row.user_id,
        nickname: profile?.nickname ?? null,
        visitCount: 1,
        lastPath: row.path,
        lastSeenAt: row.created_at,
        isLocal: row.is_local,
        clientHost: row.client_host,
        clientIp: row.client_ip,
        countryCode: row.country_code,
        browserName: row.browser_name,
        deviceType: row.device_type,
        visitClass: classifications.get(row.visitor_id)?.visitClass ?? "unknown",
        confidence: classifications.get(row.visitor_id)?.confidence ?? 0,
        reasons: classifications.get(row.visitor_id)?.reasons ?? ["판정 신호 부족"],
        verifiedBotName: row.verified_bot_name,
        engaged: row.engaged ?? false,
        engagementMs: row.engagement_ms ?? 0,
        interactionCount: row.interaction_count ?? 0,
      });
      continue;
    }

    existing.visitCount += 1;
    if (!existing.userId && row.user_id) {
      existing.userId = row.user_id;
      existing.nickname = profile?.nickname ?? null;
    }
    if (!existing.clientHost && row.client_host) {
      existing.clientHost = row.client_host;
    }
    if (!existing.clientIp && row.client_ip) {
      existing.clientIp = row.client_ip;
    }
    if (!existing.countryCode && row.country_code) existing.countryCode = row.country_code;
    if (!existing.browserName && row.browser_name) existing.browserName = row.browser_name;
    if (!existing.deviceType && row.device_type) existing.deviceType = row.device_type;
    if (!existing.verifiedBotName && row.verified_bot_name) existing.verifiedBotName = row.verified_bot_name;
    existing.engaged ||= row.engaged ?? false;
    existing.engagementMs = Math.max(existing.engagementMs, row.engagement_ms ?? 0);
    existing.interactionCount += row.interaction_count ?? 0;
  }

  return [...byVisitor.values()]
    .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt))
    .slice(0, limit);
}

/** @deprecated 최근 24시간 — getAdminVisitorSummariesForDate 사용 권장 */
export async function getAdminVisitorSummaries(
  limit = 50
): Promise<SiteVisitorSummary[]> {
  return getAdminVisitorSummariesForDate(toKstDateKey(), limit);
}
