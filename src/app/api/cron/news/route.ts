import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { collectNewsFromFeeds } from "@/lib/news-feed";

export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const requestedCount = Number(new URL(request.url).searchParams.get("count")) || 10;
  const count = Math.min(Math.max(requestedCount, 1), 15);

  let rows;
  try {
    rows = await collectNewsFromFeeds(count);
  } catch (err) {
    const message = err instanceof Error ? err.message : "failed to collect news feeds";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, count: 0 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("news_items")
    .upsert(rows, { onConflict: "source_url,published_at", ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: rows.length });
}
