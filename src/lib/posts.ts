import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { POSTS_PER_PAGE } from "@/lib/constants";
import type { SortOption } from "@/lib/constants";
import type { PaginatedResult, Post, PostCategory } from "@/types/database";

const emptyPaginated = (page: number): PaginatedResult<Post> => ({
  data: [],
  total: 0,
  page,
  pageSize: POSTS_PER_PAGE,
  totalPages: 0,
});

interface GetPostsOptions {
  page?: number;
  category?: PostCategory | "all";
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
}: GetPostsOptions = {}): Promise<PaginatedResult<Post>> {
  if (!isSupabaseConfigured()) {
    return emptyPaginated(page);
  }

  const supabase = await createClient();
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  let query = supabase
    .from("posts")
    .select("*, profiles(nickname, avatar_url)", { count: "exact" });

  if (category !== "all") {
    query = query.eq("category", category);
  }

  if (search.trim()) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  if (authorId) {
    query = query.eq("author_id", authorId);
  }

  if (sort === "popular") {
    query = query.order("view_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("Failed to fetch posts:", error.message);
    return emptyPaginated(page);
  }

  const total = count ?? 0;

  return {
    data: (data as Post[]) ?? [],
    total,
    page,
    pageSize: POSTS_PER_PAGE,
    totalPages: Math.ceil(total / POSTS_PER_PAGE),
  };
}

export async function getPost(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles(nickname, avatar_url), post_attachments(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Post;
}

export async function incrementViewCount(id: string) {
  if (!isSupabaseConfigured()) return;

  const supabase = await createClient();
  const post = await getPost(id);
  if (!post) return;

  await supabase
    .from("posts")
    .update({ view_count: post.view_count + 1 })
    .eq("id", id);
}

export async function getComments(postId: string) {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
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

  const supabase = await createClient();
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  return count ?? 0;
}
