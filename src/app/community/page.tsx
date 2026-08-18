import { Suspense } from "react";
import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import { PostCard } from "@/components/board/PostCard";
import { CategoryFilter } from "@/components/board/CategoryFilter";
import { Pagination } from "@/components/board/Pagination";
import { SearchBar, SortSelect } from "@/components/board/SearchBar";
import { PrimaryButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import { AppStoreButtons } from "@/components/ui/AppStoreButtons";
import type { CommunityListFilter, CommunityScope } from "@/types/database";
import type { SortOption } from "@/lib/constants";
import { BEST_POST_MIN_VIEWS, CATEGORY_MAP, appStoreLinksForScope } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import { getUserActivityScores } from "@/lib/activity";
import { communityBaseHref, communityTitle } from "@/lib/exam-track/community";
import { CommunityHubNav } from "@/components/community/CommunityHubNav";

interface CommunityPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    q?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: CommunityPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const category = (params.category as CommunityListFilter) || "all";
  const search = params.q?.trim() ?? "";

  let title = "공인중개사 수험생 커뮤니티";
  if (category === "best") {
    title = "베스트 글 | 공인중개사 수험생 커뮤니티";
  } else if (category !== "all") {
    title = `${CATEGORY_MAP[category]} | 공인중개사 수험생 커뮤니티`;
  }
  if (page > 1) title = `${title} ${page}페이지`;

  const description =
    category === "best"
      ? `조회수 ${BEST_POST_MIN_VIEWS}회 이상 인기 게시글을 모았습니다. 공인중개사 수험생 질문·합격후기·수험정보를 확인하세요.`
      : "공인중개사 수험생 커뮤니티. 자유게시판, 질문, 자료공유, 수험정보, 합격후기를 나눠보세요.";

  const isAppOnlyCategory = category === "bug" || category === "feedback";

  return buildPageMetadata({
    title,
    description,
    path: "/community",
    canonicalParams: { category: category === "all" ? undefined : category, page },
    noIndex: Boolean(search) || isAppOnlyCategory,
  });
}

export async function CommunityBoard({
  searchParams,
  scope = "real_estate",
}: CommunityPageProps & { scope?: CommunityScope }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const category = (params.category as CommunityListFilter) || "all";
  const search = params.q ?? "";
  const sort = (params.sort as SortOption) || "latest";

  const { data: posts, totalPages, total } = await getPosts({
    page,
    category,
    search,
    sort,
    scope,
  });
  const baseHref = communityBaseHref(scope);
  const boardTitle = communityTitle(scope);
  const authorActivity = await getUserActivityScores(posts.map((p) => p.author_id));

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <EyebrowLabel className="mb-2">함께 공부하는 사람들</EyebrowLabel>
            <SectionHeading as="h1">{boardTitle}</SectionHeading>
            <p className="mt-2 font-display text-body-sm text-smoke">
              {category === "best"
                ? `조회 ${BEST_POST_MIN_VIEWS}회 이상 인기 글 · 총 ${total}개`
                : `총 ${total}개의 게시글`}
              {search && ` · "${search}" 검색 결과`}
            </p>
          </div>
          <PrimaryButton href={`${baseHref}/write`}>글쓰기</PrimaryButton>
        </div>

        <CommunityHubNav scope={scope} />

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Suspense fallback={null}>
            <SearchBar defaultValue={search} basePath={baseHref} />
          </Suspense>
          {category !== "best" && (
            <Suspense fallback={null}>
              <SortSelect current={sort} basePath={baseHref} />
            </Suspense>
          )}
        </div>

        <div className="mb-8">
          <CategoryFilter current={category} baseHref={baseHref} />
        </div>

        <ElevatedCard className="overflow-hidden">
          {posts.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <p className="mb-2 font-display text-body text-smoke">
                {search
                  ? "검색 결과가 없어요"
                  : category === "best"
                    ? "아직 베스트 글 조건을 만족하는 게시글이 없어요"
                    : "아직 게시글이 없어요"}
              </p>
              <p className="font-display text-body-sm text-fog">
                {search
                  ? "다른 키워드로 검색해보세요."
                  : category === "best"
                    ? `조회수 ${BEST_POST_MIN_VIEWS}회 이상인 글이 이곳에 모여요.`
                    : "첫 번째 글을 작성해보세요!"}
              </p>
              <div className="mt-6">
                <PrimaryButton href={`${baseHref}/write`}>글쓰기</PrimaryButton>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                category={post.category}
                authorName={post.profiles?.nickname ?? "익명"}
                authorRank={authorActivity[post.author_id]?.rank}
                viewCount={post.view_count}
                commentCount={post.comment_count}
                createdAt={post.created_at}
                baseHref={baseHref}
              />
            ))
          )}
        </ElevatedCard>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          category={category}
          search={search}
          sort={sort}
          baseHref={baseHref}
        />

        <section
          aria-label="앱 설치 안내"
          className="mt-12 flex flex-col items-center gap-4 border-t border-mist pt-10 text-center"
        >
          <p className="font-display text-body-sm text-smoke">
            앱에서 특별한 모든 기능을 이용하세요. 기출 학습의 모든 것
          </p>
          <AppStoreButtons
            className="justify-center"
            size="sm"
            links={appStoreLinksForScope(scope)}
          />
        </section>
      </div>
    </div>
  );
}

export default async function CommunityPage(props: CommunityPageProps) {
  return <CommunityBoard {...props} />;
}
