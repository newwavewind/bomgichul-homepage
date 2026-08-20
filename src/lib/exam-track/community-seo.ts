import type { Metadata } from "next";
import { BEST_POST_MIN_VIEWS, CATEGORIES, CATEGORY_MAP } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import type { CommunityListFilter, CommunityScope } from "@/types/database";
import {
  communityBaseHref,
  communityScopeLabel,
  communityTitle,
} from "@/lib/exam-track/community";

export type CommunitySearchParams = Promise<{
  page?: string | string[];
  category?: string | string[];
  q?: string | string[];
  sort?: string | string[];
}>;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizeCategory(value: string): CommunityListFilter | null {
  if (value === "" || value === "all") return "all";
  if (value === "best") return "best";
  return Object.prototype.hasOwnProperty.call(CATEGORY_MAP, value)
    ? (value as CommunityListFilter)
    : null;
}

/**
 * 시험별 커뮤니티 필터가 서로 다른 검색 문서로 인식되도록 제목·설명·canonical을
 * 함께 만든다. 검색어·정렬·앱 전용 필터는 중복 색인을 막되 링크 탐색은 허용한다.
 */
export async function buildCommunityListMetadata({
  searchParams,
  scope,
}: {
  searchParams: CommunitySearchParams;
  scope: CommunityScope;
}): Promise<Metadata> {
  const params = await searchParams;
  const rawCategory = first(params.category);
  const category = normalizeCategory(rawCategory);
  const page = Math.max(1, Number(first(params.page)) || 1);
  const search = first(params.q).trim();
  const sort = first(params.sort) || "latest";
  const baseTitle = communityTitle(scope);
  const scopeLabel = communityScopeLabel(scope);

  let title = baseTitle;
  let description = `${baseTitle}. 자유게시판, 질문, 자료공유, 수험정보와 합격후기를 나눠보세요.`;

  if (category === "best") {
    title = `베스트 글 | ${baseTitle}`;
    description = `조회수 ${BEST_POST_MIN_VIEWS}회 이상인 ${scopeLabel} 수험생 인기 게시글입니다. 질문·합격후기·수험정보를 확인하세요.`;
  } else if (category && category !== "all") {
    const categoryLabel = CATEGORY_MAP[category];
    const categoryDescription =
      CATEGORIES.find((item) => item.value === category)?.description ??
      "수험생이 자유롭게 나누는 이야기";
    title = `${categoryLabel} | ${baseTitle}`;
    description = `${baseTitle}의 ${categoryLabel} 게시판입니다. ${categoryDescription} 관련 글을 확인하고 수험생들과 정보를 나눠보세요.`;
  }

  if (page > 1) {
    title = `${title} ${page}페이지`;
    description = `${description} 현재 ${page}페이지입니다.`;
  }

  const isAppOnlyCategory = category === "bug" || category === "feedback";
  const hasUnsupportedFilter = category === null;

  return buildPageMetadata({
    title,
    description,
    path: communityBaseHref(scope),
    canonicalParams: {
      category: category && category !== "all" ? category : undefined,
      page,
    },
    noIndex:
      Boolean(search) ||
      sort !== "latest" ||
      isAppOnlyCategory ||
      hasUnsupportedFilter,
  });
}
