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
};

export type DailyVisitTrendPoint = SiteVisitDayStats;

type VisitAggregateRow = {
  visitor_id: string;
  user_id: string | null;
  is_local: boolean;
  client_host: string | null;
  client_ip: string | null;
  created_at: string;
};

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

  return {
    date: dateKey,
    pageViews: scoped.length,
    uniqueVisitors: uniqueVisitors.size,
    anonymousVisitors: anonymousVisitors.size,
    localVisitors: localVisitors.size,
    loggedInVisits: scoped.filter((r) => r.user_id).length,
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
  const rows: VisitAggregateRow[] = [];

  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await admin
      .from("site_visits")
      .select("visitor_id, user_id, is_local, client_host, client_ip, created_at")
      .gte("created_at", start)
      .lt("created_at", end)
      .order("created_at", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < pageSize) return rows;
  }
}

export async function recordSiteVisit(input: {
  visitorId: string;
  userId: string | null;
  path: string;
  referrer: string | null;
  isLocal: boolean;
  clientHost: string | null;
  clientIp: string | null;
}): Promise<void> {
  const admin = adminOrNull();
  if (!admin) return;

  await admin.from("site_visits").insert({
    visitor_id: input.visitorId,
    user_id: input.userId,
    path: input.path.slice(0, 500),
    referrer: input.referrer?.slice(0, 500) ?? null,
    is_local: input.isLocal,
    client_host: input.clientHost?.slice(0, 200) ?? null,
    client_ip: input.clientIp?.slice(0, 64) ?? null,
  });
}

export async function getAdminVisitStats(): Promise<SiteVisitStats> {
  const today = toKstDateKey();
  const dayStats = await getAdminVisitStatsForDate(today, { excludeLocal: true });
  const trend = await getAdminDailyVisitTrend(addKstDays(today, -6), today, {
    excludeLocal: true,
  });

  return {
    visitsToday: dayStats.pageViews,
    uniqueVisitorsToday: dayStats.uniqueVisitors,
    loggedInVisitsToday: dayStats.loggedInVisits,
    anonymousVisitorsToday: dayStats.anonymousVisitors,
    visitsLast7Days: trend.reduce((sum, point) => sum + point.pageViews, 0),
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
  const { data } = await admin
    .from("site_visits")
    .select(
      `
      visitor_id,
      user_id,
      path,
      is_local,
      client_host,
      client_ip,
      created_at,
      profiles:user_id (nickname)
    `
    )
    .gte("created_at", start)
    .lt("created_at", end)
    .order("created_at", { ascending: false })
    .limit(2000);

  if (!data) return [];

  const byVisitor = new Map<string, SiteVisitorSummary>();

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
