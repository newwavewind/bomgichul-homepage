import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";
import { ARCHIVE_SUBJECTS, EXAM_SUBJECTS, SITE_URL } from "@/lib/constants";
import { getAllConceptParams } from "@/lib/concepts";
import { getAllExamParams, getExamYearParams } from "@/lib/exam-questions";
import {
  PUBLIC_SERVICE_SUBJECT_IDS,
  getPublicServiceExamSessions,
  getPublicServiceSubject,
} from "@/lib/public-service-content";
import {
  POLICE_SUBJECT_IDS,
  getPoliceExamSessions,
  getPoliceSubject,
} from "@/lib/police-content";
import {
  HOUSING_SUBJECT_IDS,
  getHousingExamSessions,
  getHousingSubject,
} from "@/lib/housing-content";
import {
  SOCIAL_WORKER_SUBJECT_IDS,
  getSocialWorkerExamSessions,
  getSocialWorkerSubject,
} from "@/lib/social-worker-content";
import {
  ENGLISH_SUBJECT_IDS,
  getEnglishExamSessions,
  getEnglishSubject,
} from "@/lib/english-content";
import {
  HISTORY_SUBJECT_IDS,
  getHistoryExamSessions,
  getHistorySubject,
} from "@/lib/history-content";
import {
  archiveBaseHref,
  communityBaseHref,
  isValidCommunityScope,
} from "@/lib/exam-track/community";
import { isRenderableExam } from "@/lib/exam-track/exam-render";
import type { ExamTrackExam } from "@/lib/exam-track/types";
import type { CommunityScope } from "@/types/database";

type SitemapEntry = MetadataRoute.Sitemap[number];
type ExamRenderCheck = Pick<ExamTrackExam, "kind" | "stem" | "prompt" | "blanks">;

export const SITEMAP_GROUPS = [
  "core",
  "real-estate",
  "public-service",
  "police",
  "housing",
  "social-worker",
  "history",
  "english",
] as const;

export type SitemapGroup = (typeof SITEMAP_GROUPS)[number];

const GROUP_SCOPE: Partial<Record<SitemapGroup, CommunityScope>> = {
  "real-estate": "real_estate",
  "public-service": "public_service",
  police: "police",
  housing: "housing",
  "social-worker": "social_worker",
  history: "history",
  english: "english",
};

function page(
  path: string,
  changeFrequency: SitemapEntry["changeFrequency"],
  priority: number,
): SitemapEntry {
  return {
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  };
}

const CORE_PAGES: MetadataRoute.Sitemap = [
  page("/", "weekly", 1),
  page("/privacy", "yearly", 0.3),
  page("/ranks", "monthly", 0.7),
  page("/news", "daily", 0.5),
  page("/guide", "monthly", 0.5),
];

const REAL_ESTATE_PAGES: MetadataRoute.Sitemap = [
  page("/real-estate", "weekly", 0.9),
  page("/real-estate/intro", "monthly", 0.85),
  page("/community", "daily", 0.9),
  page("/archive", "daily", 0.9),
  page("/diary", "daily", 0.6),
  page("/faq", "monthly", 0.8),
  ...ARCHIVE_SUBJECTS.filter((subject) => subject.value !== "all" && subject.value !== "other").map(
    (subject) => page(`/subjects/${subject.value}`, "weekly", 0.7),
  ),
];

function getTrackPublicPages(basePath: string, includeConceptHub = false): MetadataRoute.Sitemap {
  return [
    page(basePath, "weekly", 0.9),
    page(`${basePath}/intro`, "monthly", 0.85),
    ...(includeConceptHub ? [page(`${basePath}/concepts`, "weekly", 0.8)] : []),
    page(`${basePath}/community`, "daily", 0.8),
    page(`${basePath}/archive`, "daily", 0.7),
    page(`${basePath}/diary`, "daily", 0.6),
    page(`${basePath}/faq`, "monthly", 0.6),
  ];
}

/** 공인중개사 기출문제 해설 — 정적 데이터 순회 */
function getRealEstateExamUrls(): MetadataRoute.Sitemap {
  const subjectUrls: MetadataRoute.Sitemap = EXAM_SUBJECTS.map((subject) => ({
    url: `${SITE_URL}/exam/${subject.value}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const yearUrls: MetadataRoute.Sitemap = getExamYearParams().map(({ subject, year }) => ({
    url: `${SITE_URL}/exam/${subject}/${year}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  const questionUrls: MetadataRoute.Sitemap = getAllExamParams().map(({ subject, year, no }) => ({
    url: `${SITE_URL}/exam/${subject}/${year}/${no}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  return [...subjectUrls, ...yearUrls, ...questionUrls];
}

function getRealEstateConceptUrls(): MetadataRoute.Sitemap {
  const subjectUrls: MetadataRoute.Sitemap = EXAM_SUBJECTS.map((subject) => ({
    url: `${SITE_URL}/concepts/${subject.value}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const detailUrls: MetadataRoute.Sitemap = getAllConceptParams().map(({ subject, slug }) => ({
    url: `${SITE_URL}/concepts/${subject}/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...subjectUrls, ...detailUrls];
}

function getNamespacedTrackUrls(
  basePath: string,
  subjectIds: string[],
  getSubject: (id: string) => {
    concepts: { slug: string }[];
    exams: (ExamRenderCheck & {
      year: number;
      sourceCode: string;
      questionNo: number;
    })[];
  } | null,
  getSessions: (id: string) => { year: number; sourceCode: string }[],
  { includeConcepts = true }: { includeConcepts?: boolean } = {},
): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  for (const subjectId of subjectIds) {
    const subject = getSubject(subjectId);
    if (!subject) continue;

    if (includeConcepts) {
      urls.push(page(`${basePath}/concepts/${subjectId}`, "weekly", 0.7));
      for (const concept of subject.concepts) {
        urls.push(page(`${basePath}/concepts/${subjectId}/${concept.slug}`, "monthly", 0.6));
      }
    }

    urls.push(page(`${basePath}/exam/${subjectId}`, "weekly", 0.7));
    for (const session of getSessions(subjectId)) {
      urls.push(
        page(
          `${basePath}/exam/${subjectId}/${session.year}/${session.sourceCode}`,
          "monthly",
          0.6,
        ),
      );
    }
    for (const exam of subject.exams) {
      if (!isRenderableExam(exam)) continue;
      urls.push(
        page(
          `${basePath}/exam/${subjectId}/${exam.year}/${exam.sourceCode}/${exam.questionNo}`,
          "monthly",
          0.5,
        ),
      );
    }
  }
  return urls;
}

function getTrackLearningUrls(group: Exclude<SitemapGroup, "core" | "real-estate">) {
  switch (group) {
    case "public-service":
      return getNamespacedTrackUrls(
        "/public-service",
        PUBLIC_SERVICE_SUBJECT_IDS,
        getPublicServiceSubject,
        getPublicServiceExamSessions,
      );
    case "police":
      return getNamespacedTrackUrls(
        "/police",
        POLICE_SUBJECT_IDS,
        getPoliceSubject,
        getPoliceExamSessions,
      );
    case "housing":
      return getNamespacedTrackUrls(
        "/housing",
        HOUSING_SUBJECT_IDS,
        getHousingSubject,
        getHousingExamSessions,
      );
    case "social-worker":
      return getNamespacedTrackUrls(
        "/social-worker",
        SOCIAL_WORKER_SUBJECT_IDS,
        getSocialWorkerSubject,
        getSocialWorkerExamSessions,
      );
    case "history":
      return getNamespacedTrackUrls(
        "/history",
        HISTORY_SUBJECT_IDS,
        getHistorySubject,
        getHistoryExamSessions,
        { includeConcepts: false },
      );
    case "english":
      return getNamespacedTrackUrls(
        "/english",
        ENGLISH_SUBJECT_IDS,
        getEnglishSubject,
        getEnglishExamSessions,
        { includeConcepts: false },
      );
  }
}

export function publicContentPath(post: {
  id: string;
  category: string;
  community_scope: string | null;
}): string {
  const scope = isValidCommunityScope(post.community_scope)
    ? (post.community_scope as CommunityScope)
    : "real_estate";
  const base = post.category === "resource" ? archiveBaseHref(scope) : communityBaseHref(scope);
  return `${base}/${post.id}`;
}

async function getPublicContentUrls(scope: CommunityScope): Promise<MetadataRoute.Sitemap> {
  if (!isSupabaseConfigured()) return [];

  const { url, key } = getSupabaseEnv();
  const supabase = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  let query = supabase
    .from("posts")
    .select("id, category, community_scope, updated_at")
    .not("category", "in", "(bug,feedback)")
    .order("updated_at", { ascending: false })
    .limit(5000);

  query =
    scope === "real_estate"
      ? query.or("community_scope.eq.real_estate,community_scope.is.null")
      : query.eq("community_scope", scope);

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((post) => ({
    url: `${SITE_URL}${publicContentPath(post)}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
}

function uniqueEntries(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}

export function buildStaticSitemapGroup(group: SitemapGroup): MetadataRoute.Sitemap {
  if (group === "core") return CORE_PAGES;

  if (group === "real-estate") {
    return uniqueEntries([
      ...REAL_ESTATE_PAGES,
      ...getRealEstateConceptUrls(),
      ...getRealEstateExamUrls(),
    ]);
  }

  const publicPages = getTrackPublicPages(`/${group}`, group === "history");
  return uniqueEntries([...publicPages, ...getTrackLearningUrls(group)]);
}

export async function buildSitemapGroup(group: SitemapGroup): Promise<MetadataRoute.Sitemap> {
  const staticEntries = buildStaticSitemapGroup(group);
  const scope = GROUP_SCOPE[group];
  const publicContent = scope ? await getPublicContentUrls(scope) : [];
  return uniqueEntries([...staticEntries, ...publicContent]);
}

export function sitemapChildUrl(group: SitemapGroup): string {
  return `${SITE_URL}/sitemaps/${group}.xml`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function formatLastModified(value: SitemapEntry["lastModified"]): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function renderSitemap(entries: MetadataRoute.Sitemap): string {
  const body = entries
    .map((entry) => {
      const lastModified = formatLastModified(entry.lastModified);
      return [
        "  <url>",
        `    <loc>${escapeXml(entry.url)}</loc>`,
        ...(lastModified ? [`    <lastmod>${lastModified}</lastmod>`] : []),
        ...(entry.changeFrequency
          ? [`    <changefreq>${entry.changeFrequency}</changefreq>`]
          : []),
        ...(entry.priority != null ? [`    <priority>${entry.priority}</priority>`] : []),
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function renderSitemapIndex(): string {
  const body = SITEMAP_GROUPS.map(
    (group) => `  <sitemap>\n    <loc>${escapeXml(sitemapChildUrl(group))}</loc>\n  </sitemap>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

export const SITEMAP_RESPONSE_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
} as const;
