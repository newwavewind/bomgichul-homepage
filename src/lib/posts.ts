import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { POSTS_PER_PAGE } from "@/lib/constants";
import type { SortOption } from "@/lib/constants";
import type { PaginatedResult, Post, PostListItem, CommunityListFilter } from "@/types/database";
import { BEST_BOARD_CATEGORIES, BEST_POST_MIN_VIEWS } from "@/lib/constants";

const emptyPaginated = (page: number): PaginatedResult<PostListItem> => ({
  data: [],
  total: 0,
  page,
  pageSize: POSTS_PER_PAGE,
  totalPages: 0,
});

interface GetPostsOptions {
  page?: number;
  category?: CommunityListFilter;
  search?: string;
  sort?: SortOption;
  authorId?: string;
}

export async function getPosts({
  page = 1,
  category = "all",
  search = "",
  sort = "latest",
  authorId,
}: GetPostsOptions = {}): Promise<PaginatedResult<PostListItem>> {
  if (!isSupabaseConfigured()) {
    return emptyPaginated(page);
  }

  const supabase = createPublicClient();
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  let query = supabase
    .from("posts")
    .select(
      "id, author_id, category, title, view_count, created_at, profiles(nickname)",
      { count: "planned" }
    );

  if (category === "best") {
    query = query
      .in("category", BEST_BOARD_CATEGORIES)
      .gte("view_count", BEST_POST_MIN_VIEWS)
      .order("view_count", { ascending: false })
      .order("created_at", { ascending: false });
  } else if (category !== "all") {
    query = query.eq("category", category);
  }

  if (search.trim()) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  if (authorId) {
    query = query.eq("author_id", authorId);
  }

  if (category !== "best") {
    if (sort === "popular") {
      query = query.order("view_count", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("Failed to fetch posts:", error.message);
    return emptyPaginated(page);
  }

  const total = count ?? 0;

  const rows = (data ?? []).map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      author_id: row.author_id,
      category: row.category,
      title: row.title,
      view_count: row.view_count,
      created_at: row.created_at,
      profiles: profile ? { nickname: profile.nickname } : undefined,
    } satisfies PostListItem;
  });

  return {
    data: rows,
    total,
    page,
    pageSize: POSTS_PER_PAGE,
    totalPages: Math.ceil(total / POSTS_PER_PAGE),
  };
}

export async function getPost(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createPublicClient();

  // 첨부 포함 조회
  const withFiles = await supabase
    .from("posts")
    .select("*, profiles(nickname, avatar_url), post_attachments(*)")
    .eq("id", id)
    .maybeSingle();

  if (!withFiles.error && withFiles.data) {
    return withFiles.data as Post;
  }

  // 관계 조회 실패 시 본문만이라도 표시 (로그인 없이 피드백/오류글 열람)
  const basic = await supabase
    .from("posts")
    .select("*, profiles(nickname, avatar_url)")
    .eq("id", id)
    .maybeSingle();

  if (basic.error) {
    console.error("Failed to fetch post:", basic.error.message);
    return null;
  }

  if (!basic.data) return null;
  return { ...basic.data, post_attachments: [] } as Post;
}

export async function incrementViewCount(id: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = createPublicClient();
  const { error } = await supabase.rpc("increment_post_view", {
    post_id: id,
  });

  // RPC 미적용 환경에서는 조용히 무시 (열람은 계속 가능)
  if (error) {
    console.error("Failed to increment view count:", error.message);
  }
}

export async function getComments(postId: string) {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles(nickname, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) return [];
  return data ?? [];
}

export async function getCommentCount(postId: string) {
  if (!isSupabaseConfigured()) return 0;

  const supabase = createPublicClient();
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  return count ?? 0;
}
