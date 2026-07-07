import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ARCHIVE_SUBJECTS, EXAM_SUBJECTS, SITE_URL } from "@/lib/constants";
import { getAllExamParams, getExamYearParams } from "@/lib/exam-questions";

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
  ...ARCHIVE_SUBJECTS.filter((s) => s.value !== "all" && s.value !== "other").map(
    (s) => ({
      url: `${SITE_URL}/subjects/${s.value}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  ),
];

/** 기출문제 해설(/exam) — 정적 데이터 순회, Supabase 불필요 */
function getExamUrls(): MetadataRoute.Sitemap {
  const now = new Date();
  const hubUrl: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/exam`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const subjectUrls: MetadataRoute.Sitemap = EXAM_SUBJECTS.map((s) => ({
    url: `${SITE_URL}/exam/${s.value}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const yearUrls: MetadataRoute.Sitemap = getExamYearParams().map(({ subject, year }) => ({
    url: `${SITE_URL}/exam/${subject}/${year}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const questionUrls: MetadataRoute.Sitemap = getAllExamParams().map(({ subject, year, no }) => ({
    url: `${SITE_URL}/exam/${subject}/${year}/${no}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...hubUrl, ...subjectUrls, ...yearUrls, ...questionUrls];
}

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
  return [...STATIC_PAGES, ...getExamUrls(), ...contentUrls];
}
