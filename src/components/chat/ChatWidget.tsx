"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type {
  ChatMember,
  DmAttachment,
  DmConversationPreview,
  DmMessage,
  Friendship,
  OnlineUser,
} from "@/types/database";
import { formatKstChatTime } from "@/lib/datetime";
import { ChatProfileModal } from "@/components/chat/ChatProfileModal";

type ChatUser = {
  id: string;
  nickname: string;
  avatar_url: string | null;
  isAdmin: boolean;
};
type View =
  | "list"
  | "friends"
  | "online"
  | "thread"
  | "new-group"
  | "search"
  | "study"
  | "manage";
type ProfileRow = { id: string; nickname: string; avatar_url: string | null };
type FriendRow = Friendship & { requester: ProfileRow; addressee: ProfileRow };

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_FILES = 6;
const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const MAX_FILE_BYTES = 30 * 1024 * 1024;
const IMAGE_OPTIMIZE_THRESHOLD = 2 * 1024 * 1024;
const IMAGE_MAX_EDGE = 2560;
const REACTIONS = ["👍", "❤️", "😂", "🔥", "👏", "😮"] as const;

async function optimizeChatImage(file: File): Promise<File> {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size < IMAGE_OPTIMIZE_THRESHOLD
  )
    return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.88),
    );
    if (!blob || blob.size >= file.size) return file;
    const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${baseName}.webp`, {
      type: "image/webp",
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

function Avatar({
  nickname,
  url,
  size = "md",
  onOpen,
}: {
  nickname: string;
  url?: string | null;
  size?: "sm" | "md" | "lg";
  onOpen?: () => void;
}) {
  const sizeClass =
    size === "lg"
      ? "h-12 w-12 text-base"
      : size === "sm"
        ? "h-7 w-7 text-[11px]"
        : "h-9 w-9 text-body-sm";
  return (
    <span
      onClick={(event) => { if (onOpen) { event.stopPropagation(); onOpen(); } }}
      onKeyDown={(event) => { if (onOpen && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); event.stopPropagation(); onOpen(); } }}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-carbon bg-ice font-display font-bold text-ink ${sizeClass}`}
    >
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        (nickname || "?").slice(0, 1).toUpperCase()
      )}
    </span>
  );
}

function messagePreview(message: DmConversationPreview["lastMessage"]): string {
  if (!message) return "대화를 시작해 보세요";
  return message.content || "사진 또는 동영상";
}

function MessageBubble({
  message,
  isMine,
  readCount,
  onReply,
  onEdit,
  onDelete,
  onReact,
}: {
  message: DmMessage;
  isMine: boolean;
  readCount: number;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReact: (emoji: string) => void;
}) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const grouped = Object.entries(
    message.reactions.reduce<Record<string, number>>(
      (result, reaction) => ({
        ...result,
        [reaction.emoji]: (result[reaction.emoji] ?? 0) + 1,
      }),
      {},
    ),
  );

  useEffect(() => {
    if (!actionsOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!actionMenuRef.current?.contains(event.target as Node)) {
        setActionsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [actionsOpen]);

  const runAction = (action: () => void) => {
    setActionsOpen(false);
    action();
  };

  return (
    <div
      className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
    >
      {!isMine ? (
        <Avatar
          nickname={message.author.nickname}
          url={message.author.avatar_url}
          size="sm"
        />
      ) : null}
      <div
        className={`max-w-[84%] overflow-hidden rounded-[18px] font-display text-[13px] leading-relaxed ${isMine ? "rounded-br-md bg-[#e9eaf8] text-[#30344a] ring-1 ring-inset ring-[#d9dbea]" : "rounded-bl-md border border-mist bg-paper text-ink"}`}
      >
        {message.reply_to ? (
          <div
            className={`mx-2 mt-2 rounded-xl border-l-2 px-2.5 py-1.5 text-[11px] ${isMine ? "border-[#8b8fb8] bg-white/45 text-[#555b78]" : "border-[#007AFF] bg-[#007AFF]/5 text-smoke"}`}
          >
            ↩ {message.reply_to.content || "첨부 메시지"}
          </div>
        ) : null}
        {message.deleted_at ? (
          <p className="px-4 py-3 italic opacity-65">삭제된 메시지입니다.</p>
        ) : message.attachments.length > 0 ? (
          <div
            className={`grid gap-1 ${message.attachments.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {message.attachments.map((attachment) =>
              attachment.kind === "image" ? (
                <a
                  key={attachment.id}
                  href={attachment.signed_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-20 items-center justify-center overflow-hidden bg-black/5"
                >
                  <img
                    src={attachment.signed_url}
                    alt={attachment.file_name}
                    className="h-auto max-h-72 max-w-full object-contain"
                    loading="lazy"
                  />
                </a>
              ) : attachment.kind === "video" ? (
                <video
                  key={attachment.id}
                  src={attachment.signed_url}
                  controls
                  playsInline
                  preload="metadata"
                  className="max-h-72 w-full bg-black"
                />
              ) : (
                <a
                  key={attachment.id}
                  href={attachment.signed_url}
                  target="_blank"
                  rel="noreferrer"
                  className="m-2 flex items-center gap-2 rounded-xl border border-current/15 bg-white/10 p-3"
                >
                  <span className="text-xl">📄</span>
                  <span className="min-w-0">
                    <b className="block truncate text-[12px]">
                      {attachment.file_name}
                    </b>
                    <small>
                      {(attachment.file_size / 1024 / 1024).toFixed(1)}MB
                    </small>
                  </span>
                </a>
              ),
            )}
          </div>
        ) : null}
        <div className={message.content ? "px-3.5 py-2.5" : "px-3.5 py-1.5"}>
          {!message.deleted_at && message.content ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : null}
          <p
            className={`mt-1 text-[10px] ${isMine ? "text-[#777c99]" : "text-fog"}`}
          >
            {!isMine ? `${message.author.nickname} · ` : ""}
            {formatKstChatTime(message.created_at)}
            {message.edited_at ? " · 수정됨" : ""}
            {isMine && readCount > 0 ? ` · ${readCount}명 읽음` : ""}
          </p>
          {grouped.length ? (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {grouped.map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => onReact(emoji)}
                  className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]"
                >
                  {emoji} {count}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {!message.deleted_at ? (
        <div
          ref={actionMenuRef}
          className={`relative shrink-0 self-center ${isMine ? "order-first" : ""}`}
        >
          <button
            type="button"
            onClick={() => setActionsOpen((current) => !current)}
            aria-label="메시지 메뉴"
            aria-expanded={actionsOpen}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm tracking-widest transition ${actionsOpen ? "bg-white text-ink shadow-sm" : "text-slate-300 hover:bg-white/70 hover:text-slate-500"}`}
          >
            ⋯
          </button>
          {actionsOpen ? (
            <div
              className={`absolute bottom-9 z-50 flex w-max max-w-[calc(100vw-2rem)] items-center gap-0.5 whitespace-nowrap rounded-full border border-mist bg-white p-1 shadow-xl ${isMine ? "left-0" : "right-0"}`}
            >
              <button
                type="button"
                onClick={() => runAction(onReply)}
                className="rounded-full px-2 py-1 text-[11px] text-smoke hover:bg-ice"
              >
                ↩ 답장
              </button>
              {REACTIONS.slice(0, 3).map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => runAction(() => onReact(emoji))}
                  className="rounded-full px-1.5 py-1 text-xs hover:bg-ice"
                  aria-label={`${emoji} 반응 남기기`}
                >
                  {emoji}
                </button>
              ))}
              {isMine ? (
                <>
                  <button
                    type="button"
                    onClick={() => runAction(onEdit)}
                    className="rounded-full px-2 py-1 text-[11px] text-smoke hover:bg-ice"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => runAction(onDelete)}
                    className="rounded-full px-2 py-1 text-[11px] text-coral hover:bg-coral/10"
                  >
                    삭제
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
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
  const [activeConversation, setActiveConversation] =
    useState<DmConversationPreview | null>(null);
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProfileRow[]>([]);
  const [groupTitle, setGroupTitle] = useState("");
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<DmMessage | null>(null);
  const [messageSearch, setMessageSearch] = useState("");
  const [studyTitle, setStudyTitle] = useState("");
  const [studyKind, setStudyKind] = useState("notice");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [preparingFiles, setPreparingFiles] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const presenceChannelRef = useRef<RealtimeChannel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const unreadTotal = useMemo(
    () => conversations.reduce((sum, item) => sum + item.unreadCount, 0),
    [conversations],
  );
  const acceptedFriends = useMemo(
    () => friends.filter((friend) => friend.status === "accepted"),
    [friends],
  );
  const incomingRequests = useMemo(
    () =>
      friends.filter(
        (friend) =>
          friend.status === "pending" && friend.addressee_id === user.id,
      ),
    [friends, user.id],
  );
  const friendProfile = useCallback(
    (friend: FriendRow) =>
      friend.requester_id === user.id ? friend.addressee : friend.requester,
    [user.id],
  );
  const scrollToBottom = useCallback(
    () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
    [],
  );

  const refreshConversations = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const { data: memberships } = await supabase
      .from("dm_conversation_members")
      .select("conversation_id,last_read_at,pinned_at")
      .eq("user_id", user.id);
    if (!memberships?.length) {
      setConversations([]);
      return;
    }
    const ids = memberships.map((item) => item.conversation_id);
    const lastRead = Object.fromEntries(
      memberships.map((item) => [item.conversation_id, item.last_read_at]),
    );
    const pinnedById = Object.fromEntries(memberships.map((item) => [item.conversation_id, item.pinned_at]));
    const [memberResult, messageResult, conversationResult] = await Promise.all(
      [
        supabase
          .from("dm_conversation_members")
          .select(
            "conversation_id,user_id,role,last_read_at,profiles:user_id(id,nickname,avatar_url)",
          )
          .in("conversation_id", ids),
        supabase
          .from("dm_messages")
          .select("id,conversation_id,sender_id,content,created_at")
          .in("conversation_id", ids)
          .order("created_at", { ascending: false }),
        supabase
          .from("dm_conversations")
          .select(
            "id,title,is_group,is_self,avatar_url,updated_at,pinned_message_id,slow_mode_seconds,study_dday,study_goal",
          )
          .in("id", ids),
      ],
    );
    const memberRows = memberResult.error
      ? (
          await supabase
            .from("dm_conversation_members")
            .select(
              "conversation_id,user_id,last_read_at,profiles:user_id(id,nickname,avatar_url)",
            )
            .in("conversation_id", ids)
        ).data?.map((row) => ({ ...row, role: "member" }))
      : memberResult.data;
    const messageRows = messageResult.data;
    const conversationRows = conversationResult.error
      ? (
          await supabase
            .from("dm_conversations")
            .select("id,updated_at")
            .in("id", ids)
        ).data?.map((row) => ({
          ...row,
          title: null,
          is_group: false,
          is_self: false,
          avatar_url: null,
          pinned_message_id: null,
          slow_mode_seconds: 0,
          study_dday: null,
          study_goal: null,
        }))
      : conversationResult.data;
    if (!conversationRows) return;
    const lastByConversation = new Map<
      string,
      NonNullable<DmConversationPreview["lastMessage"]>
    >();
    for (const row of messageRows ?? [])
      if (!lastByConversation.has(row.conversation_id))
        lastByConversation.set(row.conversation_id, row);
    const next = (conversationRows ?? [])
      .map((row): DmConversationPreview | null => {
        const members: ChatMember[] = (memberRows ?? [])
          .filter((item) => item.conversation_id === row.id)
          .map((item) => {
            const profile = Array.isArray(item.profiles)
              ? item.profiles[0]
              : item.profiles;
            return {
              id: item.user_id,
              nickname: profile?.nickname ?? "익명",
              avatar_url: profile?.avatar_url ?? null,
              role: item.role as ChatMember["role"],
              last_read_at: item.last_read_at,
            };
          });
        const other = members.find((member) => member.id !== user.id) ?? null;
        if (!row.is_group && !row.is_self && !other) return null;
        const last = lastByConversation.get(row.id) ?? null;
        return {
          id: row.id,
          title: row.is_self ? "나와의 채팅" : row.is_group
            ? row.title || "그룹 채팅"
            : other?.nickname || "대화",
          isGroup: Boolean(row.is_group),
          avatar_url: row.avatar_url ?? other?.avatar_url ?? null,
          members,
          otherUser: other,
          isSelf: Boolean(row.is_self),
          pinnedAt: pinnedById[row.id] ?? null,
          lastMessage: last,
          unreadCount:
            last &&
            last.sender_id !== user.id &&
            last.created_at > (lastRead[row.id] ?? "")
              ? 1
              : 0,
          updatedAt: row.updated_at ?? last?.created_at ?? "",
          pinned_message_id: row.pinned_message_id,
          slow_mode_seconds: row.slow_mode_seconds,
          study_dday: row.study_dday,
          study_goal: row.study_goal,
        };
      })
      .filter((item): item is DmConversationPreview => Boolean(item))
      .sort((a, b) => (b.pinnedAt ? 1 : 0) - (a.pinnedAt ? 1 : 0) || b.updatedAt.localeCompare(a.updatedAt));
    setConversations(next);
    setActiveConversation((current) =>
      current ? (next.find((item) => item.id === current.id) ?? current) : null,
    );
  }, [user.id]);

  const refreshFriends = useCallback(async () => {
    const { data, error: friendError } = await createClient()
      .from("friendships")
      .select(
        "id,requester_id,addressee_id,status,created_at,accepted_at,requester:requester_id(id,nickname,avatar_url),addressee:addressee_id(id,nickname,avatar_url)",
      )
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    if (friendError) {
      setError(friendError.message);
      return;
    }
    setFriends(
      (data ?? []).map((row) => ({
        ...row,
        requester: (Array.isArray(row.requester)
          ? row.requester[0]
          : row.requester) as ProfileRow,
        addressee: (Array.isArray(row.addressee)
          ? row.addressee[0]
          : row.addressee) as ProfileRow,
      })) as FriendRow[],
    );
  }, [user.id]);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      let { data, error: fetchError } = await supabase
        .from("dm_messages")
        .select(
          "id,conversation_id,sender_id,content,reply_to_id,edited_at,deleted_at,created_at,profiles:sender_id(nickname,avatar_url),dm_message_attachments(*),dm_message_reactions(*)",
        )
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(300);
      if (fetchError) {
        const fallback = await supabase
          .from("dm_messages")
          .select(
            "id,conversation_id,sender_id,content,created_at,profiles:sender_id(nickname,avatar_url)",
          )
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true })
          .limit(200);
        data =
          fallback.data?.map((row) => ({
            ...row,
            dm_message_attachments: [],
            dm_message_reactions: [],
            reply_to_id: null,
            edited_at: null,
            deleted_at: null,
          })) ?? null;
        fetchError = fallback.error;
      }
      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }
      const mapped: DmMessage[] = (data ?? []).map((row) => {
        const profile = Array.isArray(row.profiles)
          ? row.profiles[0]
          : row.profiles;
        return {
          id: row.id,
          conversation_id: row.conversation_id,
          sender_id: row.sender_id,
          content: row.content,
          reply_to_id: row.reply_to_id ?? null,
          reply_to: null,
          edited_at: row.edited_at ?? null,
          deleted_at: row.deleted_at ?? null,
          created_at: row.created_at,
          author: {
            nickname: profile?.nickname ?? "익명",
            avatar_url: profile?.avatar_url ?? null,
          },
          attachments: (row.dm_message_attachments ?? []) as DmAttachment[],
          reactions: row.dm_message_reactions ?? [],
        };
      });
      for (const message of mapped)
        message.reply_to =
          mapped.find((item) => item.id === message.reply_to_id) ?? null;
      const allAttachments = mapped.flatMap((message) => message.attachments);
      if (allAttachments.length) {
        const { data: signed } = await supabase.storage
          .from("chat-media")
          .createSignedUrls(
            allAttachments.map((item) => item.file_path),
            3600,
          );
        const urls = Object.fromEntries(
          (signed ?? []).map((item) => [item.path, item.signedUrl]),
        );
        for (const message of mapped)
          message.attachments = message.attachments.map((item) => ({
            ...item,
            signed_url: urls[item.file_path],
          }));
      }
      setMessages(mapped);
      setLoading(false);
      await supabase.rpc("mark_dm_conversation_read", {
        p_conversation_id: conversationId,
      });
      setConversations((items) =>
        items.map((item) =>
          item.id === conversationId ? { ...item, unreadCount: 0 } : item,
        ),
      );
      setTimeout(scrollToBottom, 40);
    },
    [scrollToBottom],
  );

  const openThread = useCallback(
    async (conversation: DmConversationPreview) => {
      setActiveConversation(conversation);
      setView("thread");
      await loadMessages(conversation.id);
    },
    [loadMessages],
  );

  const startDirectChat = useCallback(
    async (other: ProfileRow) => {
      setError(null);
      const { data, error: rpcError } = await createClient().rpc(
        "get_or_create_dm_conversation",
        { other_user_id: other.id },
      );
      if (rpcError || !data) {
        setError(rpcError?.message ?? "대화를 시작할 수 없습니다.");
        return;
      }
      await refreshConversations();
      const conversation =
        conversations.find((item) => item.id === data) ??
        ({
          id: data as string,
          title: other.nickname,
          isGroup: false,
          avatar_url: other.avatar_url,
          members: [
            { ...user, role: "member" },
            { ...other, role: "member" },
          ],
          otherUser: other,
          lastMessage: null,
          unreadCount: 0,
          updatedAt: "",
        } as DmConversationPreview);
      await openThread(conversation);
    },
    [conversations, openThread, refreshConversations, user],
  );

  const openSelfChat = async () => {
    setError(null);
    const { data, error: rpcError } = await createClient().rpc("get_or_create_self_conversation");
    if (rpcError || !data) { setError(rpcError?.message ?? "나와의 채팅을 열 수 없습니다."); return; }
    await refreshConversations();
    const conversation = conversations.find((item) => item.id === data) ?? ({ id:data as string,title:"나와의 채팅",isGroup:false,isSelf:true,avatar_url:user.avatar_url,members:[{...user,role:"owner"}],otherUser:null,lastMessage:null,unreadCount:0,updatedAt:"",pinnedAt:null } as DmConversationPreview);
    await openThread(conversation);
  };

  const toggleConversationPin = async (conversation: DmConversationPreview) => {
    const nextPinnedAt = conversation.pinnedAt ? null : new Date().toISOString();
    const { error: pinError } = await createClient().rpc("set_dm_conversation_pin", { p_conversation_id: conversation.id, p_pinned: !conversation.pinnedAt });
    if (pinError) setError(pinError.message); else setConversations((items) => items.map((item) => item.id === conversation.id ? {...item,pinnedAt:nextPinnedAt} : item).sort((a,b)=>(b.pinnedAt?1:0)-(a.pinnedAt?1:0)||b.updatedAt.localeCompare(a.updatedAt)));
  };

  const validateFiles = (files: File[]) => {
    if (files.length > MAX_FILES) return "한 번에 최대 6개까지 보낼 수 있어요.";
    for (const file of files) {
      if (!user.isAdmin && IMAGE_TYPES.has(file.type) && file.size > MAX_IMAGE_BYTES)
        return `${file.name}: 최적화 후에도 10MB를 넘습니다.`;
      if (!user.isAdmin && VIDEO_TYPES.has(file.type) && file.size > MAX_VIDEO_BYTES)
        return `${file.name}: 동영상은 파일당 100MB까지 가능해요.`;
      if (
        !user.isAdmin &&
        !IMAGE_TYPES.has(file.type) &&
        !VIDEO_TYPES.has(file.type) &&
        file.size > MAX_FILE_BYTES
      )
        return `${file.name}: 일반 파일은 30MB까지 가능해요.`;
    }
    return null;
  };

  const queueFiles = async (files: File[]) => {
    if (!files.length) return;
    setPreparingFiles(true);
    try {
      const optimizedFiles = await Promise.all(files.map(optimizeChatImage));
      const nextFiles = [...selectedFiles, ...optimizedFiles];
      const validation = validateFiles(nextFiles);
      if (validation) {
        setError(validation);
        return;
      }
      setError(null);
      setSelectedFiles(nextFiles);
    } finally {
      setPreparingFiles(false);
    }
  };

  const isFileDrag = (event: React.DragEvent) =>
    Array.from(event.dataTransfer.types).includes("Files");

  const handleDragEnter = (event: React.DragEvent) => {
    if (view !== "thread" || !isFileDrag(event)) return;
    event.preventDefault();
    dragDepthRef.current += 1;
    setIsDraggingFiles(true);
  };

  const handleDragOver = (event: React.DragEvent) => {
    if (view !== "thread" || !isFileDrag(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDragLeave = (event: React.DragEvent) => {
    if (view !== "thread" || !isFileDrag(event)) return;
    event.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDraggingFiles(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    if (view !== "thread" || !isFileDrag(event)) return;
    event.preventDefault();
    dragDepthRef.current = 0;
    setIsDraggingFiles(false);
    void queueFiles(Array.from(event.dataTransfer.files));
  };

  const sendMessage = async () => {
    if (
      (!draft.trim() && selectedFiles.length === 0) ||
      !activeConversation ||
      sending ||
      preparingFiles
    )
      return;
    const validation = validateFiles(selectedFiles);
    if (validation) {
      setError(validation);
      return;
    }
    setSending(true);
    setError(null);
    const supabase = createClient();
    const reservations: Array<{
      id: string;
      path: string;
      file: File;
    }> = [];

    for (const file of selectedFiles) {
      const { data, error: reservationError } = await supabase.rpc(
        "reserve_chat_upload",
        {
          p_conversation_id: activeConversation.id,
          p_file_name: file.name,
          p_file_size: file.size,
          p_mime_type: file.type || "application/octet-stream",
        },
      );
      const reservation = Array.isArray(data) ? data[0] : null;
      if (reservationError || !reservation) {
        await Promise.all(
          reservations.map((item) =>
            supabase.rpc("cancel_chat_upload", {
              p_reservation_id: item.id,
            }),
          ),
        );
        setError(reservationError?.message ?? "첨부 용량을 확인할 수 없습니다.");
        setSending(false);
        return;
      }
      reservations.push({
        id: reservation.reservation_id as string,
        path: reservation.file_path as string,
        file,
      });
    }

    const { data: message, error: insertError } = await supabase
      .from("dm_messages")
      .insert({
        conversation_id: activeConversation.id,
        sender_id: user.id,
        content: draft.trim(),
        reply_to_id: replyTo?.id ?? null,
      })
      .select("id")
      .single();
    if (insertError || !message) {
      await Promise.all(
        reservations.map((item) =>
          supabase.rpc("cancel_chat_upload", { p_reservation_id: item.id }),
        ),
      );
      setError(insertError?.message ?? "메시지를 보낼 수 없습니다.");
      setSending(false);
      return;
    }
    for (const reservation of reservations) {
      const { file, path } = reservation;
      const { error: uploadError } = await supabase.storage
        .from("chat-media")
        .upload(path, file, { contentType: file.type, cacheControl: "3600" });
      if (uploadError) {
        await supabase.rpc("cancel_chat_upload", {
          p_reservation_id: reservation.id,
        });
        setError(`${file.name} 업로드 실패: ${uploadError.message}`);
        continue;
      }
      const { error: metaError } = await supabase.rpc("complete_chat_upload", {
        p_reservation_id: reservation.id,
        p_message_id: message.id,
      });
      if (metaError) {
        await supabase.storage.from("chat-media").remove([path]);
        await supabase.rpc("cancel_chat_upload", {
          p_reservation_id: reservation.id,
        });
        setError(`${file.name} 연결 실패: ${metaError.message}`);
      }
    }
    setDraft("");
    setReplyTo(null);
    setSelectedFiles([]);
    await loadMessages(activeConversation.id);
    await refreshConversations();
    setSending(false);
  };

  const reactToMessage = async (message: DmMessage, emoji: string) => {
    const supabase = createClient();
    const mine = message.reactions.find(
      (reaction) => reaction.user_id === user.id && reaction.emoji === emoji,
    );
    if (mine)
      await supabase
        .from("dm_message_reactions")
        .delete()
        .eq("message_id", message.id)
        .eq("user_id", user.id)
        .eq("emoji", emoji);
    else
      await supabase
        .from("dm_message_reactions")
        .insert({ message_id: message.id, user_id: user.id, emoji });
    if (activeConversation) await loadMessages(activeConversation.id);
  };

  const editMessage = async (message: DmMessage) => {
    const next = window.prompt("메시지 수정", message.content);
    if (next == null || !next.trim()) return;
    const { error: editError } = await createClient().rpc("update_dm_message", {
      p_message_id: message.id,
      p_content: next,
    });
    if (editError) setError(editError.message);
    else if (activeConversation) await loadMessages(activeConversation.id);
  };

  const deleteMessage = async (message: DmMessage) => {
    if (!window.confirm("이 메시지를 삭제할까요?")) return;
    const supabase = createClient();
    if (message.attachments.length) {
      const { error: storageError } = await supabase.storage
        .from("chat-media")
        .remove(message.attachments.map((attachment) => attachment.file_path));
      if (storageError) {
        setError(`첨부파일 정리 실패: ${storageError.message}`);
        return;
      }
    }
    const { error: deleteError } = await supabase.rpc(
      "delete_dm_message",
      { p_message_id: message.id },
    );
    if (deleteError) setError(deleteError.message);
    else if (activeConversation) await loadMessages(activeConversation.id);
  };

  const requestDesktopNotifications = async () => {
    if (!("Notification" in window)) {
      setError("이 브라우저는 알림을 지원하지 않아요.");
      return;
    }
    const permission = await Notification.requestPermission();
    setError(
      permission === "granted"
        ? "새 메시지 알림을 켰어요."
        : "브라우저에서 알림 권한이 차단됐어요.",
    );
  };

  const createStudyTool = async () => {
    if (!activeConversation || !studyTitle.trim()) return;
    const { error: studyError } = await createClient()
      .from("chat_study_events")
      .insert({
        conversation_id: activeConversation.id,
        creator_id: user.id,
        kind: studyKind,
        title: studyTitle.trim(),
        body: "",
        pinned: studyKind === "notice",
      });
    if (studyError) setError(studyError.message);
    else {
      setStudyTitle("");
      setError("스터디 도구를 만들었습니다.");
    }
  };

  const manageGroup = async (
    action: string,
    target?: string,
    value?: string,
  ) => {
    if (!activeConversation) return;
    const { error: manageError } = await createClient().rpc("manage_dm_group", {
      p_conversation_id: activeConversation.id,
      p_action: action,
      p_target_user_id: target ?? null,
      p_value: value ?? null,
    });
    if (manageError) setError(manageError.message);
    else await refreshConversations();
  };

  const searchProfiles = async () => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const { data, error: profileSearchError } = await createClient()
      .from("profiles")
      .select("id,nickname,avatar_url")
      .ilike("nickname", `%${query}%`)
      .eq("username_set", true)
      .limit(20);
    if (profileSearchError) {
      setError(`친구 검색 실패: ${profileSearchError.message}`);
      setSearchResults([]);
      return;
    }
    setSearchResults((data ?? []).filter((profile) => profile.id !== user.id));
  };

  const sendFriendRequest = async (profile: ProfileRow) => {
    const { error: requestError } = await createClient()
      .from("friendships")
      .insert({
        requester_id: user.id,
        addressee_id: profile.id,
        status: "accepted",
        accepted_at: new Date().toISOString(),
      });
    if (requestError)
      setError(
        requestError.code === "23505"
          ? "이미 친구로 추가된 사용자예요."
          : requestError.message,
      );
    else {
      setSearchResults((items) =>
        items.filter((item) => item.id !== profile.id),
      );
      await refreshFriends();
    }
  };

  const respondFriend = async (id: string, accept: boolean) => {
    const { error: responseError } = await createClient().rpc(
      "respond_friend_request",
      { p_friendship_id: id, p_accept: accept },
    );
    if (responseError) setError(responseError.message);
    else await refreshFriends();
  };

  const createGroup = async () => {
    if (groupMembers.length < 2) {
      setError("그룹채팅에는 친구를 2명 이상 선택해주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: groupError } = await createClient().rpc(
      "create_group_dm_conversation",
      { p_title: groupTitle.trim(), p_member_ids: groupMembers },
    );
    if (groupError || !data)
      setError(groupError?.message ?? "그룹을 만들 수 없습니다.");
    else {
      setGroupTitle("");
      setGroupMembers([]);
      await refreshConversations();
      setView("list");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      void refreshConversations();
      void refreshFriends();
    }
  }, [open, refreshConversations, refreshFriends]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (view === "friends") void searchProfiles();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, view]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("homepage-presence", {
      config: { presence: { key: user.id } },
    });
    channel.on("presence", { event: "sync" }, () => {
      const found: OnlineUser[] = [];
      for (const presences of Object.values(
        channel.presenceState<OnlineUser>(),
      ))
        for (const item of presences)
          if (item.user_id !== user.id) found.push(item);
      setOnlineUsers(
        [...new Map(found.map((item) => [item.user_id, item])).values()].sort(
          (a, b) => a.nickname.localeCompare(b.nickname, "ko"),
        ),
      );
    });
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED")
        await channel.track({
          user_id: user.id,
          nickname: user.nickname,
          avatar_url: user.avatar_url,
        });
    });
    presenceChannelRef.current = channel;
    return () => {
      void channel.untrack();
      void supabase.removeChannel(channel);
      presenceChannelRef.current = null;
    };
  }, [user]);

  useEffect(() => {
    if (!open || view !== "thread" || !activeConversation) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`dm:${activeConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dm_messages",
          filter: `conversation_id=eq.${activeConversation.id}`,
        },
        (payload) => {
          const row = payload.new as { sender_id: string; content: string };
          if (
            row.sender_id !== user.id &&
            document.hidden &&
            Notification.permission === "granted"
          )
            new Notification(activeConversation.title, {
              body: row.content || "새 첨부파일이 도착했어요.",
              icon: "/brand/whale-mark.png",
            });
          void loadMessages(activeConversation.id);
          void refreshConversations();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [
    activeConversation,
    loadMessages,
    open,
    refreshConversations,
    user.id,
    view,
  ]);

  const panelTitle =
    view === "thread"
      ? (activeConversation?.title ?? "채팅")
      : view === "friends"
        ? "친구"
        : view === "online"
          ? "접속 중"
          : view === "new-group"
            ? "새 그룹채팅"
            : "메시지";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-carbon bg-paper text-2xl shadow-[var(--shadow-card)] transition-transform hover:scale-105"
        aria-label="채팅 열기"
      >
        💬
        {unreadTotal > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ef4444] px-1 font-display text-[10px] font-bold text-paper">
            {unreadTotal > 9 ? "9+" : unreadTotal}
          </span>
        ) : null}
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top_right,#dbeafe_0,#f8fafc_38%,#fff_75%)] shadow-2xl sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(82vh,760px)] sm:w-[min(94vw,720px)] sm:rounded-[30px] sm:border sm:border-white/80"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onTouchStart={(event) => {
            const touch = event.touches[0];
            swipeStartRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
          }}
          onTouchEnd={(event) => {
            const start = swipeStartRef.current;
            const touch = event.changedTouches[0];
            swipeStartRef.current = null;
            if (!start || !touch) return;
            const distanceX = touch.clientX - start.x;
            const distanceY = Math.abs(touch.clientY - start.y);
            if (distanceX > 80 && distanceY < 70) setOpen(false);
          }}
        >
          {view === "thread" && isDraggingFiles ? (
            <div className="pointer-events-none absolute inset-3 z-[80] flex items-center justify-center rounded-[24px] border-2 border-dashed border-[#7c83b5] bg-white/85 p-6 text-center shadow-2xl backdrop-blur-md">
              <div>
                <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9eaf8] text-2xl">
                  ⇩
                </span>
                <p className="font-display text-base font-semibold text-[#30344a]">
                  여기에 놓아 첨부하기
                </p>
                <p className="mt-1 text-xs text-[#777c99]">
                  사진·동영상·문서, 한 번에 최대 6개
                </p>
              </div>
            </div>
          ) : null}
          <div className="flex items-center gap-2 border-b border-white/70 bg-white/65 px-4 py-3 backdrop-blur-2xl">
            {view !== "list" && view !== "friends" && view !== "online" ? (
              <button
                type="button"
                onClick={() => setView("list")}
                className="text-fog"
                aria-label="뒤로"
              >
                ←
              </button>
            ) : null}
            {view === "thread" ? (
              <Avatar
                nickname={activeConversation?.title ?? "채팅"}
                url={activeConversation?.avatar_url}
                size="sm"
              />
            ) : null}
            <h2 className="min-w-0 flex-1 truncate font-display text-body font-semibold text-ink">
              {panelTitle}
            </h2>
            {view === "thread" ? (
              <>
                <button
                  type="button"
                  onClick={() => setView("search")}
                  className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs shadow-sm"
                  title="대화 검색"
                >
                  ⌕
                </button>
                <button
                  type="button"
                  onClick={() => setView("study")}
                  className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs shadow-sm"
                  title="스터디 도구"
                >
                  🎯
                </button>
                {activeConversation?.isGroup ? (
                  <button
                    type="button"
                    onClick={() => setView("manage")}
                    className="rounded-full bg-white/80 px-2.5 py-1.5 text-xs shadow-sm"
                    title="그룹 관리"
                  >
                    ⚙
                  </button>
                ) : null}
              </>
            ) : null}
            {view === "list" ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setProfileId(user.id)}
                  className="rounded-full bg-white/80 px-2.5 py-1.5 font-display text-[11px] font-semibold text-ink shadow-sm"
                >
                  내 프로필
                </button>
                <button
                  type="button"
                  onClick={() => void openSelfChat()}
                  className="rounded-full bg-white/80 px-2.5 py-1.5 font-display text-[11px] font-semibold text-ink shadow-sm"
                >
                  나와의 채팅
                </button>
                <button
                  type="button"
                  onClick={() => setView("friends")}
                  className="rounded-full bg-[#007AFF]/10 px-2.5 py-1.5 font-display text-[11px] font-semibold text-[#0066D6]"
                >
                  + 친구
                </button>
                <button
                  type="button"
                  onClick={() => setView("new-group")}
                  className="rounded-full bg-[#007AFF]/10 px-2.5 py-1.5 font-display text-[11px] font-semibold text-[#0066D6]"
                >
                  + 그룹
                </button>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl text-fog transition-colors hover:bg-black/5 active:bg-black/10"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
          {view !== "thread" && view !== "new-group" ? (
            <div className="grid grid-cols-3 border-b border-mist">
              {(
                [
                  [
                    "friends",
                    `친구${incomingRequests.length ? ` ${incomingRequests.length}` : ""}`,
                  ],
                  ["list", "대화"],
                  ["online", `접속 ${onlineUsers.length}`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setView(key)}
                  className={`py-2.5 font-display text-[12px] font-medium ${view === key ? "border-b-2 border-[#007AFF] text-[#0066D6]" : "text-fog"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
          {error ? (
            <div className="flex items-start gap-2 border-b border-rose-200 bg-rose-50 px-3 py-2">
              <p className="flex-1 font-display text-[11px] text-rose-700">
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="text-[11px] text-rose-500"
              >
                ✕
              </button>
            </div>
          ) : null}

          {view === "list" ? (
            <div className="flex-1 overflow-y-auto">
              {conversations.length ? (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => void openThread(conversation)}
                    className="flex w-full items-center gap-3 border-b border-mist/70 px-4 py-3 text-left hover:bg-surface"
                  >
                    <Avatar
                      nickname={conversation.title}
                      url={conversation.avatar_url}
                      onOpen={conversation.otherUser ? () => setProfileId(conversation.otherUser!.id) : undefined}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-display text-body-sm font-semibold text-ink">
                          {conversation.title}
                          {conversation.pinnedAt ? <span className="ml-1 text-[10px]" title="상단 고정">📌</span> : null}
                          {conversation.isGroup ? (
                            <span className="ml-1 text-[10px] font-normal text-fog">
                              {conversation.members.length}명
                            </span>
                          ) : null}
                        </p>
                        {conversation.lastMessage ? (
                          <span className="text-[10px] text-fog">
                            {formatKstChatTime(
                              conversation.lastMessage.created_at,
                            )}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate font-display text-[12px] text-smoke">
                        {messagePreview(conversation.lastMessage)}
                      </p>
                    </div>
                    {conversation.unreadCount ? (
                      <span className="rounded-full bg-[#6366f1] px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {conversation.unreadCount}
                      </span>
                    ) : null}
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label={conversation.pinnedAt ? "채팅방 고정 해제" : "채팅방 상단 고정"}
                      onClick={(event) => { event.stopPropagation(); void toggleConversationPin(conversation); }}
                      onKeyDown={(event) => { if(event.key==="Enter"||event.key===" "){event.preventDefault();event.stopPropagation();void toggleConversationPin(conversation);} }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm text-fog hover:bg-ice"
                    >
                      {conversation.pinnedAt ? "📌" : "⋮"}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-12 text-center text-body-sm text-fog">
                  아직 대화가 없어요.
                  <br />
                  친구 또는 접속 중인 사용자와 시작해 보세요.
                </p>
              )}
            </div>
          ) : null}

          {view === "friends" ? (
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 border-b border-mist bg-paper p-3">
                <div className="flex gap-2">
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="아이디로 친구 찾기"
                    className="min-w-0 flex-1 rounded-xl border border-mist px-3 py-2 text-[13px] outline-none focus:border-[#007AFF]"
                  />
                  <button
                    type="button"
                    onClick={() => void searchProfiles()}
                    className="rounded-xl bg-carbon px-3 text-[12px] font-semibold text-white"
                  >
                    검색
                  </button>
                </div>
              </div>
              {incomingRequests.map((friend) => {
                const profile = friend.requester;
                return (
                  <div
                    key={friend.id}
                    className="flex items-center gap-3 border-b border-mist bg-amber-50/60 px-4 py-3"
                  >
                    <Avatar
                      nickname={profile.nickname}
                      url={profile.avatar_url}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold">
                        {profile.nickname}
                      </p>
                      <p className="text-[11px] text-fog">친구 요청</p>
                    </div>
                    <button
                      onClick={() => void respondFriend(friend.id, true)}
                      className="text-[11px] font-semibold text-[#007AFF]"
                    >
                      수락
                    </button>
                    <button
                      onClick={() => void respondFriend(friend.id, false)}
                      className="text-[11px] text-fog"
                    >
                      거절
                    </button>
                  </div>
                );
              })}
              {searchResults.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center gap-3 border-b border-mist px-4 py-3"
                >
                  <Avatar
                    nickname={profile.nickname}
                    url={profile.avatar_url}
                    onOpen={() => setProfileId(profile.id)}
                  />
                  <p className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                    {profile.nickname}
                  </p>
                  {acceptedFriends.some((friend) => friendProfile(friend).id === profile.id) ? (
                    <button onClick={() => void startDirectChat(profile)} className="text-[11px] font-semibold text-[#007AFF]">메시지</button>
                  ) : (
                    <button onClick={() => void sendFriendRequest(profile)} className="text-[11px] font-semibold text-[#007AFF]">바로 추가</button>
                  )}
                </div>
              ))}
              {acceptedFriends.filter(() => !searchQuery.trim()).map((friend) => {
                const profile = friendProfile(friend);
                return (
                  <div
                    key={friend.id}
                    className="flex items-center gap-3 border-b border-mist px-4 py-3"
                  >
                    <Avatar
                      nickname={profile.nickname}
                      url={profile.avatar_url}
                      onOpen={() => setProfileId(profile.id)}
                    />
                    <p className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                      {profile.nickname}
                    </p>
                    <button
                      onClick={() => void startDirectChat(profile)}
                      className="text-[11px] font-semibold text-[#007AFF]"
                    >
                      메시지
                    </button>
                  </div>
                );
              })}
              {!incomingRequests.length &&
              !searchResults.length &&
              !acceptedFriends.length ? (
                <p className="px-4 py-10 text-center text-[13px] text-fog">
                  아이디를 검색해 친구를 추가해 보세요.
                </p>
              ) : null}
            </div>
          ) : null}

          {view === "online" ? (
            <div className="flex-1 overflow-y-auto">
              {onlineUsers.length ? (
                onlineUsers.map((online) => (
                  <button
                    key={online.user_id}
                    onClick={() =>
                      void startDirectChat({
                        id: online.user_id,
                        nickname: online.nickname,
                        avatar_url: online.avatar_url ?? null,
                      })
                    }
                    className="flex w-full items-center gap-3 border-b border-mist px-4 py-3 text-left"
                  >
                    <div className="relative">
                      <Avatar
                        nickname={online.nickname}
                        url={online.avatar_url}
                        onOpen={() => setProfileId(online.user_id)}
                      />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500" />
                    </div>
                    <p className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                      {online.nickname}
                    </p>
                    <span className="text-[11px] text-[#007AFF]">메시지</span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-10 text-center text-[13px] text-fog">
                  지금 접속 중인 사용자가 없어요.
                </p>
              )}
            </div>
          ) : null}

          {view === "new-group" ? (
            <div className="flex-1 overflow-y-auto p-4">
              <label className="text-[12px] font-semibold text-smoke">
                그룹 이름
              </label>
              <input
                value={groupTitle}
                onChange={(event) => setGroupTitle(event.target.value)}
                maxLength={40}
                placeholder="예: 경찰학 스터디"
                className="mt-2 w-full rounded-xl border border-mist px-3 py-2.5 text-[13px] outline-none focus:border-[#007AFF]"
              />
              <p className="mb-2 mt-5 text-[12px] font-semibold text-smoke">
                친구 선택 · 최소 2명
              </p>
              <div className="overflow-hidden rounded-xl border border-mist">
                {acceptedFriends.map((friend) => {
                  const profile = friendProfile(friend);
                  const checked = groupMembers.includes(profile.id);
                  return (
                    <label
                      key={friend.id}
                      className="flex cursor-pointer items-center gap-3 border-b border-mist px-3 py-2.5 last:border-0"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setGroupMembers((items) =>
                            checked
                              ? items.filter((id) => id !== profile.id)
                              : [...items, profile.id],
                          )
                        }
                      />
                      <Avatar
                        nickname={profile.nickname}
                        url={profile.avatar_url}
                        size="sm"
                      />
                      <span className="text-[13px] font-semibold">
                        {profile.nickname}
                      </span>
                    </label>
                  );
                })}
                {acceptedFriends.length === 0 ? (
                  <p className="p-5 text-center text-[12px] text-fog">
                    먼저 친구를 추가해주세요.
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                disabled={
                  loading ||
                  groupTitle.trim().length < 2 ||
                  groupMembers.length < 2
                }
                onClick={() => void createGroup()}
                className="mt-5 w-full rounded-xl bg-[#007AFF] py-3 text-[13px] font-semibold text-white disabled:opacity-40"
              >
                {loading
                  ? "만드는 중..."
                  : `그룹채팅 만들기 (${groupMembers.length}명 선택)`}
              </button>
            </div>
          ) : null}

          {view === "search" ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm">
                <input
                  autoFocus
                  value={messageSearch}
                  onChange={(event) => setMessageSearch(event.target.value)}
                  placeholder="메시지·작성자·파일 검색"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <div className="mt-3 space-y-2">
                {messages
                  .filter((message) =>
                    `${message.author.nickname} ${message.content} ${message.attachments.map((item) => item.file_name).join(" ")}`
                      .toLowerCase()
                      .includes(messageSearch.toLowerCase()),
                  )
                  .map((message) => (
                    <button
                      key={message.id}
                      onClick={() => setView("thread")}
                      className="block w-full rounded-2xl border border-white bg-white/70 p-3 text-left shadow-sm"
                    >
                      <b className="text-xs">{message.author.nickname}</b>
                      <p className="mt-1 line-clamp-2 text-xs text-smoke">
                        {message.content ||
                          message.attachments
                            .map((item) => item.file_name)
                            .join(", ")}
                      </p>
                      <small className="text-[10px] text-fog">
                        {formatKstChatTime(message.created_at)}
                      </small>
                    </button>
                  ))}
              </div>
            </div>
          ) : null}

          {view === "study" ? (
            <div className="flex-1 overflow-y-auto p-5">
              <div className="rounded-3xl bg-gradient-to-br from-[#007AFF] to-[#7c3aed] p-5 text-white shadow-xl">
                <p className="text-xs text-white/75">STUDY ROOM</p>
                <h3 className="mt-1 text-xl font-bold">
                  {activeConversation?.title}
                </h3>
                <p className="mt-3 text-sm text-white/80">
                  공지·일정·목표·인증·투표를 채팅방에 고정하세요.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {[
                  ["notice", "📌", "공지"],
                  ["schedule", "📅", "일정"],
                  ["goal", "🎯", "목표"],
                  ["checkin", "✅", "인증"],
                  ["poll", "📊", "투표"],
                ].map(([kind, icon, label]) => (
                  <button
                    key={kind}
                    onClick={() => setStudyKind(kind)}
                    className={`rounded-2xl p-2 text-center ${studyKind === kind ? "bg-[#007AFF] text-white" : "bg-white shadow-sm"}`}
                  >
                    <span className="block text-xl">{icon}</span>
                    <small>{label}</small>
                  </button>
                ))}
              </div>
              <input
                value={studyTitle}
                onChange={(event) => setStudyTitle(event.target.value)}
                placeholder="내용을 입력하세요"
                className="mt-4 w-full rounded-2xl border border-white bg-white/80 px-4 py-3 text-sm outline-none shadow-sm"
              />
              <button
                onClick={() => void createStudyTool()}
                disabled={!studyTitle.trim()}
                className="mt-3 w-full rounded-2xl bg-carbon py-3 text-sm font-bold text-white disabled:opacity-40"
              >
                채팅방에 만들기
              </button>
              <button
                onClick={() => void requestDesktopNotifications()}
                className="mt-3 w-full rounded-2xl border border-white bg-white/70 py-3 text-sm font-semibold shadow-sm"
              >
                🔔 새 메시지 알림 켜기
              </button>
            </div>
          ) : null}

          {view === "manage" ? (
            <div className="flex-1 overflow-y-auto p-5">
              <div className="rounded-3xl border border-white bg-white/75 p-5 shadow-sm">
                <h3 className="font-bold">그룹 관리</h3>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      const name = window.prompt(
                        "새 그룹 이름",
                        activeConversation?.title,
                      );
                      if (name) void manageGroup("rename", undefined, name);
                    }}
                    className="rounded-xl bg-surface px-3 py-2 text-xs"
                  >
                    이름 변경
                  </button>
                  <button
                    onClick={() => {
                      const seconds = window.prompt(
                        "느린 채팅 초",
                        String(activeConversation?.slow_mode_seconds ?? 0),
                      );
                      if (seconds)
                        void manageGroup("slow_mode", undefined, seconds);
                    }}
                    className="rounded-xl bg-surface px-3 py-2 text-xs"
                  >
                    느린 채팅
                  </button>
                </div>
              </div>
              <h4 className="mb-2 mt-5 text-xs font-bold text-smoke">
                참여자 {activeConversation?.members.length}명
              </h4>
              <div className="overflow-hidden rounded-2xl bg-white/75 shadow-sm">
                {activeConversation?.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 border-b border-mist p-3 last:border-0"
                  >
                    <Avatar
                      nickname={member.nickname}
                      url={member.avatar_url}
                      size="sm"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                      {member.nickname}
                    </span>
                    <small className="rounded-full bg-surface px-2 py-1">
                      {member.role}
                    </small>
                    {member.id !== user.id && member.role !== "owner" ? (
                      <button
                        onClick={() => void manageGroup("remove", member.id)}
                        className="text-[10px] text-coral"
                      >
                        내보내기
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {view === "thread" ? (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {activeConversation?.isGroup ? (
                  <p className="mb-3 text-center text-[10px] text-fog">
                    {activeConversation.members
                      .map((member) => member.nickname)
                      .join(", ")}
                  </p>
                ) : null}
                {loading ? (
                  <p className="py-8 text-center text-[13px] text-fog">
                    불러오는 중...
                  </p>
                ) : messages.length ? (
                  messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isMine={message.sender_id === user.id}
                      readCount={
                        message.sender_id === user.id
                          ? (activeConversation?.members.filter(
                              (member) =>
                                member.id !== user.id &&
                                Boolean(
                                  member.last_read_at &&
                                    member.last_read_at >= message.created_at,
                                ),
                            ).length ?? 0)
                          : 0
                      }
                      onReply={() => setReplyTo(message)}
                      onEdit={() => void editMessage(message)}
                      onDelete={() => void deleteMessage(message)}
                      onReact={(emoji) => void reactToMessage(message, emoji)}
                    />
                  ))
                ) : (
                  <p className="py-8 text-center text-[13px] text-fog">
                    첫 메시지를 보내보세요.
                  </p>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form
                className="border-t border-white/70 bg-white/70 p-3 backdrop-blur-2xl"
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage();
                }}
              >
                {replyTo ? (
                  <div className="mb-2 flex items-center gap-2 rounded-xl bg-[#007AFF]/8 px-3 py-2 text-xs">
                    <span>↩</span>
                    <p className="min-w-0 flex-1 truncate">
                      {replyTo.author.nickname}:{" "}
                      {replyTo.content || "첨부 메시지"}
                    </p>
                    <button type="button" onClick={() => setReplyTo(null)}>
                      ×
                    </button>
                  </div>
                ) : null}
                {selectedFiles.length ? (
                  <div className="mb-2 flex gap-2 overflow-x-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="relative flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-mist bg-surface px-1 text-center text-[9px] text-smoke"
                      >
                        {file.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>
                            {file.type.startsWith("video/") ? "🎬" : "📄"}
                            <br />
                            {file.name}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedFiles((items) =>
                              items.filter((_, i) => i !== index),
                            )
                          }
                          className="absolute right-0 top-0 rounded-bl bg-black/60 px-1 text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={sending || preparingFiles}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#007AFF] to-[#7c3aed] text-xl text-white shadow-md"
                    aria-label="사진 동영상 또는 파일 첨부"
                  >
                    ＋
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                      const files = [...(event.target.files ?? [])];
                      void queueFiles(files);
                      event.target.value = "";
                    }}
                  />
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={2}
                    placeholder="메시지를 입력하세요"
                    className="max-h-28 min-h-11 min-w-0 flex-1 resize-none rounded-[20px] border border-white bg-white/90 px-4 py-2.5 text-base shadow-inner outline-none focus:ring-2 focus:ring-[#007AFF]/20 sm:text-[13px]"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void sendMessage();
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={
                      sending ||
                      preparingFiles ||
                      (!draft.trim() && !selectedFiles.length)
                    }
                    className="rounded-full bg-carbon px-4 py-2.5 text-[12px] font-semibold text-white shadow-md disabled:opacity-40"
                  >
                    {preparingFiles ? "준비 중" : sending ? "전송 중" : "전송"}
                  </button>
                </div>
                <p className="mt-1.5 text-center text-[9px] text-fog">
                  사진 10MB · 동영상 100MB · 문서 30MB · 한 번에 최대 6개
                </p>
              </form>
            </>
          ) : null}
        </div>
      ) : null}
      {profileId ? <ChatProfileModal profileId={profileId} myUserId={user.id} onClose={() => setProfileId(null)} /> : null}
    </>
  );
}
