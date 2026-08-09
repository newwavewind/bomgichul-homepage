import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { NewsItem } from "@/types/database";

export async function getNewsItems(limit = 20): Promise<NewsItem[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_items")
    .select("*")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data;
}

/** 뉴스가 있는 날짜(최신순). 본문 없이 published_at만 모아 과거 날짜까지 노출한다. */
export async function getNewsDates(limit = 400): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_items")
    .select("published_at")
    .order("published_at", { ascending: false })
    .limit(Math.max(limit * 8, 500));

  if (error || !data) return [];

  const dates: string[] = [];
  const seen = new Set<string>();
  for (const row of data) {
    const d = row.published_at;
    if (!d || seen.has(d)) continue;
    seen.add(d);
    dates.push(d);
    if (dates.length >= limit) break;
  }
  return dates;
}

export async function getNewsItemsForDate(date: string): Promise<NewsItem[]> {
  if (!isSupabaseConfigured() || !date) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_items")
    .select("*")
    .eq("published_at", date)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}
