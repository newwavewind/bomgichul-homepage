import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

/** 검색 노출 제외 (로그인·관리자·연습 모드 등) */
export const ROBOTS_NOINDEX: Metadata["robots"] = {
  index: false,
  follow: false,
};

/** 검색 결과·필터 조합 페이지 — 링크는 따라가되 색인하지 않음 */
export const ROBOTS_NOINDEX_FOLLOW: Metadata["robots"] = {
  index: false,
  follow: true,
};

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type CanonicalParamValue = string | number | undefined | null;

/**
 * 목록 페이지 canonical URL 생성.
 * page=1, sort=latest, all 필터 값은 생략합니다.
 */
export function buildCanonicalUrl(
  path: string,
  params?: Record<string, CanonicalParamValue>
): string {
  const url = new URL(path, SITE_URL);

  if (params) {
    for (const [key, raw] of Object.entries(params)) {
      if (raw == null || raw === "") continue;
      const value = String(raw);
      if (value === "all" || value === "latest") continue;
      if (key === "page" && Number(value) <= 1) continue;
      url.searchParams.set(key, value);
    }
  }

  const qs = url.searchParams.toString();
  return qs ? `${url.pathname}?${qs}` : url.pathname;
}

export function truncateDescription(text: string, max = 160): string {
  const trimmed = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  canonicalParams,
  robots,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  canonicalParams?: Record<string, CanonicalParamValue>;
  robots?: Metadata["robots"];
  noIndex?: boolean;
}): Metadata {
  const canonical = buildCanonicalUrl(path, canonicalParams);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const titleField: Metadata["title"] = title.includes(SITE_NAME)
    ? { absolute: title }
    : title;

  return {
    title: titleField,
    description,
    alternates: { canonical },
    robots: noIndex ? ROBOTS_NOINDEX_FOLLOW : robots,
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(canonical),
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildConceptLearningResourceJsonLd({
  title,
  description,
  path,
  subjectLabel,
}: {
  title: string;
  description: string;
  path: string;
  subjectLabel: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: title,
    description: truncateDescription(description, 500),
    url: absoluteUrl(path),
    inLanguage: "ko-KR",
    learningResourceType: "Concept",
    educationalLevel: "Professional certification",
    about: {
      "@type": "Thing",
      name: `공인중개사 ${subjectLabel}`,
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildConceptItemListJsonLd({
  subjectLabel,
  path,
  items,
}: {
  subjectLabel: string;
  path: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${subjectLabel} 기출 all-in-one 개념`,
    url: absoluteUrl(path),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/brand/whale-mark.png"),
    description: SITE_DESCRIPTION,
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["봄기출", "Bomgichul"],
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "ko-KR",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildPlatformHomeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "공무원·공인중개사·경찰·주택관리사 기출 학습",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "ko-KR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      name: "봄기출 시험별 학습",
      numberOfItems: 4,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "9급 공무원 국가직·지방직 기출 학습",
          url: absoluteUrl("/public-service"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "공인중개사 1·2차 기출 학습",
          url: absoluteUrl("/real-estate"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "경찰공무원 순경 공채 기출 학습",
          url: absoluteUrl("/police"),
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "주택관리사보 기출 학습",
          url: absoluteUrl("/housing"),
        },
      ],
    },
  };
}

export function buildPublicServiceLearningResourceJsonLd({
  name,
  description,
  path,
  learningResourceType,
  educationalLevel = "9급 공무원 시험",
  aboutName = "9급 공무원 국가직·지방직 시험",
}: {
  name: string;
  description: string;
  path: string;
  learningResourceType: "Course" | "Concept" | "Quiz";
  educationalLevel?: string;
  aboutName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description: truncateDescription(description, 500),
    url: absoluteUrl(path),
    inLanguage: "ko-KR",
    learningResourceType,
    educationalLevel,
    about: {
      "@type": "Thing",
      name: aboutName,
    },
    isAccessibleForFree: true,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** 기출 문항 Quiz 구조화 데이터 — 검색에서 문제·정답 맥락 노출에 도움 */
export function buildExamQuizJsonLd({
  title,
  description,
  path,
  subjectLabel,
  year,
  questionNo,
  stem,
  choices,
  correctChoice,
}: {
  title: string;
  description: string;
  path: string;
  subjectLabel: string;
  year: number;
  questionNo: number;
  stem: string;
  choices: { label: string; text: string; key: string }[];
  correctChoice: string;
}) {
  if (choices.length === 0) return null;

  const accepted = choices.find((c) => c.key === correctChoice);
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: title,
    description: truncateDescription(description, 300),
    url: absoluteUrl(path),
    inLanguage: "ko-KR",
    educationalLevel: "Professional certification",
    about: {
      "@type": "Thing",
      name: `공인중개사 ${subjectLabel}`,
    },
    hasPart: {
      "@type": "Question",
      name: `${year}년 ${subjectLabel} ${questionNo}번`,
      text: stem,
      educationalAlignment: {
        "@type": "AlignmentObject",
        alignmentType: "educationalSubject",
        targetName: subjectLabel,
      },
      ...(accepted
        ? {
            acceptedAnswer: {
              "@type": "Answer",
              text: `${accepted.label} ${accepted.text}`.trim(),
            },
          }
        : {}),
      suggestedAnswer: choices.map((c) => ({
        "@type": "Answer",
        text: `${c.label} ${c.text}`.trim(),
      })),
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
