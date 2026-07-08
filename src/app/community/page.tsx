import { Suspense } from "react";
import { getPosts } from "@/lib/posts";
import { getPremiumBadgesForUsers } from "@/lib/badges";
import { PostCard } from "@/components/board/PostCard";
import { CategoryFilter } from "@/components/board/CategoryFilter";
import { Pagination } from "@/components/board/Pagination";
import { SearchBar, SortSelect } from "@/components/board/SearchBar";
import { PrimaryButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard } from "@/components/ui/Card";
import type { PostCategory } from "@/types/database";
import type { SortOption } from "@/lib/constants";

interface CommunityPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const category = (params.category as PostCategory | "all") || "all";
  const search = params.q ?? "";
  const sort = (params.sort as SortOption) || "latest";

  const { data: posts, totalPages, total } = await getPosts({
    page,
    category,
    search,
    sort,
  });
  const authorBadges = await getPremiumBadgesForUsers(posts.map((p) => p.author_id));

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-[var(--page-max-width)]">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <EyebrowLabel className="mb-2">공인중개사 수험생들의 수다방</EyebrowLabel>
            <SectionHeading as="h1">공인중개사 커뮤니티</SectionHeading>
            <p className="mt-2 font-display text-body-sm text-smoke">
              총 {total}개의 게시글
              {search && ` · "${search}" 검색 결과`}
            </p>
          </div>
          <PrimaryButton href="/community/write">글쓰기</PrimaryButton>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Suspense fallback={null}>
            <SearchBar defaultValue={search} />
          </Suspense>
          <Suspense fallback={null}>
            <SortSelect current={sort} />
          </Suspense>
        </div>

        <div className="mb-8">
          <CategoryFilter current={category} />
        </div>

        <ElevatedCard className="overflow-hidden">
          {posts.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <p className="mb-2 font-display text-body text-smoke">
                {search ? "검색 결과가 없어요" : "아직 게시글이 없어요"}
              </p>
              <p className="font-display text-body-sm text-fog">
                {search ? "다른 키워드로 검색해보세요." : "첫 번째 글을 작성해보세요!"}
              </p>
              <div className="mt-6">
                <PrimaryButton href="/community/write">글쓰기</PrimaryButton>
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
                authorBadge={authorBadges[post.author_id]}
                viewCount={post.view_count}
                createdAt={post.created_at}
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
        />
      </div>
    </div>
  );
}
