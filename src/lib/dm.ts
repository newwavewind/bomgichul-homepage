import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type {
  ChatMember,
  DmAttachment,
  DmConversationPreview,
  DmMessage,
} from "@/types/database";

type ProfileSnippet = { nickname: string; avatar_url: string | null };

type MemberRow = {
  conversation_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  last_read_at?: string;
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
  profiles: ProfileSnippet | ProfileSnippet[] | null | undefined,
): ProfileSnippet {
  if (Array.isArray(profiles))
    return profiles[0] ?? { nickname: "익명", avatar_url: null };
  return profiles ?? { nickname: "익명", avatar_url: null };
}

export async function getDmConversations(
  userId: string,
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
    memberships.map((m) => [m.conversation_id, m.last_read_at]),
  );

  const [memberResult, messageResult, conversationResult] = await Promise.all([
    supabase
      .from("dm_conversation_members")
      .select(
        "conversation_id, user_id, role, last_read_at, profiles:user_id (nickname, avatar_url)",
      )
      .in("conversation_id", convIds),
    supabase
      .from("dm_messages")
      .select("id, conversation_id, sender_id, content, created_at")
      .in("conversation_id", convIds)
      .order("created_at", { ascending: false }),
    supabase
      .from("dm_conversations")
      .select("id, title, is_group, avatar_url, updated_at")
      .in("id", convIds),
  ]);

  // 마이그레이션 적용 전 미리보기에서도 기존 1:1 대화를 잃지 않는다.
  const members = memberResult.error
    ? (
        await supabase
          .from("dm_conversation_members")
          .select(
            "conversation_id, user_id, profiles:user_id (nickname, avatar_url)",
          )
          .in("conversation_id", convIds)
      ).data?.map((row) => ({ ...row, role: "member" as const }))
    : memberResult.data;
  const messages = messageResult.data;
  const conversations = conversationResult.error
    ? (
        await supabase
          .from("dm_conversations")
          .select("id, updated_at")
          .in("id", convIds)
      ).data?.map((row) => ({
        ...row,
        title: null,
        is_group: false,
        avatar_url: null,
      }))
    : conversationResult.data;

  const lastMessageByConv = new Map<string, MessageRow>();
  for (const msg of (messages ?? []) as MessageRow[]) {
    if (!lastMessageByConv.has(msg.conversation_id)) {
      lastMessageByConv.set(msg.conversation_id, msg);
    }
  }

  const updatedAtByConv = Object.fromEntries(
    (conversations ?? []).map((c) => [c.id, c.updated_at as string]),
  );
  const conversationById = Object.fromEntries(
    (conversations ?? []).map((c) => [c.id, c]),
  );

  const previews: DmConversationPreview[] = convIds
    .map((conversationId) => {
      const convMembers = ((members ?? []) as MemberRow[]).filter(
        (m) => m.conversation_id === conversationId,
      );
      const other = convMembers.find((m) => m.user_id !== userId);
      const conversation = conversationById[conversationId];
      if (!conversation || (!conversation.is_group && !other)) return null;

      const chatMembers: ChatMember[] = convMembers.map((member) => ({
        id: member.user_id,
        ...pickProfile(member.profiles),
        role: member.role,
        last_read_at: member.last_read_at,
      }));
      const otherProfile = other ? pickProfile(other.profiles) : null;

      const lastMessage = lastMessageByConv.get(conversationId) ?? null;
      const lastReadAt =
        lastReadByConv[conversationId] ?? new Date(0).toISOString();
      const unreadCount =
        lastMessage &&
        lastMessage.sender_id !== userId &&
        lastMessage.created_at > lastReadAt
          ? 1
          : 0;

      return {
        id: conversationId,
        title: conversation.is_group
          ? conversation.title || "그룹 채팅"
          : (otherProfile?.nickname ?? "대화"),
        isGroup: Boolean(conversation.is_group),
        avatar_url: conversation.avatar_url ?? otherProfile?.avatar_url ?? null,
        members: chatMembers,
        otherUser:
          other && otherProfile ? { id: other.user_id, ...otherProfile } : null,
        lastMessage,
        unreadCount,
        updatedAt:
          updatedAtByConv[conversationId] ?? lastMessage?.created_at ?? "",
      };
    })
    .filter((row): row is DmConversationPreview => row !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return previews;
}

export async function getDmMessages(
  userId: string,
  conversationId: string,
  limit = 200,
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

  let { data, error } = await supabase
    .from("dm_messages")
    .select(
      `
      id,
      conversation_id,
      sender_id,
      content,
      reply_to_id,
      edited_at,
      deleted_at,
      created_at,
      profiles:sender_id (nickname, avatar_url),
      dm_message_attachments (*),
      dm_message_reactions (*)
    `,
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    const fallback = await supabase
      .from("dm_messages")
      .select(
        "id, conversation_id, sender_id, content, created_at, profiles:sender_id (nickname, avatar_url)",
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(limit);
    data =
      fallback.data?.map((row) => ({
        ...row,
        dm_message_attachments: [],
        dm_message_reactions: [],
        reply_to_id: null,
        edited_at: null,
        deleted_at: null,
      })) ?? null;
    error = fallback.error;
  }

  if (error || !data) return [];

  const messages = data.map((row) => ({
    id: row.id,
    conversation_id: row.conversation_id,
    sender_id: row.sender_id,
    content: row.content,
    created_at: row.created_at,
    author: pickProfile(
      row.profiles as ProfileSnippet | ProfileSnippet[] | null | undefined,
    ),
    attachments: (row.dm_message_attachments ?? []) as DmAttachment[],
    reply_to_id: row.reply_to_id ?? null,
    edited_at: row.edited_at ?? null,
    deleted_at: row.deleted_at ?? null,
    reactions: row.dm_message_reactions ?? [],
  }));

  const attachments = messages.flatMap((message) => message.attachments);
  if (attachments.length > 0) {
    const { data: signed } = await supabase.storage
      .from("chat-media")
      .createSignedUrls(
        attachments.map((attachment) => attachment.file_path),
        3600,
      );
    const signedByPath = Object.fromEntries(
      (signed ?? []).map((item) => [item.path, item.signedUrl]),
    );
    for (const message of messages) {
      message.attachments = message.attachments.map((attachment) => ({
        ...attachment,
        signed_url: signedByPath[attachment.file_path],
      }));
    }
  }

  return messages;
}

export async function getDmUnreadCount(userId: string): Promise<number> {
  const conversations = await getDmConversations(userId);
  return conversations.reduce((sum, c) => sum + c.unreadCount, 0);
}
