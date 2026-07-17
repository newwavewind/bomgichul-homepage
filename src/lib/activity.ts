import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { getOceanRank, type OceanRank } from "@/lib/ocean-ranks";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type UserActivityScore = {
  userId: string;
  loginDays: number;
  postCount: number;
  commentCount: number;
  likesReceived: number;
  score: number;
  rank: OceanRank;
};

export type CommunityLikeState = {
  post: { count: number; likedByViewer: boolean };
  comments: Record<string, { count: number; likedByViewer: boolean }>;
};

function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function emptyActivity(userId: string): UserActivityScore {
  return {
    userId,
    loginDays: 0,
    postCount: 0,
    commentCount: 0,
    likesReceived: 0,
    score: 0,
    rank: getOceanRank(0),
  };
}

export async function getUserActivityScores(
  userIds: string[]
): Promise<Record<string, UserActivityScore>> {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  const fallback = Object.fromEntries(
    uniqueIds.map((userId) => [userId, emptyActivity(userId)])
  );

  if (!isSupabaseConfigured() || uniqueIds.length === 0) return fallback;

  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("get_user_activity_scores", {
    target_user_ids: uniqueIds,
  });

  if (error || !data) return fallback;

  for (const raw of data as Record<string, unknown>[]) {
    const userId = String(raw.user_id ?? "");
    if (!userId || !fallback[userId]) continue;

    const score = asNumber(raw.score);
    fallback[userId] = {
      userId,
      loginDays: asNumber(raw.login_days),
      postCount: asNumber(raw.post_count),
      commentCount: asNumber(raw.comment_count),
      likesReceived: asNumber(raw.likes_received),
      score,
      rank: getOceanRank(score),
    };
  }

  return fallback;
}

export async function getCommunityLikeState(
  postId: string,
  commentIds: string[],
  viewerUserId?: string | null
): Promise<CommunityLikeState> {
  const comments = Object.fromEntries(
    commentIds.map((id) => [id, { count: 0, likedByViewer: false }])
  );
  const fallback = { post: { count: 0, likedByViewer: false }, comments };

  if (!isSupabaseConfigured()) return fallback;

  const supabase = viewerUserId
    ? await createServerClient()
    : createPublicClient();
  const { data, error } = await supabase.rpc("get_community_like_state", {
    target_post_id: postId,
    target_comment_ids: commentIds,
  });

  if (error || !data) return fallback;

  for (const row of data as Record<string, unknown>[]) {
    const targetType = String(row.target_type ?? "");
    const targetId = String(row.target_id ?? "");
    const state = {
      count: asNumber(row.like_count),
      likedByViewer: Boolean(row.liked_by_viewer && viewerUserId),
    };

    if (targetType === "post") fallback.post = state;
    if (targetType === "comment" && fallback.comments[targetId]) {
      fallback.comments[targetId] = state;
    }
  }

  return fallback;
}
