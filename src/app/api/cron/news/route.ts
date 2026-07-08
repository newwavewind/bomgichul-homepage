import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  NEWS_DAILY_TARGET,
  collectNewsFromFeeds,
  type NewsFeedItem,
} from "@/lib/news-feed";

export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const requestedCount = Number(new URL(request.url).searchParams.get("count"));
  const count = Math.min(
    Math.max(Number.isFinite(requestedCount) && requestedCount > 0 ? requestedCount : NEWS_DAILY_TARGET, 1),
    NEWS_DAILY_TARGET
  );

  const admin = createAdminClient();

  // 최근 저장된 기사와 사건 단위로 겹치지 않게 (URL이 달라도 같은 사건이면 스킵)
  const { data: existingRows } = await admin
    .from("news_items")
    .select("title, summary, source_name, source_url, published_at")
    .order("published_at", { ascending: false })
    .limit(40);

  const excludeAgainst = (existingRows ?? []) as NewsFeedItem[];

  let rows: NewsFeedItem[];
  try {
    rows = await collectNewsFromFeeds(count, { excludeAgainst });
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed to collect news feeds";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, count: 0 });
  }

  const { error } = await admin
    .from("news_items")
    .upsert(rows, { onConflict: "source_url,published_at", ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: rows.length });
}
