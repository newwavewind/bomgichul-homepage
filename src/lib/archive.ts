import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { POSTS_PER_PAGE } from "@/lib/constants";
import type { SortOption } from "@/lib/constants";
import type { PaginatedResult, Post, ArchiveListItem } from "@/types/database";

const emptyPaginated = (page: number): PaginatedResult<ArchiveListItem> => ({
  data: [],
  total: 0,
  page,
  pageSize: POSTS_PER_PAGE,
  totalPages: 0,
});

interface GetArchiveOptions {
  page?: number;
  search?: string;
  sort?: SortOption;
  resourceType?: string;
  subject?: string;
}

export async function getArchivePosts({
  page = 1,
  search = "",
  sort = "latest",
  resourceType = "all",
  subject = "all",
}: GetArchiveOptions = {}): Promise<PaginatedResult<ArchiveListItem>> {
  if (!isSupabaseConfigured()) {
    return emptyPaginated(page);
  }

  const supabase = await createClient();
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  let query = supabase
    .from("posts")
    .select(
      "id, author_id, category, title, view_count, subject, resource_type, created_at, profiles:profiles!posts_author_id_fkey(nickname), post_attachments(id, file_name, file_size, mime_type)",
      { count: "planned" }
    )
    .eq("category", "resource");

  if (resourceType !== "all") {
    query = query.eq("resource_type", resourceType);
  }

  if (subject !== "all") {
    query = query.eq("subject", subject);
  }

  if (search.trim()) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  if (sort === "popular") {
    query = query.order("view_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    console.error("Failed to fetch archive:", error.message);
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
      subject: row.subject,
      resource_type: row.resource_type,
      created_at: row.created_at,
      profiles: profile ? { nickname: profile.nickname } : undefined,
      post_attachments: row.post_attachments ?? [],
    } satisfies ArchiveListItem;
  });

  return {
    data: rows,
    total,
    page,
    pageSize: POSTS_PER_PAGE,
    totalPages: Math.ceil(total / POSTS_PER_PAGE),
  };
}

export async function getArchivePost(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles:profiles!posts_author_id_fkey(nickname, avatar_url), post_attachments(*)")
    .eq("id", id)
    .eq("category", "resource")
    .single();

  if (error) return null;
  return data as Post;
}
