import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Notification } from "@/types/database";

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createClient();
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .is("read_at", null);

  return count ?? 0;
}

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select(
      "*, actor:profiles!notifications_actor_id_fkey(nickname, avatar_url), post:posts!notifications_post_id_fkey(title)"
    )
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (data as Notification[]) ?? [];
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
