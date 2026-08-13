import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ARCHIVE_SUBJECTS, EXAM_SUBJECTS, SITE_URL } from "@/lib/constants";
import { getAllConceptParams } from "@/lib/concepts";
import { getAllExamParams, getExamYearParams } from "@/lib/exam-questions";
import { PUBLIC_SERVICE_SUBJECT_IDS, getPublicServiceExamSessions, getPublicServiceSubject } from "@/lib/public-service-content";
import { POLICE_SUBJECT_IDS, getPoliceExamSessions, getPoliceSubject } from "@/lib/police-content";
import { HOUSING_SUBJECT_IDS, getHousingExamSessions, getHousingSubject } from "@/lib/housing-content";
import { SOCIAL_WORKER_SUBJECT_IDS, getSocialWorkerExamSessions, getSocialWorkerSubject } from "@/lib/social-worker-content";
import { communityBaseHref, isValidCommunityScope } from "@/lib/exam-track/community";
import { isRenderableExam } from "@/lib/exam-track/exam-render";
import type { ExamTrackExam } from "@/lib/exam-track/types";

type ExamRenderCheck = Pick<ExamTrackExam, "kind" | "stem" | "prompt" | "blanks">;
import type { CommunityScope } from "@/types/database";

/** 검색 노출 대상 정적 공개 페이지 */
const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: `${SITE_URL}/real-estate`,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/public-service`,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/police`,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/housing`,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/social-worker`,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/faq`,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/privacy`,
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${SITE_URL}/community`,
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/public-service/community`,
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/police/community`,
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/housing/community`,
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/social-worker/community`,
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/archive`,
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/ranks`,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/news`,
    changeFrequency: "daily",
    priority: 0.4,
  },
  ...ARCHIVE_SUBJECTS.filter((s) => s.value !== "all" && s.value !== "other").map(
    (s) => ({
      url: `${SITE_URL}/subjects/${s.value}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  ),
];

/** 기출문제 해설(/exam) — 정적 데이터 순회, Supabase 불필요 */
function getExamUrls(): MetadataRoute.Sitemap {
  // /exam·/concepts 허브는 / 로 영구 리다이렉트 — sitemap에는 과목·문항만.

  const subjectUrls: MetadataRoute.Sitemap = EXAM_SUBJECTS.map((s) => ({
    url: `${SITE_URL}/exam/${s.value}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const yearUrls: MetadataRoute.Sitemap = getExamYearParams().map(({ subject, year }) => ({
    url: `${SITE_URL}/exam/${subject}/${year}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const questionUrls: MetadataRoute.Sitemap = getAllExamParams().map(({ subject, year, no }) => ({
    url: `${SITE_URL}/exam/${subject}/${year}/${no}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...subjectUrls, ...yearUrls, ...questionUrls];
}

/** 기출 all-in-one 개념(/concepts) — 정적 데이터 순회 */
function getConceptUrls(): MetadataRoute.Sitemap {
  const subjectUrls: MetadataRoute.Sitemap = EXAM_SUBJECTS.map((s) => ({
    url: `${SITE_URL}/concepts/${s.value}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const detailUrls: MetadataRoute.Sitemap = getAllConceptParams().map(({ subject, slug }) => ({
    url: `${SITE_URL}/concepts/${subject}/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...subjectUrls, ...detailUrls];
}

function getNamespacedTrackUrls(
  basePath: string,
  subjectIds: string[],
  getSubject: (id: string) => {
    concepts: { slug: string }[];
    exams: (ExamRenderCheck & { year: number; sourceCode: string; questionNo: number })[];
  } | null,
  getSessions: (id: string) => { year: number; sourceCode: string }[],
): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  for (const subjectId of subjectIds) {
    const subject = getSubject(subjectId);
    if (!subject) continue;
    urls.push(
      { url: `${SITE_URL}${basePath}/concepts/${subjectId}`, changeFrequency: "weekly", priority: 0.7 },
      { url: `${SITE_URL}${basePath}/exam/${subjectId}`, changeFrequency: "weekly", priority: 0.7 },
    );
    for (const concept of subject.concepts) {
      urls.push({
        url: `${SITE_URL}${basePath}/concepts/${subjectId}/${concept.slug}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const session of getSessions(subjectId)) {
      urls.push({
        url: `${SITE_URL}${basePath}/exam/${subjectId}/${session.year}/${session.sourceCode}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const exam of subject.exams) {
      // 상세 라우트가 404 로 처리하는 레코드는 sitemap 에도 싣지 않는다 (같은 helper 사용).
      if (!isRenderableExam(exam)) continue;
      urls.push({
        url: `${SITE_URL}${basePath}/exam/${subjectId}/${exam.year}/${exam.sourceCode}/${exam.questionNo}`,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }
  return urls;
}

function getPublicServiceUrls(): MetadataRoute.Sitemap {
  return getNamespacedTrackUrls(
    "/public-service",
    PUBLIC_SERVICE_SUBJECT_IDS,
    getPublicServiceSubject,
    getPublicServiceExamSessions,
  );
}

function getPoliceUrls(): MetadataRoute.Sitemap {
  return getNamespacedTrackUrls("/police", POLICE_SUBJECT_IDS, getPoliceSubject, getPoliceExamSessions);
}

function getHousingUrls(): MetadataRoute.Sitemap {
  return getNamespacedTrackUrls("/housing", HOUSING_SUBJECT_IDS, getHousingSubject, getHousingExamSessions);
}

function getSocialWorkerUrls(): MetadataRoute.Sitemap {
  return getNamespacedTrackUrls(
    "/social-worker",
    SOCIAL_WORKER_SUBJECT_IDS,
    getSocialWorkerSubject,
    getSocialWorkerExamSessions,
  );
}

async function getPublicContentUrls(): Promise<MetadataRoute.Sitemap> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, category, community_scope, updated_at")
    .not("category", "in", "(bug,feedback)")
    .order("updated_at", { ascending: false })
    .limit(5000);

  if (error || !data) return [];

  return data.map((post) => {
    const scope = isValidCommunityScope(post.community_scope)
      ? (post.community_scope as CommunityScope)
      : "real_estate";
    return {
      url:
        post.category === "resource"
          ? `${SITE_URL}/archive/${post.id}`
          : `${SITE_URL}${communityBaseHref(scope)}/${post.id}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contentUrls = await getPublicContentUrls();
  return [
    ...STATIC_PAGES,
    ...getConceptUrls(),
    ...getExamUrls(),
    ...getPublicServiceUrls(),
    ...getPoliceUrls(),
    ...getHousingUrls(),
    ...getSocialWorkerUrls(),
    ...contentUrls,
  ];
}
