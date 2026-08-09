import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ConceptCommunityComment, ConceptCommunityPost } from "@/types/database";

type ProfileSnippet = { nickname: string; avatar_url: string | null };

type PostRow = {
  id: string;
  user_id: string;
  subject: string;
  concept_slug: string;
  content: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  profiles: ProfileSnippet | ProfileSnippet[] | null;
  concept_community_post_likes: { user_id: string }[] | null;
  concept_community_post_recommends: { user_id: string }[] | null;
  concept_community_post_comments:
    | {
        id: string;
        post_id: string;
        user_id: string;
        content: string;
        created_at: string;
        profiles: ProfileSnippet | ProfileSnippet[] | null;
      }[]
    | null;
};

function pickProfile(
  profiles: ProfileSnippet | ProfileSnippet[] | null | undefined
): ProfileSnippet {
  if (Array.isArray(profiles)) return profiles[0] ?? { nickname: "익명", avatar_url: null };
  return profiles ?? { nickname: "익명", avatar_url: null };
}

export async function getConceptCommunityPosts(
  subject: string,
  conceptSlug: string,
  viewerUserId?: string | null
): Promise<ConceptCommunityPost[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concept_community_posts")
    .select(
      `
      id,
      user_id,
      subject,
      concept_slug,
      content,
      view_count,
      created_at,
      updated_at,
      profiles:user_id (nickname, avatar_url),
      concept_community_post_likes (user_id),
      concept_community_post_recommends (user_id),
      concept_community_post_comments (
        id,
        post_id,
        user_id,
        content,
        created_at,
        profiles:user_id (nickname, avatar_url)
      )
    `
    )
    .eq("subject", subject)
    .eq("concept_slug", conceptSlug)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as PostRow[]).map((row) => {
    const likes = row.concept_community_post_likes ?? [];
    const recommends = row.concept_community_post_recommends ?? [];
    const comments = (row.concept_community_post_comments ?? [])
      .slice()
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map(
        (c): ConceptCommunityComment => ({
          id: c.id,
          post_id: c.post_id,
          user_id: c.user_id,
          content: c.content,
          created_at: c.created_at,
          author: pickProfile(c.profiles),
        })
      );

    return {
      id: row.id,
      user_id: row.user_id,
      subject: row.subject,
      concept_slug: row.concept_slug,
      content: row.content,
      view_count: row.view_count ?? 0,
      created_at: row.created_at,
      updated_at: row.updated_at,
      author: pickProfile(row.profiles),
      like_count: likes.length,
      liked_by_viewer: viewerUserId
        ? likes.some((like) => like.user_id === viewerUserId)
        : false,
      recommend_count: recommends.length,
      recommended_by_viewer: viewerUserId
        ? recommends.some((item) => item.user_id === viewerUserId)
        : false,
      comments,
    };
  });
}
