import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ARCHIVE_SUBJECTS, EXAM_SUBJECTS, SITE_URL } from "@/lib/constants";
import { getAllConceptParams } from "@/lib/concepts";
import { getAllExamParams, getExamYearParams } from "@/lib/exam-questions";
import { PUBLIC_SERVICE_SUBJECT_IDS, getPublicServiceExamSessions, getPublicServiceSubject } from "@/lib/public-service-content";

/** 검색 노출 대상 정적 공개 페이지 */
const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${SITE_URL}/real-estate`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/public-service`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/faq`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/privacy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
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
  {
    url: `${SITE_URL}/ranks`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/news`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.4,
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
  // /exam·/concepts 허브는 / 로 영구 리다이렉트 — sitemap에는 과목·문항만.

  const subjectUrls: MetadataRoute.Sitemap = EXAM_SUBJECTS.map((s) => ({
    url: `${SITE_URL}/exam/${s.value}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const yearUrls: MetadataRoute.Sitemap = getExamYearParams().map(({ subject, year }) => ({
    url: `${SITE_URL}/exam/${subject}/${year}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const questionUrls: MetadataRoute.Sitemap = getAllExamParams().map(({ subject, year, no }) => ({
    url: `${SITE_URL}/exam/${subject}/${year}/${no}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...subjectUrls, ...yearUrls, ...questionUrls];
}

/** 기출 all-in-one 개념(/concepts) — 정적 데이터 순회 */
function getConceptUrls(): MetadataRoute.Sitemap {
  const now = new Date();

  const subjectUrls: MetadataRoute.Sitemap = EXAM_SUBJECTS.map((s) => ({
    url: `${SITE_URL}/concepts/${s.value}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const detailUrls: MetadataRoute.Sitemap = getAllConceptParams().map(({ subject, slug }) => ({
    url: `${SITE_URL}/concepts/${subject}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...subjectUrls, ...detailUrls];
}

function getPublicServiceUrls(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [];
  for (const subjectId of PUBLIC_SERVICE_SUBJECT_IDS) {
    const subject = getPublicServiceSubject(subjectId);
    if (!subject) continue;
    urls.push(
      { url: `${SITE_URL}/public-service/concepts/${subjectId}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
      { url: `${SITE_URL}/public-service/exam/${subjectId}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    );
    for (const concept of subject.concepts) {
      urls.push({ url: `${SITE_URL}/public-service/concepts/${subjectId}/${concept.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
    }
    for (const session of getPublicServiceExamSessions(subjectId)) {
      urls.push({ url: `${SITE_URL}/public-service/exam/${subjectId}/${session.year}/${session.sourceCode}`, lastModified: now, changeFrequency: "monthly", priority: 0.6 });
    }
    for (const exam of subject.exams) {
      urls.push({ url: `${SITE_URL}/public-service/exam/${subjectId}/${exam.year}/${exam.sourceCode}/${exam.questionNo}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 });
    }
  }
  return urls;
}

async function getPublicContentUrls(): Promise<MetadataRoute.Sitemap> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, category, updated_at")
    .not("category", "in", "(bug,feedback)")
    .order("updated_at", { ascending: false })
    .limit(5000);

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
  return [...STATIC_PAGES, ...getConceptUrls(), ...getExamUrls(), ...getPublicServiceUrls(), ...contentUrls];
}
