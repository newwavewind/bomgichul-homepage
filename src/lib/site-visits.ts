import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const VISITOR_COOKIE = "bomgichul_vid";
export const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const SKIP_PREFIXES = [
  "/_next",
  "/api",
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

export type SiteVisitRow = {
  id: string;
  visitorId: string;
  userId: string | null;
  nickname: string | null;
  path: string;
  referrer: string | null;
  isLocal: boolean;
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
};

export type SiteVisitStats = {
  visitsToday: number;
  uniqueVisitorsToday: number;
  loggedInVisitsToday: number;
  anonymousVisitorsToday: number;
  visitsLast7Days: number;
};

function adminOrNull() {
  if (!isSupabaseConfigured()) return null;
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

function startOfTodayKst(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function recordSiteVisit(input: {
  visitorId: string;
  userId: string | null;
  path: string;
  referrer: string | null;
  isLocal: boolean;
}): Promise<void> {
  const admin = adminOrNull();
  if (!admin) return;

  await admin.from("site_visits").insert({
    visitor_id: input.visitorId,
    user_id: input.userId,
    path: input.path.slice(0, 500),
    referrer: input.referrer?.slice(0, 500) ?? null,
    is_local: input.isLocal,
  });
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

  const today = startOfTodayKst();
  const todayStart = `${today}T00:00:00+09:00`;
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [todayRows, weekCountRes] = await Promise.all([
    admin
      .from("site_visits")
      .select("visitor_id, user_id")
      .gte("created_at", todayStart),
    admin
      .from("site_visits")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekAgo),
  ]);

  const rows = todayRows.data ?? [];
  const uniqueVisitors = new Set(rows.map((r) => r.visitor_id));
  const loggedInRows = rows.filter((r) => r.user_id);
  const loggedInVisitors = new Set(loggedInRows.map((r) => r.visitor_id));
  const anonymousVisitors = new Set(
    rows.filter((r) => !r.user_id).map((r) => r.visitor_id)
  );

  return {
    visitsToday: rows.length,
    uniqueVisitorsToday: uniqueVisitors.size,
    loggedInVisitsToday: loggedInRows.length,
    anonymousVisitorsToday: anonymousVisitors.size,
    visitsLast7Days: weekCountRes.count ?? 0,
  };
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
      createdAt: row.created_at,
    };
  });
}

export async function getAdminVisitorSummaries(
  limit = 50
): Promise<SiteVisitorSummary[]> {
  const admin = adminOrNull();
  if (!admin) return [];

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data } = await admin
    .from("site_visits")
    .select(
      `
      visitor_id,
      user_id,
      path,
      is_local,
      created_at,
      profiles:user_id (nickname)
    `
    )
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(500);

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
      });
      continue;
    }

    existing.visitCount += 1;
    if (!existing.userId && row.user_id) {
      existing.userId = row.user_id;
      existing.nickname = profile?.nickname ?? null;
    }
  }

  return [...byVisitor.values()]
    .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt))
    .slice(0, limit);
}
