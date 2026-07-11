import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  NEWS_DAILY_TARGET,
  collectNewsFromFeeds,
  todayKstDateString,
  type NewsFeedItem,
} from "@/lib/news-feed";

export const maxDuration = 60;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.replace(/^Bearer\s+/i, "").trim();
  return Boolean(bearer && bearer === secret);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const requestedCount = Number(new URL(request.url).searchParams.get("count"));
  const count = Math.min(
    Math.max(Number.isFinite(requestedCount) && requestedCount > 0 ? requestedCount : NEWS_DAILY_TARGET, 1),
    NEWS_DAILY_TARGET
  );

  const admin = createAdminClient();
  const digestDate = todayKstDateString();

  // 같은 날 이미 넣은 기사만 사건 중복 제외 (전날과 겹친다고 빈 날이 되지 않게)
  const { data: existingRows } = await admin
    .from("news_items")
    .select("title, summary, source_name, source_url, published_at")
    .eq("published_at", digestDate)
    .order("created_at", { ascending: false })
    .limit(40);

  const excludeAgainst = (existingRows ?? []) as NewsFeedItem[];

  // URL 단위로는 최근 며칠 것도 스킵
  const { data: recentUrlRows } = await admin
    .from("news_items")
    .select("source_url")
    .order("created_at", { ascending: false })
    .limit(80);
  const recentUrls = new Set((recentUrlRows ?? []).map((r) => r.source_url as string));

  let rows: NewsFeedItem[];
  try {
    rows = await collectNewsFromFeeds(count, { excludeAgainst });
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed to collect news feeds";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  rows = rows
    .filter((row) => !recentUrls.has(row.source_url))
    .map((row) => ({
      ...row,
      // 날짜 칩 = 수집한 아침(한국 날짜). RSS 원문 날짜와 무관하게 매일 새 탭이 생기게 함
      published_at: digestDate,
    }));

  if (rows.length === 0) {
    return NextResponse.json({
      ok: true,
      count: 0,
      digestDate,
      reason: "no_new_items_after_dedupe",
    });
  }

  const { error } = await admin
    .from("news_items")
    .upsert(rows, { onConflict: "source_url,published_at", ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ error: error.message, digestDate }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: rows.length, digestDate });
}
