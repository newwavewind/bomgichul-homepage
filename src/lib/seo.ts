import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

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

  return {
    title,
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
