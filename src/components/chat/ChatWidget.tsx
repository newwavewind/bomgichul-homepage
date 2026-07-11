"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type {
  DmConversationPreview,
  DmMessage,
  OnlineUser,
} from "@/types/database";
import { formatKstChatTime } from "@/lib/datetime";

type ChatUser = {
  id: string;
  nickname: string;
};

type View = "list" | "online" | "thread";

function formatChatTime(iso: string): string {
  return formatKstChatTime(iso);
}

function Avatar({ nickname }: { nickname: string }) {
  const initial = (nickname || "?").slice(0, 1).toUpperCase();
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-carbon bg-ice font-display text-body-sm font-bold text-ink">
      {initial}
    </span>
  );
}

function MessageBubble({
  message,
  isMine,
}: {
  message: DmMessage;
  isMine: boolean;
}) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-[18px] px-3.5 py-2.5 font-display text-[13px] leading-relaxed ${
          isMine
            ? "rounded-br-md bg-[#6366f1] text-paper"
            : "rounded-bl-md border border-mist bg-paper text-ink"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={`mt-1 text-[10px] ${
            isMine ? "text-paper/70" : "text-fog"
          }`}
        >
          {formatChatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}

export function ChatWidget({
  user,
  initialConversations,
}: {
  user: ChatUser;
  initialConversations: DmConversationPreview[];
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("list");
  const [conversations, setConversations] = useState(initialConversations);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeOtherUser, setActiveOtherUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presenceChannelRef = useRef<RealtimeChannel | null>(null);
  const messageChannelRef = useRef<RealtimeChannel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const unreadTotal = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations]
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const refreshConversations = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const { data: memberships } = await supabase
      .from("dm_conversation_members")
      .select("conversation_id, last_read_at")
      .eq("user_id", user.id);

    if (!memberships?.length) {
      setConversations([]);
      return;
    }

    const convIds = memberships.map((m) => m.conversation_id);
    const lastReadByConv = Object.fromEntries(
      memberships.map((m) => [m.conversation_id, m.last_read_at])
    );

    const [{ data: members }, { data: rawMessages }, { data: convRows }] =
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
        supabase.from("dm_conversations").select("id, updated_at").in("id", convIds),
      ]);

    type LastMessageRow = {
      id: string;
      conversation_id: string;
      sender_id: string;
      content: string;
      created_at: string;
    };

    const lastByConv = new Map<string, LastMessageRow>();
    for (const msg of (rawMessages ?? []) as LastMessageRow[]) {
      if (!lastByConv.has(msg.conversation_id)) lastByConv.set(msg.conversation_id, msg);
    }

    const updatedAtByConv = Object.fromEntries(
      (convRows ?? []).map((c) => [c.id, c.updated_at as string])
    );

    const next: DmConversationPreview[] = convIds
      .map((conversationId) => {
        const convMembers = (members ?? []).filter(
          (m) => m.conversation_id === conversationId
        );
        const other = convMembers.find((m) => m.user_id !== user.id);
        if (!other) return null;

        const profile = Array.isArray(other.profiles)
          ? other.profiles[0]
          : other.profiles;
        const lastMessage = lastByConv.get(conversationId) ?? null;
        const lastReadAt = lastReadByConv[conversationId] ?? new Date(0).toISOString();
        const unreadCount =
          lastMessage &&
          lastMessage.sender_id !== user.id &&
          lastMessage.created_at > lastReadAt
            ? 1
            : 0;

        return {
          id: conversationId,
          otherUser: {
            id: other.user_id,
            nickname: profile?.nickname ?? "익명",
            avatar_url: profile?.avatar_url ?? null,
          },
          lastMessage,
          unreadCount,
          updatedAt:
            updatedAtByConv[conversationId] ??
            lastMessage?.created_at ??
            "",
        };
      })
      .filter((row): row is DmConversationPreview => row !== null)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    setConversations(next);
  }, [user.id]);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!isSupabaseConfigured()) return;
      setLoadingMessages(true);
      setError(null);
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
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
        .limit(200);

      if (fetchError) {
        setError(fetchError.message);
        setLoadingMessages(false);
        return;
      }

      const mapped: DmMessage[] = (data ?? []).map((row) => {
        const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
        return {
          id: row.id,
          conversation_id: row.conversation_id,
          sender_id: row.sender_id,
          content: row.content,
          created_at: row.created_at,
          author: {
            nickname: profile?.nickname ?? "익명",
            avatar_url: profile?.avatar_url ?? null,
          },
        };
      });

      setMessages(mapped);
      setLoadingMessages(false);
      await supabase.rpc("mark_dm_conversation_read", {
        p_conversation_id: conversationId,
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c
        )
      );
      setTimeout(scrollToBottom, 50);
    },
    [scrollToBottom]
  );

  const openThread = useCallback(
    async (conversationId: string, other: ChatUser) => {
      setActiveConversationId(conversationId);
      setActiveOtherUser(other);
      setView("thread");
      await loadMessages(conversationId);
    },
    [loadMessages]
  );

  const startChatWithUser = useCallback(
    async (other: ChatUser) => {
      if (!isSupabaseConfigured()) return;
      setError(null);
      const supabase = createClient();
      const { data: conversationId, error: rpcError } = await supabase.rpc(
        "get_or_create_dm_conversation",
        { other_user_id: other.id }
      );

      if (rpcError || !conversationId) {
        setError(rpcError?.message ?? "대화를 시작할 수 없습니다.");
        return;
      }

      await refreshConversations();
      await openThread(conversationId as string, other);
    },
    [openThread, refreshConversations]
  );

  const sendMessage = async () => {
    const trimmed = draft.trim();
    if (!trimmed || !activeConversationId || sending || !isSupabaseConfigured()) return;

    setSending(true);
    setError(null);
    const supabase = createClient();
    const { error: insertError } = await supabase.from("dm_messages").insert({
      conversation_id: activeConversationId,
      sender_id: user.id,
      content: trimmed,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setDraft("");
      await refreshConversations();
    }
    setSending(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const channel = supabase.channel("homepage-presence", {
      config: { presence: { key: user.id } },
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<OnlineUser>();
      const users: OnlineUser[] = [];
      for (const presences of Object.values(state)) {
        for (const p of presences) {
          if (p.user_id && p.user_id !== user.id && p.nickname) {
            users.push({ user_id: p.user_id, nickname: p.nickname });
          }
        }
      }
      const unique = new Map(users.map((u) => [u.user_id, u]));
      setOnlineUsers(
        [...unique.values()].sort((a, b) => a.nickname.localeCompare(b.nickname, "ko"))
      );
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ user_id: user.id, nickname: user.nickname });
      }
    });

    presenceChannelRef.current = channel;

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
      presenceChannelRef.current = null;
    };
  }, [user.id, user.nickname]);

  useEffect(() => {
    if (!open || view !== "thread" || !activeConversationId || !isSupabaseConfigured()) {
      return;
    }

    const supabase = createClient();
    const channel = supabase
      .channel(`dm-messages:${activeConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dm_messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            conversation_id: string;
            sender_id: string;
            content: string;
            created_at: string;
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            const author =
              row.sender_id === user.id
                ? { nickname: user.nickname, avatar_url: null }
                : {
                    nickname: activeOtherUser?.nickname ?? "익명",
                    avatar_url: null,
                  };
            return [
              ...prev,
              {
                id: row.id,
                conversation_id: row.conversation_id,
                sender_id: row.sender_id,
                content: row.content,
                created_at: row.created_at,
                author,
              },
            ];
          });

          if (row.sender_id !== user.id) {
            supabase.rpc("mark_dm_conversation_read", {
              p_conversation_id: activeConversationId,
            });
          }

          refreshConversations();
          setTimeout(scrollToBottom, 50);
        }
      )
      .subscribe();

    messageChannelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      messageChannelRef.current = null;
    };
  }, [
    open,
    view,
    activeConversationId,
    user.id,
    user.nickname,
    activeOtherUser?.nickname,
    refreshConversations,
    scrollToBottom,
  ]);

  useEffect(() => {
    if (view === "thread") scrollToBottom();
  }, [messages, view, scrollToBottom]);

  const panelTitle =
    view === "thread"
      ? activeOtherUser?.nickname ?? "채팅"
      : view === "online"
        ? "접속 중"
        : "메시지";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-carbon bg-paper text-2xl shadow-[var(--shadow-card)] transition-transform hover:scale-105"
        aria-label="채팅 열기"
      >
        💬
        {unreadTotal > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ef4444] px-1 font-display text-[10px] font-bold text-paper">
            {unreadTotal > 9 ? "9+" : unreadTotal}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[60] flex h-[min(70vh,560px)] w-[min(92vw,360px)] flex-col overflow-hidden rounded-[var(--radius-cards)] border-[1.5px] border-carbon bg-paper shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 border-b border-mist px-4 py-3">
            {view === "thread" ? (
              <button
                type="button"
                onClick={() => {
                  setView("list");
                  setActiveConversationId(null);
                  setActiveOtherUser(null);
                  setMessages([]);
                }}
                className="font-display text-body-sm text-fog hover:text-ink"
              >
                ←
              </button>
            ) : null}
            <h2 className="flex-1 font-display text-body font-semibold text-ink">
              {panelTitle}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="font-display text-body-sm text-fog hover:text-ink"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {view !== "thread" && (
            <div className="grid grid-cols-2 border-b border-mist">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`py-2.5 font-display text-[13px] font-medium ${
                  view === "list"
                    ? "border-b-2 border-carbon text-ink"
                    : "text-fog"
                }`}
              >
                대화 목록
              </button>
              <button
                type="button"
                onClick={() => setView("online")}
                className={`py-2.5 font-display text-[13px] font-medium ${
                  view === "online"
                    ? "border-b-2 border-carbon text-ink"
                    : "text-fog"
                }`}
              >
                접속 중 ({onlineUsers.length})
              </button>
            </div>
          )}

          {error && (
            <p className="border-b border-mist bg-rose-50 px-4 py-2 font-display text-[12px] text-rose-700">
              {error}
            </p>
          )}

          {view === "list" && (
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="px-4 py-10 text-center font-display text-body-sm text-fog">
                  아직 대화가 없어요.
                  <br />
                  접속 중 탭에서 메시지를 내보세요.
                </p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() =>
                      openThread(conv.id, {
                        id: conv.otherUser.id,
                        nickname: conv.otherUser.nickname,
                      })
                    }
                    className="flex w-full items-center gap-3 border-b border-mist/70 px-4 py-3 text-left hover:bg-surface"
                  >
                    <Avatar nickname={conv.otherUser.nickname} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-display text-body-sm font-semibold text-ink">
                          {conv.otherUser.nickname}
                        </p>
                        {conv.lastMessage && (
                          <span className="shrink-0 font-display text-[10px] text-fog">
                            {formatChatTime(conv.lastMessage.created_at)}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate font-display text-[12px] text-smoke">
                        {conv.lastMessage?.content ?? "대화를 시작해 보세요"}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6366f1] px-1 font-display text-[10px] font-bold text-paper">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}

          {view === "online" && (
            <div className="flex-1 overflow-y-auto">
              {onlineUsers.length === 0 ? (
                <p className="px-4 py-10 text-center font-display text-body-sm text-fog">
                  지금 접속 중인 다른 사용자가 없어요.
                </p>
              ) : (
                onlineUsers.map((online) => (
                  <button
                    key={online.user_id}
                    type="button"
                    onClick={() =>
                      startChatWithUser({
                        id: online.user_id,
                        nickname: online.nickname,
                      })
                    }
                    className="flex w-full items-center gap-3 border-b border-mist/70 px-4 py-3 text-left hover:bg-surface"
                  >
                    <div className="relative">
                      <Avatar nickname={online.nickname} />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-paper bg-emerald-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-body-sm font-semibold text-ink">
                        {online.nickname}
                      </p>
                      <p className="font-display text-[12px] text-emerald-600">
                        접속 중
                      </p>
                    </div>
                    <span className="font-display text-[12px] text-[#6366f1]">
                      메시지
                    </span>
                  </button>
                ))
              )}
            </div>
          )}

          {view === "thread" && (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
                {loadingMessages ? (
                  <p className="py-8 text-center font-display text-body-sm text-fog">
                    불러오는 중...
                  </p>
                ) : messages.length === 0 ? (
                  <p className="py-8 text-center font-display text-body-sm text-fog">
                    첫 메시지를 내보세요.
                  </p>
                ) : (
                  messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isMine={message.sender_id === user.id}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                className="border-t border-mist p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage();
                }}
              >
                <div className="flex items-end gap-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                    placeholder="메시지를 입력하세요"
                    className="max-h-28 min-h-[44px] flex-1 resize-none rounded-[var(--radius-input)] border border-mist bg-paper px-3 py-2 font-display text-[13px] text-ink outline-none focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void sendMessage();
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="rounded-full border-[1.5px] border-carbon bg-carbon px-4 py-2 font-display text-[13px] font-semibold text-paper disabled:opacity-50"
                  >
                    전송
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
