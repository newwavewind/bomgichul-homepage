import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SITE_URL } from "@/lib/constants";

/** 검색 노출 대상 정적 공개 페이지 */
const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${SITE_URL}/community`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/archive`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/diary`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
];

async function getPublicContentUrls(): Promise<MetadataRoute.Sitemap> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, category, updated_at")
    .order("updated_at", { ascending: false });

  if (error || !data) return [];

  return data.map((post) => ({
    url:
      post.category === "resource"
        ? `${SITE_URL}/archive/${post.id}`
        : `${SITE_URL}/community/${post.id}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contentUrls = await getPublicContentUrls();
  return [...STATIC_PAGES, ...contentUrls];
}
