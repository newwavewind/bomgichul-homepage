import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { DmConversationPreview, DmMessage } from "@/types/database";

type ProfileSnippet = { nickname: string; avatar_url: string | null };

type MemberRow = {
  conversation_id: string;
  user_id: string;
  profiles: ProfileSnippet | ProfileSnippet[] | null;
};

type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

function pickProfile(
  profiles: ProfileSnippet | ProfileSnippet[] | null | undefined
): ProfileSnippet {
  if (Array.isArray(profiles)) return profiles[0] ?? { nickname: "익명", avatar_url: null };
  return profiles ?? { nickname: "익명", avatar_url: null };
}

export async function getDmConversations(
  userId: string
): Promise<DmConversationPreview[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data: memberships, error: memberError } = await supabase
    .from("dm_conversation_members")
    .select("conversation_id, last_read_at")
    .eq("user_id", userId);

  if (memberError || !memberships?.length) return [];

  const convIds = memberships.map((m) => m.conversation_id);
  const lastReadByConv = Object.fromEntries(
    memberships.map((m) => [m.conversation_id, m.last_read_at])
  );

  const [{ data: members }, { data: messages }, { data: conversations }] =
    await Promise.all([
      supabase
        .from("dm_conversation_members")
        .select("conversation_id, user_id, profiles:user_id (nickname, avatar_url)")
        .in("conversation_id", convIds),
      supabase
        .from("dm_messages")
        .select("id, conversation_id, sender_id, content, created_at")
        .in("conversation_id", convIds)
        .order("created_at", { ascending: false }),
      supabase
        .from("dm_conversations")
        .select("id, updated_at")
        .in("id", convIds),
    ]);

  const lastMessageByConv = new Map<string, MessageRow>();
  for (const msg of (messages ?? []) as MessageRow[]) {
    if (!lastMessageByConv.has(msg.conversation_id)) {
      lastMessageByConv.set(msg.conversation_id, msg);
    }
  }

  const updatedAtByConv = Object.fromEntries(
    (conversations ?? []).map((c) => [c.id, c.updated_at as string])
  );

  const previews: DmConversationPreview[] = convIds
    .map((conversationId) => {
      const convMembers = ((members ?? []) as MemberRow[]).filter(
        (m) => m.conversation_id === conversationId
      );
      const other = convMembers.find((m) => m.user_id !== userId);
      if (!other) return null;

      const lastMessage = lastMessageByConv.get(conversationId) ?? null;
      const lastReadAt = lastReadByConv[conversationId] ?? new Date(0).toISOString();
      const unreadCount =
        lastMessage &&
        lastMessage.sender_id !== userId &&
        lastMessage.created_at > lastReadAt
          ? 1
          : 0;

      return {
        id: conversationId,
        otherUser: {
          id: other.user_id,
          ...pickProfile(other.profiles),
        },
        lastMessage,
        unreadCount,
        updatedAt: updatedAtByConv[conversationId] ?? lastMessage?.created_at ?? "",
      };
    })
    .filter((row): row is DmConversationPreview => row !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return previews;
}

export async function getDmMessages(
  userId: string,
  conversationId: string,
  limit = 200
): Promise<DmMessage[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data: membership } = await supabase
    .from("dm_conversation_members")
    .select("conversation_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!membership) return [];

  const { data, error } = await supabase
    .from("dm_messages")
    .select(
      `
      id,
      conversation_id,
      sender_id,
      content,
      created_at,
      profiles:sender_id (nickname, avatar_url)
    `
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    conversation_id: row.conversation_id,
    sender_id: row.sender_id,
    content: row.content,
    created_at: row.created_at,
    author: pickProfile(
      row.profiles as ProfileSnippet | ProfileSnippet[] | null | undefined
    ),
  }));
}

export async function getDmUnreadCount(userId: string): Promise<number> {
  const conversations = await getDmConversations(userId);
  return conversations.reduce((sum, c) => sum + c.unreadCount, 0);
}
