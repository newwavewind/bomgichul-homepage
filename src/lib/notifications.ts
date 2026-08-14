import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  communityBaseHref,
  isValidCommunityScope,
} from "@/lib/exam-track/community";
import type { Notification } from "@/types/database";

export async function getUnreadNotificationCount(
  userId: string,
): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .is("read_at", null);

  return count ?? 0;
}

export async function getNotificationsForUser(
  userId: string,
): Promise<Notification[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select(
      "*, actor:profiles!notifications_actor_id_fkey(nickname, avatar_url), post:posts!notifications_post_id_fkey(title, community_scope), memo:question_public_memos!notifications_memo_id_fkey(subject, year, question_no)",
    )
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data as Notification[]) ?? [];
}

export function notificationHref(notification: Notification): string {
  if (notification.type !== "memo_comment" || !notification.memo) {
    const scope = isValidCommunityScope(notification.post?.community_scope)
      ? notification.post.community_scope
      : "real_estate";
    return `${communityBaseHref(scope)}/${notification.post_id}`;
  }

  const { subject, year, question_no: questionNo } = notification.memo;
  const [scope, subjectId, sourceCode] = subject.split(":");
  const anchor = notification.memo_id ? `#memo-${notification.memo_id}` : "";

  if (!subjectId || !sourceCode) {
    return `/exam/${subject}/${year}/${questionNo}${anchor}`;
  }

  const routeScope =
    scope === "public_service"
      ? "public-service"
      : scope === "social_worker"
        ? "social-worker"
        : scope;
  return `/${routeScope}/exam/${subjectId}/${year}/${encodeURIComponent(sourceCode)}/${questionNo}${anchor}`;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_id", userId)
    .is("read_at", null);
}
