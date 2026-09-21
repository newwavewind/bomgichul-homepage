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
import {
  ExamCardBubble,
  WrongShareBubble,
  TimerBubble,
  PollBubble,
  MockInviteBubble,
  MockResultBubble,
  SpoilerChip,
  CheckinBubble,
  SystemBubble,
  ScheduleShareBubble,
  ReminderBubble,
  NoteCardBubble,
  LiveSessionBubble,
} from "@/components/chat/ChatRichBubbles";
import { ChatPrefsBar, useChatPrefs, useTopicRooms } from "@/components/chat/ChatFeatureHooks";
import { peekChatShareDraft, clearChatShareDraft } from "@/components/chat/ShareToChatButton";
import {
  ChatGlobalSearch,
  ChatMediaGallery,
  ChatStudyCalendar,
  ChatRoomVault,
} from "@/components/chat/ChatExtras";
import {
  extractMentionUserIds,
  messageMatchesKeywords,
  TOPIC_TEASERS,
  COMMUNITY_HOME_GROUPS,
  STUDY_STICKERS,
  SOCIAL_REACTIONS,
  stickerLabel,
  tokenizeChatText,
  parseGichulInlineQuery,
  type ExamCardPayload,
  type WrongSharePayload,
  type TimerPayload,
  type PollPayload,
  type MockInvitePayload,
  type MockResultPayload,
  type CheckinPayload,
  type ScheduleSharePayload,
  type ReminderPayload,
  type NoteCardPayload,
  type LiveSessionPayload,
} from "@/lib/chat/features";
import { EXAM_SUBJECTS } from "@/lib/constants";
import { communityBaseHref } from "@/lib/exam-track/community";
import type { CommunityScope, DmBookmarkFolder } from "@/types/database";
import "@/components/chat/chat-polish.css";
import {
  BrandChatFab,
  ChatToast,
  ChatSheet,
  OverflowMenu,
  ChatEmptyState,
  ComposerPlusSheet,
  ChatBackButton,
  ChatHeaderAction,
} from "@/components/chat/ChatUiKit";
import { ChatSharePicker, type PickedShare } from "@/components/chat/ChatSharePicker";

type ChatUser = {
  id: string;
  nickname: string;
  avatar_url: string | null;
  isAdmin: boolean;
};
type View =
  | "list"
  | "friends"
  | "thread"
  | "new-group"
  | "search"
  | "global-search"
  | "study"
  | "manage"
  | "topics"
  | "communities"
  | "bookmarks"
  | "settings"
  | "gallery"
  | "calendar"
  | "vault"
  | "thread-detail";
type ProfileRow = { id: string; nickname: string; avatar_url: string | null };
type FriendRow = Friendship & { requester: ProfileRow; addressee: ProfileRow };
type ShareMode = "none" | "exam" | "wrong" | "timer" | "poll" | "mock" | "note" | "live";

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
const REACTIONS = [...STUDY_STICKERS.map((s) => s.emoji), ...SOCIAL_REACTIONS] as const;

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
  readMembers,
  nowMs,
  onReply,
  onEdit,
  onDelete,
  onReact,
  onBookmark,
  onReport,
  onPollVote,
  onPin,
  onOpenThread,
  onRecordView,
  onForward,
  onQuote,
  onHashtag,
  onOpenMockMini,
  onJoinLive,
}: {
  message: DmMessage;
  isMine: boolean;
  readCount: number;
  readMembers?: Array<{ nickname: string; avatar_url?: string | null }>;
  nowMs: number;
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReact: (emoji: string) => void;
  onBookmark: () => void;
  onReport: () => void;
  onPollVote?: (key: string) => void;
  onPin?: () => void;
  onOpenThread?: () => void;
  onRecordView?: () => void;
  onForward?: () => void;
  onQuote?: () => void;
  onHashtag?: (tag: string) => void;
  onOpenMockMini?: (payload: MockInvitePayload) => void;
  onJoinLive?: () => void;
}) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const [stickerOpen, setStickerOpen] = useState(false);
  const viewCount = message.views?.length ?? 0;
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
    if (!actionsOpen && !stickerOpen) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!actionMenuRef.current?.contains(event.target as Node)) {
        setActionsOpen(false);
        setStickerOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [actionsOpen, stickerOpen]);

  const runAction = (action: () => void) => {
    setActionsOpen(false);
    action();
  };

  return (
    <div
      id={`dm-msg-${message.id}`}
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
        className={`chat-bubble-enter max-w-[84%] overflow-hidden rounded-[18px] font-display chat-body text-ink ${isMine ? "rounded-br-md bg-[var(--chat-mine)] ring-1 ring-inset ring-[var(--chat-mine-ring)]" : "rounded-bl-md border border-mist bg-paper"}`}
      >
        {message.payload &&
        typeof message.payload === "object" &&
        (message.payload as { forwarded?: boolean }).forwarded ? (
          <p className="mx-2 mt-2 text-[10px] font-semibold text-[#0066D6]">↪ 전달된 메시지</p>
        ) : null}
        {message.payload &&
        typeof message.payload === "object" &&
        (message.payload as { quoted?: boolean }).quoted &&
        !(message.payload as { forwarded?: boolean }).forwarded ? (
          <p className="mx-2 mt-2 text-[10px] font-semibold text-[#0066D6]">❝ 인용</p>
        ) : null}
        {message.reply_to ? (
          <div
            className={`mx-2 mt-2 rounded-xl border-l-2 px-2.5 py-1.5 chat-meta ${isMine ? "border-[#007AFF]/40 bg-white/50 text-smoke" : "border-[#007AFF] bg-[#007AFF]/5 text-smoke"}`}
          >
            ↩ {message.reply_to.content || "첨부 메시지"}
          </div>
        ) : null}
        {!message.deleted_at && message.message_kind === "exam_card" && message.payload ? (
          <div className="p-2">
            <ExamCardBubble
              payload={message.payload as unknown as ExamCardPayload}
              mine={isMine}
              viewCount={viewCount}
              repostCount={message.repostCount ?? 0}
              onRecordView={onRecordView}
            />
          </div>
        ) : null}
        {!message.deleted_at && message.message_kind === "wrong_share" && message.payload ? (
          <div className="p-2">
            <WrongShareBubble
              payload={message.payload as unknown as WrongSharePayload}
              mine={isMine}
              viewCount={viewCount}
              repostCount={message.repostCount ?? 0}
              onRecordView={onRecordView}
            />
          </div>
        ) : null}
        {!message.deleted_at && message.message_kind === "timer" && message.payload ? (
          <div className="p-2">
            <TimerBubble payload={message.payload as unknown as TimerPayload} nowMs={nowMs} />
          </div>
        ) : null}
        {!message.deleted_at && message.message_kind === "poll" && message.payload ? (
          <div className="p-2">
            <PollBubble
              payload={message.payload as unknown as PollPayload}
              myVote={(message.payload as { myVote?: string }).myVote ?? null}
              tallies={(message.payload as { tallies?: Record<string, number> }).tallies ?? {}}
              onVote={(key) => onPollVote?.(key)}
              disabled={!onPollVote}
              nowMs={nowMs}
            />
          </div>
        ) : null}
        {!message.deleted_at && message.message_kind === "mock_invite" && message.payload ? (
          <div className="p-2">
            <MockInviteBubble
              payload={message.payload as unknown as MockInvitePayload}
              mine={isMine}
              onOpenMini={
                onOpenMockMini
                  ? () =>
                      onOpenMockMini(
                        message.payload as unknown as MockInvitePayload,
                      )
                  : undefined
              }
            />
          </div>
        ) : null}
        {!message.deleted_at && message.message_kind === "mock_result" && message.payload ? (
          <div className="p-2">
            <MockResultBubble
              payload={message.payload as unknown as MockResultPayload}
              mine={isMine}
            />
          </div>
        ) : null}
        {!message.deleted_at && message.message_kind === "checkin" ? (
          <div className="p-2">
            <CheckinBubble
              payload={(message.payload ?? {}) as CheckinPayload}
              content={message.content}
              mine={isMine}
            />
          </div>
        ) : null}
        {!message.deleted_at && message.message_kind === "system" ? (
          <SystemBubble content={message.content} payload={message.payload} />
        ) : null}
        {!message.deleted_at && message.message_kind === "schedule_share" && message.payload ? (
          <div className="p-2">
            <ScheduleShareBubble
              payload={message.payload as unknown as ScheduleSharePayload}
              mine={isMine}
            />
          </div>
        ) : null}
        {!message.deleted_at && message.message_kind === "reminder" && message.payload ? (
          <div className="p-2">
            <ReminderBubble payload={message.payload as unknown as ReminderPayload} />
          </div>
        ) : null}
        {!message.deleted_at && message.message_kind === "note_card" && message.payload ? (
          <div className="p-2">
            <NoteCardBubble
              payload={message.payload as unknown as NoteCardPayload}
              mine={isMine}
            />
          </div>
        ) : null}
        {!message.deleted_at && message.message_kind === "live_session" && message.payload ? (
          <div className="p-2">
            <LiveSessionBubble
              payload={message.payload as unknown as LiveSessionPayload}
              nowMs={nowMs}
              mine={isMine}
              onJoin={onJoinLive}
            />
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
              ) : attachment.kind === "audio" ? (
                <div key={attachment.id} className="m-2 rounded-xl bg-white/20 p-3">
                  <p className="mb-1 text-[11px] opacity-70">음성 메시지</p>
                  <audio src={attachment.signed_url} controls preload="metadata" className="w-full" />
                </div>
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
            <p className="whitespace-pre-wrap break-words">
              {tokenizeChatText(message.content).map((part, i) => {
                if (part.type === "mention") {
                  return (
                    <span key={i} className="font-semibold text-[#0066D6]">
                      {part.value}
                    </span>
                  );
                }
                if (part.type === "hashtag") {
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onHashtag?.(part.value)}
                      className="mx-0.5 font-semibold text-[#0066D6] underline-offset-2 hover:underline"
                    >
                      {part.value}
                    </button>
                  );
                }
                if (part.type === "spoiler") {
                  return <SpoilerChip key={i} text={part.value} />;
                }
                return <span key={i}>{part.value}</span>;
              })}
            </p>
          ) : null}
          <p
            className="mt-1 chat-meta"
          >
            {!isMine ? `${message.author.nickname} · ` : ""}
            {formatKstChatTime(message.created_at)}
            {message.edited_at ? " · 수정됨" : ""}
            {isMine && readCount > 0 ? ` · ${readCount}명 읽음` : ""}
          </p>
          {isMine && readMembers && readMembers.length > 0 ? (
            <div className="mt-1 flex -space-x-1.5">
              {readMembers.slice(0, 5).map((m, i) => (
                <span
                  key={`${m.nickname}-${i}`}
                  title={m.nickname}
                  className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-white bg-ice text-[9px] font-bold"
                >
                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    m.nickname.slice(0, 1)
                  )}
                </span>
              ))}
            </div>
          ) : null}
          {onOpenThread ? (
            <button
              type="button"
              onClick={onOpenThread}
              className="mt-1 text-[10px] font-semibold text-[#0066D6]"
            >
              스레드 보기
            </button>
          ) : null}
          {grouped.length ? (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {grouped.map(([emoji, count]) => {
                const label = stickerLabel(emoji);
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onReact(emoji)}
                    className="rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] font-semibold text-ink ring-1 ring-mist"
                    title={label ?? emoji}
                  >
                    {emoji}
                    {label ? ` ${label}` : ""} {count}
                  </button>
                );
              })}
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
            className={`chat-hit chat-focus flex items-center justify-center rounded-full text-sm tracking-widest transition ${actionsOpen ? "bg-white text-ink shadow-sm" : "text-slate-300 hover:bg-white/70 hover:text-slate-500"}`}
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
              <button
                type="button"
                onClick={() => runAction(onBookmark)}
                className="rounded-full px-2 py-1 text-[11px] text-smoke hover:bg-ice"
                title="북마크"
              >
                {message.bookmarked ? "★" : "☆"}
              </button>
              {onForward ? (
                <button
                  type="button"
                  onClick={() => runAction(onForward)}
                  className="rounded-full px-2 py-1 text-[11px] text-smoke hover:bg-ice"
                  title="전달"
                >
                  전달
                </button>
              ) : null}
              {onQuote ? (
                <button
                  type="button"
                  onClick={() => runAction(onQuote)}
                  className="rounded-full px-2 py-1 text-[11px] text-smoke hover:bg-ice"
                  title="인용"
                >
                  인용
                </button>
              ) : null}
              {onPin ? (
                <button
                  type="button"
                  onClick={() => runAction(onPin)}
                  className="rounded-full px-2 py-1 text-[11px] text-smoke hover:bg-ice"
                  title="고정"
                >
                  📌
                </button>
              ) : null}
              {STUDY_STICKERS.slice(0, 3).map((sticker) => (
                <button
                  type="button"
                  key={sticker.emoji}
                  onClick={() => runAction(() => onReact(sticker.emoji))}
                  className="rounded-full px-1.5 py-1 text-xs hover:bg-ice"
                  aria-label={`${sticker.label} 스티커`}
                  title={sticker.label}
                >
                  {sticker.emoji}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setStickerOpen(true);
                  setActionsOpen(false);
                }}
                className="rounded-full px-2 py-1 text-[11px] font-semibold text-[#0066D6] hover:bg-[#007AFF]/10"
              >
                스티커
              </button>
              {!isMine ? (
                <button
                  type="button"
                  onClick={() => runAction(onReport)}
                  className="rounded-full px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50"
                >
                  신고
                </button>
              ) : null}
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
                    className="rounded-full px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50"
                  >
                    삭제
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
          {stickerOpen ? (
            <div
              className={`absolute bottom-9 z-50 w-[220px] rounded-2xl border border-mist bg-white p-2 shadow-xl ${isMine ? "left-0" : "right-0"}`}
            >
              <p className="mb-1.5 px-1 text-[10px] font-semibold text-fog">학습 스티커</p>
              <div className="grid grid-cols-3 gap-1">
                {STUDY_STICKERS.map((sticker) => (
                  <button
                    key={sticker.emoji}
                    type="button"
                    onClick={() => {
                      setStickerOpen(false);
                      onReact(sticker.emoji);
                    }}
                    className="flex flex-col items-center rounded-xl px-1 py-2 hover:bg-[#007AFF]/8"
                  >
                    <span className="text-lg">{sticker.emoji}</span>
                    <span className="mt-0.5 text-[10px] font-semibold text-smoke">
                      {sticker.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mb-1 mt-2 px-1 text-[10px] font-semibold text-fog">일반</p>
              <div className="flex flex-wrap gap-1">
                {SOCIAL_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setStickerOpen(false);
                      onReact(emoji);
                    }}
                    className="rounded-full px-2 py-1 text-sm hover:bg-ice"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
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
  forceOpen = false,
  openNonce = 0,
}: {
  user: ChatUser;
  initialConversations: DmConversationPreview[];
  forceOpen?: boolean;
  openNonce?: number;
}) {
  const [open, setOpen] = useState(false);
  const [view, setViewRaw] = useState<View>("list");
  const [viewStack, setViewStack] = useState<View[]>([]);
  const viewRef = useRef<View>("list");
  viewRef.current = view;
  const isRootTab = (v: View) => v === "list" || v === "friends";
  const setView = (next: View) => {
    const current = viewRef.current;
    if (current === next) return;
    if (isRootTab(current) && isRootTab(next)) {
      setViewRaw(next);
      return;
    }
    setViewStack((stack) => [...stack, current]);
    setViewRaw(next);
  };
  const goBack = () => {
    setViewStack((stack) => {
      if (stack.length === 0) {
        setViewRaw("list");
        viewRef.current = "list";
        return stack;
      }
      const prev = stack[stack.length - 1]!;
      setViewRaw(prev);
      viewRef.current = prev;
      return stack.slice(0, -1);
    });
  };
  const [conversations, setConversations] = useState(initialConversations);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<DmConversationPreview | null>(null);
  const [messages, setMessages] = useState<DmMessage[]>([]);
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [memberDirectory, setMemberDirectory] = useState<ProfileRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProfileRow[]>([]);
  const [groupTitle, setGroupTitle] = useState("");
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<DmMessage | null>(null);
  const [messageSearch, setMessageSearch] = useState("");
  const [studyTitle, setStudyTitle] = useState("");
  const [studyKind, setStudyKind] = useState("notice");
  const [studyDueAt, setStudyDueAt] = useState("");
  const [studyPlace, setStudyPlace] = useState("");
  const [studyDdayDraft, setStudyDdayDraft] = useState("");
  const [studyGoalDraft, setStudyGoalDraft] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [preparingFiles, setPreparingFiles] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"info" | "success" | "error">("info");
  const [plusOpen, setPlusOpen] = useState(false);
  const [sheet, setSheet] = useState<
    | null
    | { type: "keywords"; value: string }
    | { type: "report"; message: DmMessage; reason: string; details: string }
    | { type: "checkin"; note: string }
    | { type: "edit"; message: DmMessage; value: string }
    | { type: "rename"; value: string }
    | { type: "slow"; value: string }
    | { type: "forward"; message: DmMessage }
    | { type: "quote"; message: DmMessage; comment: string }
    | { type: "bookmark-folder"; message: DmMessage; folderId: string }
    | { type: "new-folder"; name: string }
    | { type: "schedule"; title: string; dueAt: string; place: string }
    | { type: "mock-mini"; subject: string; year: string; href: string }
  >(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [listFilter, setListFilter] = useState<"all" | "unread" | "mention" | "archived">("all");
  const [showArchived, setShowArchived] = useState(false);
  const [shareMode, setShareMode] = useState<ShareMode>("none");
  const [pollDueHours, setPollDueHours] = useState(24);
  const [pollCorrectKey, setPollCorrectKey] = useState<"O" | "X">("O");
  const [threadRoot, setThreadRoot] = useState<DmMessage | null>(null);
  const [pinnedBanner, setPinnedBanner] = useState<DmMessage | null>(null);
  const [pinnedList, setPinnedList] = useState<
    Array<{
      message_id: string;
      content: string;
      message_kind: string;
      pinned_at: string;
    }>
  >([]);
  const [pinnedListOpen, setPinnedListOpen] = useState(false);
  const [gichulHits, setGichulHits] = useState<
    Array<{
      examId: string;
      subject: string;
      year: number;
      questionNo: number;
      stem: string;
    }>
  >([]);
  const [gichulLoading, setGichulLoading] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [shareExamId, setShareExamId] = useState("");
  const [shareStem, setShareStem] = useState("");
  const [shareMeta, setShareMeta] = useState("");
  const [sharePick, setSharePick] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [liveTitle, setLiveTitle] = useState("");
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [pollQuestion, setPollQuestion] = useState("");
  const [bookmarkRows, setBookmarkRows] = useState<DmMessage[]>([]);
  const [bookmarkFolders, setBookmarkFolders] = useState<DmBookmarkFolder[]>([]);
  const [bookmarkFolderFilter, setBookmarkFolderFilter] = useState<string | "all" | "inbox">(
    "all",
  );
  const [communityScope, setCommunityScope] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const presenceChannelRef = useRef<RealtimeChannel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const { prefs, save: savePrefs, bumpDailyDone, doneToday, goalCount } = useChatPrefs(user.id);
  const notify = (message: string, tone: "info" | "success" | "error" = "info") => {
    setToastTone(tone);
    setError(message);
  };

  useEffect(() => {
    if (!forceOpen && openNonce === 0) return;
    setOpen(true);
    const draft = peekChatShareDraft();
    if (!draft) return;
    if (draft.mode === "mock_result") {
      try {
        sessionStorage.setItem(
          "bomgichul.pendingMockResult",
          JSON.stringify(draft),
        );
      } catch {
        /* ignore */
      }
      clearChatShareDraft();
      setView("list");
      notify("대화를 고른 뒤 모의고사 결과가 전송돼요.", "info");
      return;
    }
    setShareMode(draft.mode);
    setShareExamId(draft.examId);
    setShareStem(draft.stem);
    let meta = [draft.subject, draft.year, draft.questionNo]
      .filter(Boolean)
      .join("|");
    try {
      const extra = sessionStorage.getItem("bomgichul.chatShareMeta");
      if (extra) {
        meta = extra;
        sessionStorage.removeItem("bomgichul.chatShareMeta");
      }
    } catch {
      /* ignore */
    }
    setShareMeta(meta);
    try {
      const mode = sessionStorage.getItem("bomgichul.chatShareMode");
      if (mode === "mock") {
        setShareMode("mock");
        sessionStorage.removeItem("bomgichul.chatShareMode");
      }
    } catch {
      /* ignore */
    }
    if (draft.myPick) setSharePick(draft.myPick);
    setView("list");
  }, [forceOpen, openNonce]);
  const { rooms: topicRooms, loading: topicsLoading, join: joinTopic } = useTopicRooms(
    open && (view === "topics" || view === "communities"),
  );

  const channelPostBlocked =
    activeConversation?.posting_mode === "admin_only" && !user.isAdmin;

  useEffect(() => {
    const query = parseGichulInlineQuery(draft);
    if (query === null) {
      setGichulHits([]);
      setGichulLoading(false);
      return;
    }
    const timer = window.setTimeout(() => {
      void (async () => {
        setGichulLoading(true);
        try {
          const tokens = query.split(/\s+/).filter(Boolean);
          const yearToken = tokens.find((t) => /^\d{4}$/.test(t));
          const year = yearToken ? Number(yearToken) : NaN;
          const subjectToken = tokens.find(
            (t) =>
              EXAM_SUBJECTS.some(
                (s) =>
                  s.value === t ||
                  s.label === t ||
                  s.label.includes(t) ||
                  t.includes(s.label),
              ),
          );
          const subject =
            EXAM_SUBJECTS.find(
              (s) =>
                s.value === subjectToken ||
                s.label === subjectToken ||
                (subjectToken &&
                  (s.label.includes(subjectToken) ||
                    subjectToken.includes(s.label))),
            )?.value ?? "";
          const rest = tokens
            .filter((t) => t !== yearToken && t !== subjectToken)
            .join(" ")
            .toLowerCase();

          if (!subject || !Number.isFinite(year)) {
            setGichulHits([]);
            setGichulLoading(false);
            return;
          }

          const res = await fetch(
            `/api/chat/share-catalog?kind=questions&subject=${encodeURIComponent(subject)}&year=${year}`,
          );
          const data = (await res.json()) as {
            questions?: Array<{
              examId: string;
              subject: string;
              year: number;
              questionNo: number;
              stem: string;
            }>;
          };
          let hits = data.questions ?? [];
          if (rest) {
            hits = hits.filter(
              (q) =>
                String(q.questionNo).includes(rest) ||
                q.stem.toLowerCase().includes(rest),
            );
          }
          setGichulHits(hits.slice(0, 12));
        } catch {
          setGichulHits([]);
        } finally {
          setGichulLoading(false);
        }
      })();
    }, 280);
    return () => window.clearTimeout(timer);
  }, [draft]);

  const unreadTotal = useMemo(
    () => conversations.reduce((sum, item) => sum + item.unreadCount, 0),
    [conversations],
  );
  const visibleConversations = useMemo(() => {
    return conversations.filter((c) => {
      const archived = Boolean(c.archivedAt);
      if (listFilter === "archived") return archived;
      if (archived && !showArchived) return false;
      if (listFilter === "unread") return c.unreadCount > 0;
      if (listFilter === "mention") return Boolean(c.mentionUnread);
      return true;
    });
  }, [conversations, listFilter, showArchived]);
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
  const onlineById = useMemo(
    () => new Map(onlineUsers.map((item) => [item.user_id, item])),
    [onlineUsers],
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
      .select("conversation_id,last_read_at,pinned_at,archived_at,muted_until")
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
    const archivedById = Object.fromEntries(memberships.map((item) => [item.conversation_id, item.archived_at]));
    const mutedById = Object.fromEntries(memberships.map((item) => [item.conversation_id, item.muted_until]));
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
          .select("id,conversation_id,sender_id,content,created_at,mention_user_ids,message_kind,scheduled_for,published_at")
          .in("conversation_id", ids)
          .or(
            `scheduled_for.is.null,published_at.not.is.null,and(sender_id.eq.${user.id},published_at.is.null,scheduled_for.not.is.null)`,
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("dm_conversations")
          .select(
            "id,title,is_group,is_self,avatar_url,updated_at,pinned_message_id,slow_mode_seconds,study_dday,study_goal,kind,topic_key,topic_label,invite_code,posting_mode",
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
          kind: null,
          topic_key: null,
          topic_label: null,
          invite_code: null,
          posting_mode: null,
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
        const mentionUnread = Boolean(
          last &&
            last.sender_id !== user.id &&
            last.created_at > (lastRead[row.id] ?? "") &&
            Array.isArray(last.mention_user_ids) &&
            last.mention_user_ids.includes(user.id),
        );
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
          archivedAt: archivedById[row.id] ?? null,
          mutedUntil: mutedById[row.id] ?? null,
          kind: (row.kind as DmConversationPreview["kind"]) ?? (row.is_self ? "self" : row.is_group ? "group" : "dm"),
          topicKey: row.topic_key ?? null,
          topicLabel: row.topic_label ?? null,
          inviteCode: row.invite_code ?? null,
          lastMessage: last,
          unreadCount:
            last &&
            last.sender_id !== user.id &&
            last.created_at > (lastRead[row.id] ?? "")
              ? 1
              : 0,
          mentionUnread,
          updatedAt: row.updated_at ?? last?.created_at ?? "",
          pinned_message_id: row.pinned_message_id,
          slow_mode_seconds: row.slow_mode_seconds,
          study_dday: row.study_dday,
          study_goal: row.study_goal,
          posting_mode:
            (row as { posting_mode?: "open" | "admin_only" | null }).posting_mode ??
            null,
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

  const loadPinnedList = useCallback(async (conversationId: string) => {
    const { data, error: pinListError } = await createClient().rpc(
      "list_dm_pinned_messages",
      { p_conversation_id: conversationId },
    );
    if (pinListError) {
      setPinnedList([]);
      return;
    }
    setPinnedList(
      ((data ?? []) as Array<{
        message_id: string;
        content: string;
        message_kind: string;
        pinned_at: string;
      }>).map((row) => ({
        message_id: row.message_id,
        content: row.content,
        message_kind: row.message_kind,
        pinned_at: row.pinned_at,
      })),
    );
  }, []);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      let { data, error: fetchError } = await supabase
        .from("dm_messages")
        .select(
          "id,conversation_id,sender_id,content,reply_to_id,thread_root_id,edited_at,deleted_at,created_at,message_kind,payload,scheduled_for,published_at,mention_user_ids,profiles:sender_id(nickname,avatar_url),dm_message_attachments(*),dm_message_reactions(*),dm_message_views(user_id,created_at)",
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
            dm_message_views: [],
            reply_to_id: null,
            edited_at: null,
            deleted_at: null,
            message_kind: "text",
            payload: {},
            scheduled_for: null,
            published_at: row.created_at,
            mention_user_ids: [],
            thread_root_id: null,
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
          views: (
            (
              row as unknown as {
                dm_message_views?: Array<{ user_id: string; created_at?: string }>;
              }
            ).dm_message_views ?? []
          ).map((v) => ({
            message_id: row.id as string,
            user_id: v.user_id,
            created_at: v.created_at,
          })),
          message_kind: (row as { message_kind?: DmMessage["message_kind"] }).message_kind ?? "text",
          payload: ((row as { payload?: Record<string, unknown> }).payload ?? {}) as Record<string, unknown>,
          scheduled_for: (row as { scheduled_for?: string | null }).scheduled_for ?? null,
          published_at: (row as { published_at?: string | null }).published_at ?? null,
          mention_user_ids: (row as { mention_user_ids?: string[] }).mention_user_ids ?? [],
          thread_root_id: (row as { thread_root_id?: string | null }).thread_root_id ?? null,
        };
      }).filter((message) => {
        if (!message.scheduled_for || message.published_at) return true;
        return message.sender_id === user.id;
      });
      const messageIds = mapped.map((m) => m.id);
      if (messageIds.length) {
        const { data: marks } = await supabase
          .from("dm_message_bookmarks")
          .select("message_id,folder_id")
          .eq("user_id", user.id)
          .in("message_id", messageIds);
        const marked = new Map(
          (marks ?? []).map((m) => [
            m.message_id as string,
            (m as { folder_id?: string | null }).folder_id ?? null,
          ]),
        );
        for (const message of mapped) {
          message.bookmarked = marked.has(message.id);
          message.bookmark_folder_id = marked.get(message.id) ?? null;
        }
        const shareIds = mapped
          .filter(
            (m) =>
              m.message_kind === "exam_card" || m.message_kind === "wrong_share",
          )
          .map((m) => m.id);
        if (shareIds.length) {
          const { data: reps } = await supabase
            .from("dm_message_reposts")
            .select("source_message_id")
            .in("source_message_id", shareIds);
          const counts: Record<string, number> = {};
          for (const row of reps ?? []) {
            const id = row.source_message_id as string;
            counts[id] = (counts[id] ?? 0) + 1;
          }
          for (const message of mapped) {
            if (counts[message.id]) message.repostCount = counts[message.id];
          }
        }
      }
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
      setActiveConversation((current) => {
        if (current?.id === conversationId && current.pinned_message_id) {
          const pinned = mapped.find((m) => m.id === current.pinned_message_id) ?? null;
          setPinnedBanner(pinned);
        }
        return current;
      });
      void loadPinnedList(conversationId);
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
    [loadPinnedList, scrollToBottom, user.id],
  );

  const openThread = useCallback(
    async (conversation: DmConversationPreview) => {
      setActiveConversation(conversation);
      setView("thread");
      setPinnedBanner(null);
      setPinnedListOpen(false);
      await loadMessages(conversation.id);
      void loadPinnedList(conversation.id);
      try {
        const raw = sessionStorage.getItem("bomgichul.pendingMockResult");
        if (raw) {
          sessionStorage.removeItem("bomgichul.pendingMockResult");
          const result = JSON.parse(raw) as {
            subject: string;
            subjectLabel?: string;
            year: string | number;
            total: number;
            correct: number;
            elapsedSec?: number;
            href?: string;
          };
          const { error: insertError } = await createClient()
            .from("dm_messages")
            .insert({
              conversation_id: conversation.id,
              sender_id: user.id,
              content: `모의고사 결과 ${result.correct}/${result.total}`,
              message_kind: "mock_result",
              payload: {
                subject: result.subject,
                subjectLabel: result.subjectLabel,
                year: result.year,
                total: result.total,
                correct: result.correct,
                elapsedSec: result.elapsedSec,
                href: result.href,
              },
              published_at: new Date().toISOString(),
              mention_user_ids: [],
            });
          if (insertError) notify(insertError.message, "error");
          else {
            notify("모의고사 결과를 공유했어요.", "success");
            await loadMessages(conversation.id);
          }
        }
      } catch {
        /* ignore */
      }
    },
    [loadMessages, loadPinnedList, user.id],
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

  const toggleArchive = async (conversation: DmConversationPreview) => {
    const next = !conversation.archivedAt;
    const { error: archiveError } = await createClient().rpc("set_dm_conversation_archived", {
      p_conversation_id: conversation.id,
      p_archived: next,
    });
    if (archiveError) setError(archiveError.message);
    else {
      const archivedAt = next ? new Date().toISOString() : null;
      setConversations((items) =>
        items.map((item) =>
          item.id === conversation.id ? { ...item, archivedAt } : item,
        ),
      );
      setActiveConversation((current) =>
        current?.id === conversation.id ? { ...current, archivedAt } : current,
      );
    }
  };

  const toggleMute = async (conversation: DmConversationPreview) => {
    const muted = Boolean(conversation.mutedUntil && new Date(conversation.mutedUntil).getTime() > Date.now());
    const { error: muteError } = await createClient().rpc("set_dm_conversation_muted", {
      p_conversation_id: conversation.id,
      p_muted: !muted,
    });
    if (muteError) setError(muteError.message);
    else {
      const mutedUntil = !muted
        ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 100).toISOString()
        : null;
      setConversations((items) =>
        items.map((item) =>
          item.id === conversation.id ? { ...item, mutedUntil } : item,
        ),
      );
      setActiveConversation((current) =>
        current?.id === conversation.id ? { ...current, mutedUntil } : current,
      );
    }
  };

  const toggleBookmark = async (message: DmMessage) => {
    const supabase = createClient();
    if (message.bookmarked) {
      await supabase
        .from("dm_message_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("message_id", message.id);
      setMessages((items) =>
        items.map((item) =>
          item.id === message.id
            ? { ...item, bookmarked: false, bookmark_folder_id: null }
            : item,
        ),
      );
      setBookmarkRows((rows) => rows.filter((r) => r.id !== message.id));
    } else {
      void loadBookmarkFolders().then(() =>
        setSheet({ type: "bookmark-folder", message, folderId: "" }),
      );
    }
  };

  const saveBookmarkToFolder = async (message: DmMessage, folderId: string) => {
    const supabase = createClient();
    const row: Record<string, unknown> = {
      user_id: user.id,
      message_id: message.id,
    };
    if (folderId) row.folder_id = folderId;
    const { error: markError } = await supabase
      .from("dm_message_bookmarks")
      .insert(row);
    if (markError) {
      notify(markError.message, "error");
      return;
    }
    setMessages((items) =>
      items.map((item) =>
        item.id === message.id
          ? {
              ...item,
              bookmarked: true,
              bookmark_folder_id: folderId || null,
            }
          : item,
      ),
    );
    notify(folderId ? "폴더에 저장했어요." : "북마크했어요.", "success");
  };

  const loadBookmarkFolders = async () => {
    const { data, error: folderError } = await createClient()
      .from("dm_bookmark_folders")
      .select("id,user_id,name,sort,created_at")
      .eq("user_id", user.id)
      .order("sort", { ascending: true })
      .order("created_at", { ascending: true });
    if (folderError) {
      setError(folderError.message);
      return;
    }
    setBookmarkFolders((data ?? []) as DmBookmarkFolder[]);
  };

  const createBookmarkFolder = async (name: string) => {
    const trimmed = name.trim().slice(0, 40);
    if (!trimmed) return;
    const { data, error: createError } = await createClient()
      .from("dm_bookmark_folders")
      .insert({
        user_id: user.id,
        name: trimmed,
        sort: bookmarkFolders.length,
      })
      .select("id,user_id,name,sort,created_at")
      .single();
    if (createError) {
      notify(createError.message, "error");
      return;
    }
    if (data) setBookmarkFolders((items) => [...items, data as DmBookmarkFolder]);
    notify("폴더를 만들었어요.", "success");
  };

  const reportMessage = async (message: DmMessage) => {
    setSheet({ type: "report", message, reason: "spam", details: "" });
  };

  const submitReport = async () => {
    if (!sheet || sheet.type !== "report") return;
    const allowed = ["spam", "abuse", "sexual", "illegal", "privacy", "other"];
    if (!allowed.includes(sheet.reason)) {
      notify("신고 사유가 올바르지 않습니다.", "error");
      return;
    }
    const { error: reportError } = await createClient().from("chat_reports").insert({
      reporter_id: user.id,
      reported_user_id: sheet.message.sender_id,
      conversation_id: sheet.message.conversation_id,
      message_id: sheet.message.id,
      reason: sheet.reason,
      details: sheet.details,
    });
    setSheet(null);
    if (reportError) notify(reportError.message, "error");
    else notify("신고가 접수됐어요.", "success");
  };

  const loadBookmarks = async () => {
    const supabase = createClient();
    await loadBookmarkFolders();
    let query = supabase
      .from("dm_message_bookmarks")
      .select("message_id,created_at,folder_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(80);
    if (bookmarkFolderFilter === "inbox") {
      query = query.is("folder_id", null);
    } else if (bookmarkFolderFilter !== "all") {
      query = query.eq("folder_id", bookmarkFolderFilter);
    }
    const { data: marks, error: markError } = await query;
    if (markError) {
      setError(markError.message);
      return;
    }
    const ids = (marks ?? []).map((m) => m.message_id);
    const folderByMsg = Object.fromEntries(
      (marks ?? []).map((m) => [
        m.message_id,
        (m as { folder_id?: string | null }).folder_id ?? null,
      ]),
    );
    if (!ids.length) {
      setBookmarkRows([]);
      return;
    }
    const { data, error: msgError } = await supabase
      .from("dm_messages")
      .select(
        "id,conversation_id,sender_id,content,created_at,message_kind,payload,profiles:sender_id(nickname,avatar_url)",
      )
      .in("id", ids);
    if (msgError) {
      setError(msgError.message);
      return;
    }
    const byId = Object.fromEntries((data ?? []).map((row) => [row.id, row]));
    setBookmarkRows(
      ids
        .map((id) => byId[id])
        .filter(Boolean)
        .map((row) => {
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
            attachments: [],
            reactions: [],
            reply_to_id: null,
            edited_at: null,
            deleted_at: null,
            message_kind: row.message_kind ?? "text",
            payload: row.payload ?? {},
            bookmarked: true,
            bookmark_folder_id: folderByMsg[row.id] ?? null,
          } as DmMessage;
        }),
    );
  };

  const openTopicRoom = async (topicKey: string) => {
    try {
      const id = await joinTopic(topicKey);
      await refreshConversations();
      const fromList = conversations.find((c) => c.id === id);
      const roomMeta = topicRooms.find((r) => r.topic_key === topicKey);
      const preview: DmConversationPreview = fromList ?? {
        id,
        title: roomMeta?.topic_label
          ? `${roomMeta.topic_label} 스터디방`
          : roomMeta?.title ?? `${topicKey} 스터디방`,
        isGroup: true,
        avatar_url: null,
        members: [
          {
            id: user.id,
            nickname: user.nickname,
            avatar_url: user.avatar_url,
            role: "member",
          },
        ],
        otherUser: null,
        kind: "topic",
        topicKey,
        topicLabel: roomMeta?.topic_label ?? null,
        posting_mode:
          (roomMeta?.posting_mode as DmConversationPreview["posting_mode"]) ??
          null,
        lastMessage: null,
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      };
      await openThread(preview);
      notify(
        roomMeta?.joined || fromList ? "스터디방을 열었어요." : "스터디방에 입장했어요.",
        "success",
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "스터디방 입장 실패";
      setError(message);
      notify(message, "error");
    }
  };

  const startVoice = async () => {
    if (!activeConversation || recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `voice-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        void queueFiles([file]).then(() => {
          setShareMode("none");
        });
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("마이크 권한을 확인해 주세요.");
    }
  };

  const stopVoice = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setRecording(false);
  };

  const votePoll = async (message: DmMessage, key: string) => {
    const { data, error: voteError } = await createClient().rpc("vote_chat_poll", {
      p_message_id: message.id,
      p_option_key: key,
    });
    if (voteError) {
      setError(voteError.message);
      return;
    }
    if (data) {
      setMessages((items) =>
        items.map((item) =>
          item.id === message.id
            ? { ...item, payload: data as Record<string, unknown> }
            : item,
        ),
      );
    }
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


  const pinMessage = async (message: DmMessage | null) => {
    if (!activeConversation) return;
    const supabase = createClient();
    if (!message) {
      const primaryId =
        activeConversation.pinned_message_id ?? pinnedList[0]?.message_id ?? null;
      if (!primaryId) return;
      const { error: pinError } = await supabase.rpc("remove_dm_pinned_message", {
        p_conversation_id: activeConversation.id,
        p_message_id: primaryId,
      });
      if (pinError) setError(pinError.message);
      else {
        await loadPinnedList(activeConversation.id);
        setActiveConversation((c) =>
          c
            ? {
                ...c,
                pinned_message_id:
                  pinnedList.find((p) => p.message_id !== primaryId)?.message_id ??
                  null,
              }
            : c,
        );
        setPinnedBanner(null);
        await refreshConversations();
      }
      return;
    }
    const alreadyPinned = pinnedList.some((p) => p.message_id === message.id);
    const { error: pinError } = alreadyPinned
      ? await supabase.rpc("remove_dm_pinned_message", {
          p_conversation_id: activeConversation.id,
          p_message_id: message.id,
        })
      : await supabase.rpc("add_dm_pinned_message", {
          p_conversation_id: activeConversation.id,
          p_message_id: message.id,
        });
    if (pinError) setError(pinError.message);
    else {
      await loadPinnedList(activeConversation.id);
      setActiveConversation((c) =>
        c
          ? {
              ...c,
              pinned_message_id: alreadyPinned
                ? c.pinned_message_id === message.id
                  ? null
                  : c.pinned_message_id
                : c.pinned_message_id ?? message.id,
            }
          : c,
      );
      if (!alreadyPinned) setPinnedBanner(message);
      else if (activeConversation.pinned_message_id === message.id) {
        setPinnedBanner(null);
      }
      await refreshConversations();
    }
  };

  const doCheckin = async () => {
    if (!activeConversation) return;
    setSheet({ type: "checkin", note: "" });
  };

  const submitCheckin = async () => {
    if (!activeConversation || !sheet || sheet.type !== "checkin") return;
    const { data, error: checkError } = await createClient().rpc("chat_checkin", {
      p_conversation_id: activeConversation.id,
      p_note: sheet.note,
    });
    setSheet(null);
    if (checkError) notify(checkError.message, "error");
    else {
      const streak = (data as { streak?: number } | null)?.streak;
      if (streak) notify(`${streak}일 연속 인증!`, "success");
      await bumpDailyDone();
      await loadMessages(activeConversation.id);
    }
  };

  const buildSharePayload = () => {
    if (shareMode === "exam") {
      const [metaSubject, year, questionNo] = shareMeta.split("|").map((s) => s.trim());
      const idParts = (shareExamId || "").split("-");
      const subjectSlug =
        idParts.length >= 3 ? idParts.slice(0, -2).join("-") : metaSubject;
      return {
        kind: "exam_card" as const,
        content: draft.trim() || "기출 카드를 공유했어요.",
        payload: {
          examId: shareExamId || "manual",
          subject: subjectSlug || undefined,
          subjectLabel: /[가-힣]/.test(metaSubject || "") ? metaSubject : undefined,
          year: year || idParts.at(-2) || undefined,
          questionNo: questionNo || idParts.at(-1) || undefined,
          stem: shareStem.trim() || draft.trim(),
          label: "같이 풀어봐요",
          href:
            subjectSlug && (year || idParts.at(-2)) && (questionNo || idParts.at(-1))
              ? `/exam/${subjectSlug}/${year || idParts.at(-2)}/${questionNo || idParts.at(-1)}`
              : undefined,
        } satisfies ExamCardPayload,
      };
    }
    if (shareMode === "wrong") {
      const [metaSubject, year, questionNo] = shareMeta.split("|").map((s) => s.trim());
      const idParts = (shareExamId || "").split("-");
      const subjectSlug =
        idParts.length >= 3 ? idParts.slice(0, -2).join("-") : metaSubject;
      // wrong list bulk via shareStem JSON
      let items: WrongSharePayload["items"];
      try {
        const parsed = JSON.parse(shareStem);
        if (Array.isArray(parsed)) items = parsed;
      } catch { /* single */ }
      return {
        kind: "wrong_share" as const,
        content: draft.trim() || (items ? `오답 ${items.length}문항 공유` : "오답을 공유했어요."),
        payload: {
          examId: shareExamId || "manual",
          subject: subjectSlug || undefined,
          subjectLabel: /[가-힣]/.test(metaSubject || "") ? metaSubject : undefined,
          year: year || undefined,
          questionNo: questionNo || undefined,
          stem: items ? `${items.length}문항` : shareStem.trim() || draft.trim(),
          myPick: sharePick || undefined,
          correctLabel: undefined,
          items,
          href:
            !items && subjectSlug && year && questionNo
              ? `/exam/${subjectSlug}/${year}/${questionNo}`
              : undefined,
        } satisfies WrongSharePayload,
      };
    }
    if (shareMode === "timer") {
      const endsAt = new Date(Date.now() + timerMinutes * 60_000).toISOString();
      return {
        kind: "timer" as const,
        content: draft.trim() || `${timerMinutes}분 타이머`,
        payload: {
          minutes: timerMinutes,
          label: draft.trim() || undefined,
          endsAt,
        } satisfies TimerPayload,
      };
    }
    if (shareMode === "poll") {
      const q = pollQuestion.trim() || draft.trim() || "OX 폴";
      const dueAt = new Date(
        Date.now() + Math.max(1, pollDueHours) * 60 * 60 * 1000,
      ).toISOString();
      return {
        kind: "poll" as const,
        content: q,
        payload: {
          question: q,
          options: [
            { key: "O", label: "O" },
            { key: "X", label: "X" },
          ],
          dueAt,
          correctKey: pollCorrectKey,
          isQuiz: true,
          revealMode: "on_close",
        } satisfies PollPayload,
      };
    }
    if (shareMode === "mock") {
      const [subject, year] = shareMeta.split("|").map((s) => s.trim());
      const href =
        subject && year
          ? `/exam/${subject}/${year}/mock`
          : shareExamId || "/exam";
      return {
        kind: "mock_invite" as const,
        content: draft.trim() || "모의고사 같이 풀어요",
        payload: {
          subject: subject || "civillaw",
          year: year || new Date().getFullYear(),
          href,
          label: draft.trim() || undefined,
        } satisfies MockInvitePayload,
      };
    }
    if (shareMode === "note") {
      const title = noteTitle.trim() || "학습 노트";
      const body = shareStem.trim() || draft.trim();
      return {
        kind: "note_card" as const,
        content: title,
        payload: {
          title,
          body,
          subject: shareMeta || undefined,
          collapsedByDefault: true,
        } satisfies NoteCardPayload,
      };
    }
    if (shareMode === "live") {
      const title = liveTitle.trim() || draft.trim() || "라이브 스터디";
      const endsAt = new Date(Date.now() + timerMinutes * 60_000).toISOString();
      return {
        kind: "live_session" as const,
        content: title,
        payload: {
          title,
          subject: shareMeta || undefined,
          endsAt,
          hostId: user.id,
          hostNickname: user.nickname,
          status: "live",
          minutes: timerMinutes,
        } satisfies LiveSessionPayload,
      };
    }
    return {
      kind: "text" as const,
      content: draft.trim(),
      payload: {} as Record<string, unknown>,
    };
  };

  const sendMessage = async () => {
    const sharing = shareMode !== "none";
    if (
      (!draft.trim() && selectedFiles.length === 0 && !sharing) ||
      !activeConversation ||
      sending ||
      preparingFiles
    )
      return;
    if (activeConversation.posting_mode === "admin_only" && !user.isAdmin) {
      notify("채널은 운영자만 글을 올릴 수 있어요", "error");
      return;
    }
    if (sharing && shareMode === "exam" && !shareStem.trim() && !draft.trim()) {
      setError("기출 지문을 입력해 주세요.");
      return;
    }
    if (sharing && shareMode === "note" && !(shareStem.trim() || draft.trim())) {
      setError("노트 본문을 입력해 주세요.");
      return;
    }
    if (sharing && shareMode === "live" && !(liveTitle.trim() || draft.trim())) {
      setError("라이브 제목을 입력해 주세요.");
      return;
    }
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

    const share = buildSharePayload();
    const mentionIds = extractMentionUserIds(
      share.content,
      activeConversation.members.map((m) => ({ id: m.id, nickname: m.nickname })),
    );

    const insertRow: Record<string, unknown> = {
      conversation_id: activeConversation.id,
      sender_id: user.id,
      content: share.content,
      reply_to_id: replyTo?.id ?? null,
      thread_root_id:
        threadRoot?.id ??
        replyTo?.thread_root_id ??
        replyTo?.id ??
        null,
      message_kind: share.kind,
      payload: share.payload,
      mention_user_ids: mentionIds,
      published_at: new Date().toISOString(),
    };

    const { data: message, error: insertError } = await supabase
      .from("dm_messages")
      .insert(insertRow)
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

    if (share.kind === "poll") {
      const { data: eventRow } = await supabase
        .from("chat_study_events")
        .insert({
          conversation_id: activeConversation.id,
          creator_id: user.id,
          kind: "poll",
          title: (share.payload as PollPayload).question,
          body: "",
          options: (share.payload as PollPayload).options,
          due_at: (share.payload as PollPayload).dueAt ?? null,
        })
        .select("id")
        .single();
      if (eventRow?.id) {
        const { error: attachError } = await supabase.rpc(
          "attach_poll_event_to_message",
          { p_message_id: message.id, p_event_id: eventRow.id },
        );
        if (attachError) setError(attachError.message);
      }
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
    setShareMode("none");
    setShareExamId("");
    setShareStem("");
    setShareMeta("");
    setSharePick("");
    setPollQuestion("");
    setNoteTitle("");
    setLiveTitle("");
    setThreadRoot(null);
    clearChatShareDraft();
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

  const recordMessageView = async (message: DmMessage) => {
    if (
      message.message_kind !== "exam_card" &&
      message.message_kind !== "wrong_share"
    )
      return;
    if (message.views?.some((v) => v.user_id === user.id)) return;
    const { data: count, error: viewError } = await createClient().rpc(
      "record_dm_message_view",
      { p_message_id: message.id },
    );
    if (viewError) return;
    setMessages((items) =>
      items.map((item) => {
        if (item.id !== message.id) return item;
        const already = item.views?.some((v) => v.user_id === user.id);
        if (already) return item;
        const nextViews = [
          ...(item.views ?? []),
          { message_id: item.id, user_id: user.id },
        ];
        // keep length in sync with rpc count when available
        if (typeof count === "number" && nextViews.length < count) {
          return { ...item, views: nextViews };
        }
        return { ...item, views: nextViews };
      }),
    );
  };

  const editMessage = async (message: DmMessage) => {
    setSheet({ type: "edit", message, value: message.content });
  };

  const submitEdit = async () => {
    if (!sheet || sheet.type !== "edit" || !sheet.value.trim()) return;
    const { error: editError } = await createClient().rpc("update_dm_message", {
      p_message_id: sheet.message.id,
      p_content: sheet.value,
    });
    setSheet(null);
    if (editError) notify(editError.message, "error");
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
    const supabase = createClient();
    const title = studyTitle.trim();
    const row: Record<string, unknown> = {
      conversation_id: activeConversation.id,
      creator_id: user.id,
      kind: studyKind === "weekly" ? "weekly" : studyKind,
      title,
      body: "",
      pinned: studyKind === "notice",
    };
    if (studyKind === "weekly") {
      const kstParts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Seoul",
        weekday: "short",
      }).formatToParts(new Date());
      const wd = kstParts.find((p) => p.type === "weekday")?.value ?? "Sun";
      const map: Record<string, number> = {
        Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
      };
      row.recurrence = "weekly";
      row.weekday = map[wd] ?? 0;
      row.time_of_day = "20:00";
      row.due_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }
    if (studyKind === "schedule") {
      const due = studyDueAt
        ? new Date(studyDueAt).toISOString()
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      row.due_at = due;
      row.body = studyPlace;
    }
    if (studyKind === "poll") {
      row.options = [
        { key: "O", label: "O" },
        { key: "X", label: "X" },
      ];
    }
    const { data: eventRow, error: studyError } = await supabase
      .from("chat_study_events")
      .insert(row)
      .select("id,due_at")
      .maybeSingle();
    if (studyError) {
      setError(studyError.message);
      return;
    }

    if (studyKind === "notice") {
      const { data: noticeMsg, error: noticeError } = await supabase
        .from("dm_messages")
        .insert({
          conversation_id: activeConversation.id,
          sender_id: user.id,
          content: `📌 공지: ${title}`,
          message_kind: "system",
          payload: { kind: "notice", title },
          published_at: new Date().toISOString(),
          mention_user_ids: [],
        })
        .select("id,content,created_at,sender_id,conversation_id,message_kind,payload")
        .single();
      if (!noticeError && noticeMsg) {
        await pinMessage({
          id: noticeMsg.id,
          conversation_id: activeConversation.id,
          sender_id: user.id,
          content: noticeMsg.content,
          created_at: noticeMsg.created_at,
          author: { nickname: user.nickname, avatar_url: user.avatar_url },
          attachments: [],
          reactions: [],
          reply_to_id: null,
          edited_at: null,
          deleted_at: null,
          message_kind: "system",
          payload: { kind: "notice", title },
        });
      }
    }

    if (studyKind === "schedule") {
      const dueAt =
        (eventRow?.due_at as string | undefined) ||
        (studyDueAt
          ? new Date(studyDueAt).toISOString()
          : new Date(Date.now() + 86400000).toISOString());
      await supabase.from("dm_messages").insert({
        conversation_id: activeConversation.id,
        sender_id: user.id,
        content: `📅 일정: ${title}`,
        message_kind: "schedule_share",
        payload: {
          title,
          dueAt,
          place: studyPlace || undefined,
          eventId: eventRow?.id,
        } satisfies ScheduleSharePayload,
        published_at: new Date().toISOString(),
        mention_user_ids: [],
      });
      setStudyDueAt("");
      setStudyPlace("");
    }

    setStudyTitle("");
    await loadMessages(activeConversation.id);
    notify(
      studyKind === "weekly"
        ? "주간 스터디 리마인더를 만들었어요."
        : studyKind === "notice"
          ? "공지를 고정했어요."
          : studyKind === "schedule"
            ? "일정을 공유했어요."
            : "스터디 도구를 만들었습니다.",
      "success",
    );
  };

  const forwardMessage = async (message: DmMessage, conversationId: string) => {
    if (message.deleted_at) {
      notify("삭제된 메시지는 전달할 수 없어요.", "error");
      return;
    }
    const supabase = createClient();
    const { data: inserted, error: forwardError } = await supabase
      .from("dm_messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: message.content || "전달된 메시지",
        message_kind: message.message_kind ?? "text",
        payload: {
          ...(message.payload ?? {}),
          forwarded: true,
          forwardedFromId: message.id,
        },
        published_at: new Date().toISOString(),
        mention_user_ids: [],
      })
      .select("id")
      .single();
    setSheet(null);
    if (forwardError || !inserted) {
      notify(forwardError?.message ?? "전달에 실패했어요.", "error");
      return;
    }
    if (
      message.message_kind === "exam_card" ||
      message.message_kind === "wrong_share"
    ) {
      const { data: count } = await supabase.rpc("record_dm_message_repost", {
        p_source_message_id: message.id,
        p_repost_message_id: inserted.id,
      });
      if (typeof count === "number") {
        setMessages((items) =>
          items.map((item) =>
            item.id === message.id ? { ...item, repostCount: count } : item,
          ),
        );
      }
    }
    notify("전달했어요.", "success");
  };

  const quoteExamMessage = async (message: DmMessage, comment: string) => {
    if (!activeConversation) return;
    if (message.message_kind !== "exam_card" || !message.payload) {
      notify("기출 카드만 인용할 수 있어요.", "error");
      return;
    }
    const source = message.payload as unknown as ExamCardPayload;
    const quotedExam: ExamCardPayload = {
      examId: source.examId,
      subject: source.subject,
      subjectLabel: source.subjectLabel,
      year: source.year,
      questionNo: source.questionNo,
      stem: source.stem,
      label: source.label,
      href: source.href,
    };
    const trimmed = comment.trim();
    const supabase = createClient();
    const { data: inserted, error: quoteError } = await supabase
      .from("dm_messages")
      .insert({
        conversation_id: activeConversation.id,
        sender_id: user.id,
        content: trimmed || "기출을 인용했어요.",
        message_kind: "exam_card",
        payload: {
          ...quotedExam,
          quoted: true,
          quoteOfId: message.id,
          quoteComment: trimmed || undefined,
          quotedExam,
        } satisfies ExamCardPayload,
        published_at: new Date().toISOString(),
        mention_user_ids: [],
      })
      .select("id")
      .single();
    setSheet(null);
    if (quoteError || !inserted) {
      notify(quoteError?.message ?? "인용에 실패했어요.", "error");
      return;
    }
    const { data: count } = await supabase.rpc("record_dm_message_repost", {
      p_source_message_id: message.id,
      p_repost_message_id: inserted.id,
    });
    if (typeof count === "number") {
      setMessages((items) =>
        items.map((item) =>
          item.id === message.id ? { ...item, repostCount: count } : item,
        ),
      );
    }
    notify("인용했어요.", "success");
    await loadMessages(activeConversation.id);
  };

  const exportConversation = async (filter: "all" | "exam" = "all") => {
    if (!activeConversation) return;
    const res = await fetch(
      `/api/chat/export?conversationId=${encodeURIComponent(activeConversation.id)}&filter=${filter}`,
    );
    if (!res.ok) {
      notify("내보내기에 실패했어요.", "error");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${activeConversation.title || "export"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    notify("대화를 내보냈어요.", "success");
  };

  const saveStudyMeta = async (dday: string, goal: string) => {
    if (!activeConversation) return;
    await manageGroup("set_dday", undefined, dday);
    await manageGroup("set_goal", undefined, goal);
    setActiveConversation((c) =>
      c ? { ...c, study_dday: dday || null, study_goal: goal || null } : c,
    );
    notify("스터디 목표·D-day를 저장했어요.", "success");
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


  const loadMemberDirectory = async () => {
    const { data, error: dirError } = await createClient()
      .from("profiles")
      .select("id,nickname,avatar_url")
      .eq("username_set", true)
      .neq("id", user.id)
      .order("nickname", { ascending: true })
      .limit(200);
    if (dirError) {
      notify(`회원 목록 실패: ${dirError.message}`, "error");
      return;
    }
    setMemberDirectory((data ?? []) as ProfileRow[]);
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
      /* scheduled publish: /api/cron/chat (service_role) */
    }
  }, [open, refreshConversations, refreshFriends]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [open]);
  useEffect(() => {
    if (view === "friends") void loadMemberDirectory();
  }, [view]);
  useEffect(() => {
    if (view === "bookmarks") void loadBookmarks();
  }, [view, bookmarkFolderFilter]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (view === "friends" && searchQuery.trim().length >= 2) void searchProfiles();
      else if (view === "friends" && !searchQuery.trim()) setSearchResults([]);
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
    const onMessageChange = (payload: {
      new: Record<string, unknown>;
      eventType?: string;
    }) => {
      const row = payload.new as {
        sender_id: string;
        content: string;
        mention_user_ids?: string[];
        scheduled_for?: string | null;
        published_at?: string | null;
      };
      const unpublished = Boolean(row.scheduled_for && !row.published_at);
      if (unpublished && row.sender_id !== user.id) return;
      const muted =
        activeConversation.mutedUntil &&
        new Date(activeConversation.mutedUntil).getTime() > Date.now();
      const keywords = prefs?.keyword_alerts ?? [];
      const keywordHit = messageMatchesKeywords(row.content || "", keywords);
      const mentionHit = (row.mention_user_ids ?? []).includes(user.id);
      const allowNotify =
        !unpublished &&
        !muted &&
        row.sender_id !== user.id &&
        document.hidden &&
        Notification.permission === "granted";
      if (allowNotify) {
        const prefix = mentionHit
          ? "@멘션 · "
          : keywordHit
            ? "키워드 · "
            : "";
        new Notification(activeConversation.title, {
          body: `${prefix}${row.content || "새 첨부파일이 도착했어요."}`,
        });
      }
      void loadMessages(activeConversation.id);
      void refreshConversations();
    };
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
        onMessageChange,
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "dm_messages",
          filter: `conversation_id=eq.${activeConversation.id}`,
        },
        onMessageChange,
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [
    activeConversation,
    loadMessages,
    open,
    prefs?.keyword_alerts,
    refreshConversations,
    user.id,
    view,
  ]);

  const panelTitle =
    view === "thread"
      ? (activeConversation?.title ?? "채팅")
      : view === "friends"
        ? "친구"
        : view === "new-group"
          ? "새 그룹채팅"
          : view === "topics"
            ? "스터디방"
            : view === "communities"
              ? "커뮤니티"
              : view === "bookmarks"
                ? "북마크"
                : view === "settings"
                  ? "채팅 설정"
                  : view === "vault"
                    ? "서랍"
                    : view === "gallery"
                      ? "미디어"
                      : view === "calendar"
                        ? "스터디 일정"
                        : view === "global-search"
                          ? "전체 검색"
                          : view === "thread-detail"
                            ? "스레드"
                            : "메시지";

  return (
    <>
      <BrandChatFab
        onClick={() => setOpen((value) => !value)}
        badge={
          unreadTotal > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ef4444] px-1 font-display text-[10px] font-bold text-paper">
              {unreadTotal > 9 ? "9+" : unreadTotal}
            </span>
          ) : null
        }
      />
      {open ? (
        <div
          className="chat-panel chat-panel-enter fixed inset-0 z-[60] flex flex-col overflow-hidden shadow-2xl sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(82vh,760px)] sm:w-[min(94vw,720px)] sm:rounded-[30px] sm:border sm:border-white/80"
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
            <div className="pointer-events-none absolute inset-3 z-[80] flex items-center justify-center rounded-[24px] border-2 border-dashed border-[#007AFF]/50 bg-white/85 p-6 text-center shadow-2xl backdrop-blur-md">
              <div>
                <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#007AFF]/10 text-2xl text-[#0066D6]">
                  ⇩
                </span>
                <p className="font-display text-base font-semibold text-ink">
                  여기에 놓아 첨부하기
                </p>
                <p className="mt-1 chat-meta">
                  사진·동영상·문서, 한 번에 최대 6개
                </p>
              </div>
            </div>
          ) : null}
          <div className="chat-glass-bar flex items-center gap-2 px-4 py-3">
            {view !== "list" && view !== "friends" ? (
              <ChatBackButton onClick={goBack} />
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
                <ChatHeaderAction onClick={() => void doCheckin()} primary>
                  인증
                </ChatHeaderAction>
                <OverflowMenu
                  items={[
                    { key: "search", label: "대화 검색", onClick: () => setView("search") },
                    { key: "vault", label: "서랍 보관함", onClick: () => setView("vault") },
                    { key: "gallery", label: "미디어", onClick: () => setView("gallery") },
                    { key: "calendar", label: "일정", onClick: () => setView("calendar") },
                    { key: "study", label: "스터디 도구", onClick: () => setView("study") },
                    {
                      key: "export",
                      label: "대화 내보내기",
                      onClick: () => void exportConversation("all"),
                    },
                    {
                      key: "export-exam",
                      label: "기출만 내보내기",
                      onClick: () => void exportConversation("exam"),
                    },
                    ...(activeConversation
                      ? [
                          {
                            key: "mute",
                            label: activeConversation.mutedUntil ? "알림 켜기" : "뮤트",
                            onClick: () => void toggleMute(activeConversation),
                          },
                        ]
                      : []),
                    { key: "manage", label: "방 관리", onClick: () => setView("manage") },
                  ]}
                />
              </>
            ) : null}
            {view === "list" ? (
              <div className="flex flex-wrap items-center justify-end gap-0.5">
                <ChatHeaderAction onClick={() => setView("communities")} primary>
                  커뮤니티
                </ChatHeaderAction>
                <ChatHeaderAction onClick={() => setView("topics")} primary>
                  스터디방
                </ChatHeaderAction>
                <ChatHeaderAction onClick={() => setView("friends")} primary>
                  친구
                </ChatHeaderAction>
                <OverflowMenu
                  items={[
                    { key: "search", label: "전체 검색", onClick: () => setView("global-search") },
                    { key: "calendar", label: "스터디 일정", onClick: () => setView("calendar") },
                    {
                      key: "bookmarks",
                      label: "북마크",
                      onClick: () => {
                        setView("bookmarks");
                        void loadBookmarks();
                      },
                    },
                    { key: "settings", label: "채팅 설정", onClick: () => setView("settings") },
                    { key: "profile", label: "내 프로필", onClick: () => setProfileId(user.id) },
                    { key: "self", label: "나와의 채팅", onClick: () => void openSelfChat() },
                    { key: "group", label: "새 그룹", onClick: () => setView("new-group") },
                  ]}
                />
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
          {view === "list" || view === "friends" ? (
            <div className="grid grid-cols-2 border-b border-mist">
              {(
                [
                  [
                    "friends",
                    `친구${incomingRequests.length ? ` ${incomingRequests.length}` : ""}`,
                  ],
                  ["list", "대화"],
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
            <ChatToast
              message={error}
              tone={toastTone}
              onClose={() => {
                setError(null);
                setToastTone("info");
              }}
            />
          ) : null}

          {view === "list" ? (
            <div className="flex flex-1 flex-col overflow-hidden">
              <ChatPrefsBar
                doneToday={doneToday}
                goalCount={goalCount}
                keywords={prefs?.keyword_alerts ?? []}
                onOpenKeywords={() =>
                  setSheet({
                    type: "keywords",
                    value: (prefs?.keyword_alerts ?? []).join(", "),
                  })
                }
                onBumpDone={() => void bumpDailyDone()}
              />
              <div className="flex flex-wrap gap-1.5 border-b border-mist/70 px-3 py-2">
                {(
                  [
                    ["all", "전체"],
                    ["unread", "안 읽음"],
                    ["mention", "멘션"],
                    ["archived", "보관"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setListFilter(key)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      listFilter === key
                        ? "bg-[#007AFF] text-white"
                        : "bg-white text-fog"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto">
                {visibleConversations.length ? (
                  visibleConversations.map((conversation) => (
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
                            {conversation.kind === "topic" ? (
                              <span className="ml-1 text-[10px] font-normal text-[#0066D6]">스터디</span>
                            ) : null}
                            {conversation.pinnedAt ? <span className="ml-1 text-[10px]" title="상단 고정">📌</span> : null}
                            {conversation.mutedUntil ? <span className="ml-1 text-[10px]" title="뮤트">🔕</span> : null}
                            {conversation.archivedAt ? <span className="ml-1 text-[10px]" title="보관">📦</span> : null}
                            {conversation.mentionUnread ? (
                              <span className="ml-1 text-[10px] text-[#0066D6]">@</span>
                            ) : null}
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
                        <span className="rounded-full bg-[#007AFF] px-1.5 py-0.5 text-[10px] font-bold text-white">
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
                ) : listFilter === "archived" ? (
                  <p className="px-4 py-12 text-center text-body-sm text-fog">
                    보관한 대화가 없어요.
                  </p>
                ) : (
                  <ChatEmptyState
                    title="아직 대화가 없어요"
                    body="스터디방에 들어가거나 친구와 대화를 시작해 보세요."
                    actionLabel="스터디방 보기"
                    onAction={() => setView("topics")}
                  />
                )}
              </div>
            </div>
          ) : null}

          {view === "friends" ? (
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 z-10 border-b border-mist bg-paper p-3">
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
                    className="rounded-xl bg-[#007AFF] px-3 text-[12px] font-semibold text-white"
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
                  <div className="relative">
                    <Avatar
                      nickname={profile.nickname}
                      url={profile.avatar_url}
                      onOpen={() => setProfileId(profile.id)}
                    />
                    {onlineById.has(profile.id) ? (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-[#007AFF]" />
                    ) : null}
                  </div>
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
              {!searchQuery.trim() ? (
                <>
                  <p className="px-4 pb-1 pt-3 text-[11px] font-semibold text-fog">
                    접속 중 {onlineUsers.length}
                  </p>
                  {onlineUsers.length ? (
                    onlineUsers.map((online) => (
                      <button
                        key={online.user_id}
                        type="button"
                        onClick={() =>
                          void startDirectChat({
                            id: online.user_id,
                            nickname: online.nickname,
                            avatar_url: online.avatar_url ?? null,
                          })
                        }
                        className="flex w-full items-center gap-3 border-b border-mist px-4 py-3 text-left hover:bg-[#007AFF]/5"
                      >
                        <div className="relative">
                          <Avatar
                            nickname={online.nickname}
                            url={online.avatar_url}
                            onOpen={() => setProfileId(online.user_id)}
                          />
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-[#007AFF]" />
                        </div>
                        <p className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                          {online.nickname}
                        </p>
                        <span className="text-[11px] font-semibold text-[#007AFF]">메시지</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 pb-3 text-[12px] text-fog">
                      지금 접속 중인 사용자가 없어요.
                    </p>
                  )}
                  {acceptedFriends.length ? (
                    <p className="px-4 pb-1 pt-3 text-[11px] font-semibold text-fog">내 친구</p>
                  ) : null}
                  {acceptedFriends.map((friend) => {
                    const profile = friendProfile(friend);
                    const online = onlineById.has(profile.id);
                    return (
                      <div
                        key={friend.id}
                        className="flex items-center gap-3 border-b border-mist px-4 py-3"
                      >
                        <div className="relative">
                          <Avatar
                            nickname={profile.nickname}
                            url={profile.avatar_url}
                            onOpen={() => setProfileId(profile.id)}
                          />
                          {online ? (
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-[#007AFF]" />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold">
                            {profile.nickname}
                          </p>
                          {online ? (
                            <p className="text-[10px] font-semibold text-[#007AFF]">접속 중</p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => void startDirectChat(profile)}
                          className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#0066D6] hover:bg-[#007AFF]/10"
                        >
                          메시지
                        </button>
                      </div>
                    );
                  })}
                  <p className="px-4 pb-1 pt-3 text-[11px] font-semibold text-fog">전체 회원</p>
                  {memberDirectory.map((profile) => {
                    const isFriend = acceptedFriends.some(
                      (friend) => friendProfile(friend).id === profile.id,
                    );
                    const online = onlineById.has(profile.id);
                    return (
                      <div
                        key={profile.id}
                        className="flex items-center gap-3 border-b border-mist px-4 py-3"
                      >
                        <div className="relative">
                          <Avatar
                            nickname={profile.nickname}
                            url={profile.avatar_url}
                            onOpen={() => setProfileId(profile.id)}
                          />
                          {online ? (
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-[#007AFF]" />
                          ) : null}
                        </div>
                        <p className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                          {profile.nickname}
                        </p>
                        {isFriend ? (
                          <button
                            type="button"
                            onClick={() => void startDirectChat(profile)}
                            className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#0066D6] hover:bg-[#007AFF]/10"
                          >
                            메시지
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => void sendFriendRequest(profile)}
                            className="rounded-lg bg-[#007AFF] px-2.5 py-1.5 text-[11px] font-semibold text-white"
                          >
                            친구 추가
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {!memberDirectory.length ? (
                    <p className="px-4 py-10 text-center text-[13px] text-fog">
                      표시할 회원이 없어요.
                    </p>
                  ) : null}
                </>
              ) : null}
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
              <div className="rounded-3xl bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] p-5 text-white shadow-xl">
                <p className="text-xs text-white/75">STUDY ROOM</p>
                <h3 className="mt-1 text-xl font-bold">
                  {activeConversation?.title}
                </h3>
                <p className="mt-3 text-sm text-white/80">
                  공지·일정·목표·인증·투표를 채팅방에 고정하세요.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {[
                  ["notice", "📌", "공지"],
                  ["schedule", "📅", "일정"],
                  ["goal", "🎯", "목표"],
                  ["checkin", "✅", "인증"],
                  ["poll", "📊", "투표"],
                  ["weekly", "🔁", "주간"],
                  ["timer", "⏱", "타이머"],
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
              {studyKind === "schedule" ? (
                <div className="mt-2 space-y-2">
                  <input
                    type="datetime-local"
                    value={studyDueAt}
                    onChange={(e) => setStudyDueAt(e.target.value)}
                    className="w-full rounded-2xl border border-white bg-white/80 px-4 py-3 text-sm outline-none shadow-sm"
                  />
                  <input
                    value={studyPlace}
                    onChange={(e) => setStudyPlace(e.target.value)}
                    placeholder="장소 (선택)"
                    className="w-full rounded-2xl border border-white bg-white/80 px-4 py-3 text-sm outline-none shadow-sm"
                  />
                </div>
              ) : null}
              <button
                onClick={() => void createStudyTool()}
                disabled={!studyTitle.trim()}
                className="mt-3 w-full rounded-2xl bg-carbon py-3 text-sm font-bold text-white disabled:opacity-40"
              >
                채팅방에 만들기
              </button>
              <div className="mt-4 rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
                <p className="text-[12px] font-semibold text-smoke">시험 D-day · 목표</p>
                <input
                  type="date"
                  value={studyDdayDraft || (activeConversation?.study_dday ?? "")}
                  onChange={(e) => setStudyDdayDraft(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-mist px-3 py-2 text-[13px]"
                />
                <input
                  value={studyGoalDraft || (activeConversation?.study_goal ?? "")}
                  onChange={(e) => setStudyGoalDraft(e.target.value)}
                  placeholder="예: 민법 매일 40문항"
                  className="mt-2 w-full rounded-xl border border-mist px-3 py-2 text-[13px]"
                />
                <button
                  type="button"
                  onClick={() =>
                    void saveStudyMeta(
                      studyDdayDraft || activeConversation?.study_dday || "",
                      studyGoalDraft || activeConversation?.study_goal || "",
                    )
                  }
                  className="mt-3 w-full rounded-xl bg-[#007AFF] py-2.5 text-[13px] font-semibold text-white"
                >
                  D-day·목표 저장
                </button>
              </div>
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
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSheet({
                        type: "rename",
                        value: activeConversation?.title ?? "",
                      })
                    }
                    className="chat-hit chat-focus rounded-xl bg-surface px-3 py-2 text-xs"
                  >
                    이름 변경
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSheet({
                        type: "slow",
                        value: String(activeConversation?.slow_mode_seconds ?? 0),
                      })
                    }
                    className="chat-hit chat-focus rounded-xl bg-surface px-3 py-2 text-xs"
                  >
                    느린 채팅
                  </button>
                  {activeConversation ? (
                    <>
                      <button
                        type="button"
                        onClick={() => void toggleMute(activeConversation)}
                        className="rounded-xl bg-surface px-3 py-2 text-xs"
                      >
                        {activeConversation.mutedUntil ? "알림 켜기" : "뮤트"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void toggleArchive(activeConversation)}
                        className="rounded-xl bg-surface px-3 py-2 text-xs"
                      >
                        {activeConversation.archivedAt ? "보관 해제" : "보관"}
                      </button>
                    </>
                  ) : null}
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
                        className="text-[10px] text-rose-600"
                      >
                        내보내기
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {view === "topics" ? (
            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-3 text-[12px] text-smoke">
                과목별 공개 스터디방에 바로 입장하세요.
              </p>
              {topicsLoading ? (
                <p className="py-8 text-center text-[13px] text-fog">불러오는 중...</p>
              ) : (
                <div className="space-y-2">
                  {(topicRooms.length
                    ? topicRooms
                    : TOPIC_TEASERS.map((t) => ({
                        id: t.key,
                        title: `${t.label} 스터디방`,
                        topic_key: t.key,
                        topic_label: t.label,
                        gate_subject: null,
                        invite_code: null,
                        member_count: 0,
                        joined: false,
                        posting_mode: null as string | null,
                      }))
                  ).map((room) => (
                    <button
                      key={room.topic_key}
                      type="button"
                      onClick={() => void openTopicRoom(room.topic_key)}
                      className="chat-focus flex w-full items-center justify-between rounded-2xl border border-mist bg-white/85 px-4 py-3.5 text-left shadow-sm transition hover:border-[#007AFF]/35 hover:bg-[#007AFF]/5"
                    >
                      <span>
                        <b className="block font-display text-[13px] text-ink">
                          {room.topic_label || room.title}
                          {room.posting_mode === "admin_only" ? (
                            <span className="ml-1.5 rounded-full bg-[#007AFF]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#0066D6]">
                              채널
                            </span>
                          ) : null}
                        </b>
                        <small className="text-[11px] text-fog">
                          {room.member_count ? `${room.member_count}명` : "공개 스터디"}
                          {room.joined ? " · 참여 중" : ""}
                          {room.gate_subject ? " · 관련 과목 있음" : ""}
                        </small>
                      </span>
                      <span className="text-[12px] font-semibold text-[#0066D6]">
                        {room.joined ? "열기" : "입장"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {view === "communities" ? (
            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-3 text-[12px] text-smoke">
                시험 트랙별 스터디방·채널을 모아 봤어요.
              </p>
              {topicsLoading ? (
                <p className="py-8 text-center text-[13px] text-fog">불러오는 중...</p>
              ) : (
                <div className="space-y-3">
                  {COMMUNITY_HOME_GROUPS.map((group) => {
                    const rooms = topicRooms.filter((r) =>
                      (group.topicKeys as readonly string[]).includes(r.topic_key),
                    );
                    const open = communityScope === group.scope;
                    return (
                      <div
                        key={group.scope}
                        className="overflow-hidden rounded-2xl border border-mist bg-white/85 shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setCommunityScope(open ? null : group.scope)
                          }
                          className="flex w-full items-center justify-between px-4 py-3.5 text-left"
                        >
                          <span>
                            <b className="block font-display text-[13px] text-ink">
                              {group.label}
                            </b>
                            <small className="text-[11px] text-fog">{group.blurb}</small>
                          </span>
                          <span className="text-[12px] font-semibold text-[#0066D6]">
                            {open ? "접기" : `${rooms.length || group.topicKeys.length}곳`}
                          </span>
                        </button>
                        {open ? (
                          <div className="space-y-1 border-t border-mist px-2 py-2">
                            {(rooms.length
                              ? rooms
                              : group.topicKeys.map((key) => {
                                  const teaser = TOPIC_TEASERS.find((t) => t.key === key);
                                  return {
                                    topic_key: key,
                                    topic_label: teaser?.label ?? key,
                                    title: teaser?.label ?? key,
                                    member_count: 0,
                                    joined: false,
                                    posting_mode: key.startsWith("channel-")
                                      ? "admin_only"
                                      : null,
                                  };
                                })
                            ).map((room) => (
                              <button
                                key={room.topic_key}
                                type="button"
                                onClick={() => void openTopicRoom(room.topic_key)}
                                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left hover:bg-[#007AFF]/8"
                              >
                                <span className="text-[12px] font-semibold text-ink">
                                  {room.topic_label || room.title}
                                  {room.posting_mode === "admin_only" ? (
                                    <span className="ml-1 text-[10px] text-[#0066D6]">
                                      · 채널
                                    </span>
                                  ) : null}
                                </span>
                                <span className="text-[11px] text-[#0066D6]">
                                  {room.joined ? "열기" : "입장"}
                                </span>
                              </button>
                            ))}
                            <a
                              href={communityBaseHref(group.scope as CommunityScope)}
                              className="block px-3 py-2 text-[11px] font-semibold text-[#0066D6]"
                            >
                              게시판 커뮤니티 →
                            </a>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {view === "bookmarks" ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-3 flex flex-wrap gap-1.5">
                {(
                  [
                    ["all", "전체"],
                    ["inbox", "미분류"],
                    ...bookmarkFolders.map((f) => [f.id, f.name] as const),
                  ] as Array<[string, string]>
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setBookmarkFolderFilter(
                        id as typeof bookmarkFolderFilter,
                      );
                    }}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      bookmarkFolderFilter === id
                        ? "bg-[#007AFF] text-white"
                        : "bg-slate-100 text-smoke"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSheet({ type: "new-folder", name: "" })}
                  className="rounded-full border border-dashed border-[#007AFF]/40 px-2.5 py-1 text-[11px] font-semibold text-[#0066D6]"
                >
                  + 폴더
                </button>
              </div>
              {bookmarkRows.length ? (
                <div className="space-y-2">
                  {bookmarkRows.map((message) => (
                    <button
                      key={message.id}
                      type="button"
                      onClick={() => {
                        const conv = conversations.find((c) => c.id === message.conversation_id);
                        if (conv) void openThread(conv);
                      }}
                      className="block w-full rounded-2xl border border-white bg-white/80 p-3 text-left shadow-sm"
                    >
                      <b className="text-xs">{message.author.nickname}</b>
                      <p className="mt-1 line-clamp-3 text-xs text-smoke">
                        {message.content || message.message_kind}
                      </p>
                      <small className="text-[10px] text-fog">
                        {formatKstChatTime(message.created_at)}
                        {message.bookmark_folder_id
                          ? ` · ${
                              bookmarkFolders.find(
                                (f) => f.id === message.bookmark_folder_id,
                              )?.name ?? "폴더"
                            }`
                          : ""}
                      </small>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="py-10 text-center text-[13px] text-fog">
                  저장한 메시지가 없어요. 메시지 메뉴에서 ☆를 눌러 보세요.
                </p>
              )}
            </div>
          ) : null}

          {view === "vault" && activeConversation ? (
            <ChatRoomVault
              conversationId={activeConversation.id}
              onOpenMessage={(messageId) => {
                setView("thread");
                const el = document.getElementById(`dm-msg-${messageId}`);
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            />
          ) : null}

          {view === "gallery" && activeConversation ? (
            <ChatMediaGallery conversationId={activeConversation.id} />
          ) : null}

          {view === "calendar" ? (
            <ChatStudyCalendar conversationId={activeConversation?.id ?? null} />
          ) : null}

          {view === "global-search" ? (
            <ChatGlobalSearch
              initialQuery={globalSearchQuery}
              onOpenConversation={async (id) => {
                await refreshConversations();
                const c = conversations.find((x) => x.id === id);
                if (c) void openThread(c);
                else {
                  setActiveConversation({
                    id,
                    title: "대화",
                    isGroup: false,
                    avatar_url: null,
                    members: [],
                    otherUser: null,
                    lastMessage: null,
                    unreadCount: 0,
                    updatedAt: "",
                  });
                  setView("thread");
                  void loadMessages(id);
                  void loadPinnedList(id);
                }
              }}
            />
          ) : null}

          {view === "settings" ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <ChatPrefsBar
                doneToday={doneToday}
                goalCount={goalCount}
                keywords={prefs?.keyword_alerts ?? []}
                onOpenKeywords={() =>
                  setSheet({
                    type: "keywords",
                    value: (prefs?.keyword_alerts ?? []).join(", "),
                  })
                }
                onBumpDone={() => void bumpDailyDone()}
              />
              <div className="rounded-2xl border border-mist bg-white/80 p-4">
                <label className="text-[12px] font-semibold text-smoke">오늘 목표 문항</label>
                <input
                  type="number"
                  min={0}
                  max={500}
                  value={prefs?.daily_goal_count ?? 40}
                  onChange={(e) =>
                    void savePrefs({ daily_goal_count: Number(e.target.value) || 0 })
                  }
                  className="mt-2 w-full rounded-xl border border-mist px-3 py-2 text-[13px]"
                />
              </div>
              <button
                type="button"
                onClick={() => void requestDesktopNotifications()}
                className="w-full rounded-2xl border border-white bg-white/70 py-3 text-sm font-semibold shadow-sm"
              >
                🔔 새 메시지 알림 켜기
              </button>
            </div>
          ) : null}

                    {view === "thread" ? (
            <>
              {pinnedList.length > 0 ||
              activeConversation?.pinned_message_id ||
              activeConversation?.study_dday ||
              activeConversation?.study_goal ? (
                <div className="border-b border-[#007AFF]/20 bg-[#007AFF]/8 px-4 py-2">
                  {pinnedList.length > 0 || activeConversation?.pinned_message_id ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => setPinnedListOpen((v) => !v)}
                        className="flex w-full items-center gap-2 text-left"
                      >
                        <span className="text-sm">📌</span>
                        <p className="min-w-0 flex-1 truncate text-[12px] font-semibold text-ink">
                          고정 {Math.max(pinnedList.length, activeConversation?.pinned_message_id ? 1 : 0)}
                          {!pinnedListOpen
                            ? ` · ${(
                                pinnedList[0]?.content ||
                                pinnedBanner?.content ||
                                messages.find(
                                  (m) =>
                                    m.id === activeConversation?.pinned_message_id,
                                )?.content ||
                                "고정된 공지"
                              ).slice(0, 40)}`
                            : ""}
                        </p>
                        <span className="text-[11px] text-fog">
                          {pinnedListOpen ? "접기" : "목록"}
                        </span>
                      </button>
                      {pinnedListOpen ? (
                        <ul className="mt-1.5 space-y-1">
                          {(pinnedList.length
                            ? pinnedList
                            : activeConversation?.pinned_message_id
                              ? [
                                  {
                                    message_id: activeConversation.pinned_message_id,
                                    content:
                                      pinnedBanner?.content ||
                                      messages.find(
                                        (m) =>
                                          m.id ===
                                          activeConversation.pinned_message_id,
                                      )?.content ||
                                      "고정된 공지",
                                    message_kind: "text",
                                    pinned_at: "",
                                  },
                                ]
                              : []
                          ).map((pin) => (
                            <li
                              key={pin.message_id}
                              className="flex items-center gap-2 rounded-xl bg-white/70 px-2 py-1.5"
                            >
                              <button
                                type="button"
                                className="min-w-0 flex-1 truncate text-left text-[11px] text-ink"
                                onClick={() => {
                                  const el = document.getElementById(
                                    `dm-msg-${pin.message_id}`,
                                  );
                                  el?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                  setPinnedListOpen(false);
                                }}
                              >
                                {pin.content || pin.message_kind || "고정 메시지"}
                              </button>
                              <button
                                type="button"
                                className="shrink-0 text-[11px] text-fog"
                                onClick={() => {
                                  const msg =
                                    messages.find((m) => m.id === pin.message_id) ??
                                    ({
                                      id: pin.message_id,
                                      content: pin.content,
                                    } as DmMessage);
                                  void pinMessage(msg);
                                }}
                              >
                                해제
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                  {(activeConversation?.study_dday || activeConversation?.study_goal) ? (
                    <div className={`flex flex-wrap items-center gap-2 ${pinnedList.length || activeConversation?.pinned_message_id ? "mt-1.5" : ""}`}>
                      {activeConversation?.study_dday ? (
                        <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-[#0066D6]">
                          시험 D-day · {activeConversation.study_dday}
                        </span>
                      ) : null}
                      {activeConversation?.study_goal ? (
                        <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-smoke">
                          목표 · {activeConversation.study_goal}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
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
                      nowMs={nowMs}
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
                      readMembers={
                        message.sender_id === user.id && activeConversation?.isGroup
                          ? activeConversation.members
                              .filter(
                                (member) =>
                                  member.id !== user.id &&
                                  Boolean(
                                    member.last_read_at &&
                                      member.last_read_at >= message.created_at,
                                  ),
                              )
                              .map((m) => ({
                                nickname: m.nickname,
                                avatar_url: m.avatar_url,
                              }))
                          : undefined
                      }
                      onReply={() => {
                        setReplyTo(message);
                        setThreadRoot(
                          message.thread_root_id
                            ? messages.find((m) => m.id === message.thread_root_id) ?? message
                            : message,
                        );
                      }}
                      onEdit={() => void editMessage(message)}
                      onDelete={() => void deleteMessage(message)}
                      onReact={(emoji) => void reactToMessage(message, emoji)}
                      onBookmark={() => void toggleBookmark(message)}
                      onReport={() => void reportMessage(message)}
                      onPollVote={(key) => void votePoll(message, key)}
                      onPin={() => void pinMessage(message)}
                      onOpenThread={() => {
                        setThreadRoot(message);
                        setView("thread-detail");
                      }}
                      onRecordView={() => void recordMessageView(message)}
                      onForward={() => setSheet({ type: "forward", message })}
                      onQuote={
                        message.message_kind === "exam_card"
                          ? () =>
                              setSheet({
                                type: "quote",
                                message,
                                comment: "",
                              })
                          : undefined
                      }
                      onJoinLive={
                        message.message_kind === "live_session"
                          ? () =>
                              notify(
                                "라이브에 참가했어요. 타이머가 끝날 때까지 같이 공부해요.",
                                "success",
                              )
                          : undefined
                      }
                      onHashtag={(tag) => {
                        setGlobalSearchQuery(tag);
                        setView("global-search");
                      }}
                      onOpenMockMini={(payload) =>
                        setSheet({
                          type: "mock-mini",
                          subject: String(payload.subject),
                          year: String(payload.year),
                          href: payload.href,
                        })
                      }
                    />
                  ))
                ) : (
                  <ChatEmptyState
                    title="첫 메시지를 보내보세요"
                    body="기출 카드·타이머·OX 폴도 + 버튼에서 바로 보낼 수 있어요."
                    actionLabel="보내기 열기"
                    onAction={() => setPlusOpen(true)}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
              <form
                className="chat-glass-composer p-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage();
                }}
              >
                {shareMode !== "none" ? (
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-[#007AFF] px-2.5 py-1 text-[10px] font-semibold text-white">
                      {shareMode === "exam"
                        ? "기출"
                        : shareMode === "wrong"
                          ? "오답"
                          : shareMode === "timer"
                            ? "타이머"
                            : shareMode === "poll"
                              ? "OX폴"
                              : shareMode === "note"
                                ? "노트"
                                : shareMode === "live"
                                  ? "라이브"
                                  : "모의"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShareMode("none")}
                      className="chat-meta"
                    >
                      일반으로
                    </button>
                  </div>
                ) : null}
                {shareMode === "exam" || shareMode === "wrong" || shareMode === "mock" ? (
                  <>
                    <ChatSharePicker
                      mode={shareMode}
                      onPick={(picked: PickedShare) => {
                        setShareExamId(picked.examId);
                        setShareStem(picked.stem);
                        setShareMeta(
                          [picked.subjectLabel || picked.subject, picked.year, picked.questionNo]
                            .filter((v) => v !== undefined && v !== "")
                            .join("|"),
                        );
                        if (picked.mode === "mock") {
                          setShareMeta(`${picked.subject}|${picked.year}`);
                        }
                        notify(
                          picked.mode === "mock"
                            ? `${picked.subjectLabel} ${picked.year}년 모의고사 선택`
                            : `${picked.subjectLabel} ${picked.year}년 ${picked.questionNo}번 선택`,
                          "success",
                        );
                      }}
                    />
                    {shareStem ? (
                      <div className="mb-2 rounded-xl border border-[#007AFF]/20 bg-[#007AFF]/5 px-3 py-2">
                        <p className="text-[11px] font-semibold text-[#0066D6]">
                          선택됨 · {shareMeta || shareExamId}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[12px] text-ink">{shareStem}</p>
                      </div>
                    ) : null}
                  </>
                ) : null}
                {shareMode === "timer" ? (
                  <div className="mb-2 flex items-center gap-2 rounded-xl border border-mist bg-white/80 p-2">
                    <label className="text-[11px] text-smoke">분</label>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={timerMinutes}
                      onChange={(e) => setTimerMinutes(Number(e.target.value) || 25)}
                      className="w-20 rounded-lg border border-mist px-2 py-1.5 text-[12px]"
                    />
                  </div>
                ) : null}
                {shareMode === "note" ? (
                  <div className="mb-2 space-y-1.5">
                    <input
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="노트 제목"
                      className="w-full rounded-xl border border-mist px-3 py-2 text-[13px]"
                    />
                    <textarea
                      value={shareStem}
                      onChange={(e) => setShareStem(e.target.value)}
                      placeholder="긴 해설·정리 본문"
                      rows={4}
                      className="w-full rounded-xl border border-mist px-3 py-2 text-[13px]"
                    />
                  </div>
                ) : null}
                {shareMode === "live" ? (
                  <div className="mb-2 space-y-1.5 rounded-xl border border-mist bg-white/80 p-2">
                    <input
                      value={liveTitle}
                      onChange={(e) => setLiveTitle(e.target.value)}
                      placeholder="라이브 제목 (예: 민법 1시간 집중)"
                      className="w-full rounded-lg border border-mist px-2 py-1.5 text-[12px]"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] text-smoke">분</label>
                      <input
                        type="number"
                        min={5}
                        max={180}
                        value={timerMinutes}
                        onChange={(e) =>
                          setTimerMinutes(Number(e.target.value) || 25)
                        }
                        className="w-20 rounded-lg border border-mist px-2 py-1.5 text-[12px]"
                      />
                    </div>
                  </div>
                ) : null}
                {shareMode === "poll" ? (
                  <div className="mb-2 space-y-1.5">
                    <input
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      placeholder="OX 폴 질문"
                      className="w-full rounded-xl border border-mist px-3 py-2 text-[12px]"
                    />
                    <div className="flex items-center gap-2 text-[11px] text-fog">
                      <span className="font-semibold text-smoke">정답</span>
                      {(["O", "X"] as const).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPollCorrectKey(key)}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            pollCorrectKey === key
                              ? "bg-[#007AFF] text-white"
                              : "bg-white text-fog ring-1 ring-mist"
                          }`}
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                    <label className="flex items-center gap-2 text-[11px] text-fog">
                      마감
                      <input
                        type="number"
                        min={1}
                        max={168}
                        value={pollDueHours}
                        onChange={(e) => setPollDueHours(Number(e.target.value) || 24)}
                        className="w-16 rounded-lg border border-mist px-2 py-1 text-[12px]"
                      />
                      시간 후
                    </label>
                  </div>
                ) : null}
                {shareMode === "mock" && shareMeta.includes("|") ? (
                  <button
                    type="button"
                    className="mb-2 w-full rounded-xl border border-[#007AFF]/25 bg-[#007AFF]/5 px-3 py-2 text-left text-[12px] font-semibold text-[#0066D6]"
                    onClick={() => {
                      const [subject, year] = shareMeta.split("|").map((s) => s.trim());
                      const href =
                        subject && year
                          ? `/exam/${subject}/${year}/mock`
                          : shareExamId || "/exam";
                      setSheet({
                        type: "mock-mini",
                        subject: subject || "civillaw",
                        year: year || String(new Date().getFullYear()),
                        href,
                      });
                    }}
                  >
                    채팅에서 미니로 열기
                  </button>
                ) : null}
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
                {parseGichulInlineQuery(draft) !== null ? (
                  <div className="mb-2 max-h-40 overflow-y-auto rounded-xl border border-[#007AFF]/25 bg-white/95 shadow-sm">
                    <p className="border-b border-mist/70 px-3 py-1.5 text-[10px] font-semibold text-[#0066D6]">
                      @기출 · 과목·연도 예: @기출 민법 2024
                    </p>
                    {gichulLoading ? (
                      <p className="px-3 py-2 text-[11px] text-fog">검색 중…</p>
                    ) : gichulHits.length ? (
                      gichulHits.map((hit) => {
                        const subjectLabel =
                          EXAM_SUBJECTS.find((s) => s.value === hit.subject)?.label ??
                          hit.subject;
                        return (
                          <button
                            key={hit.examId}
                            type="button"
                            className="block w-full border-b border-mist/50 px-3 py-2 text-left last:border-0 hover:bg-[#007AFF]/5"
                            onClick={() => {
                              setShareMode("exam");
                              setShareExamId(hit.examId);
                              setShareStem(hit.stem);
                              setShareMeta(
                                `${subjectLabel}|${hit.year}|${hit.questionNo}`,
                              );
                              setDraft((prev) =>
                                prev.replace(/^@기출(?:\s+.*)?$/u, "").trimStart(),
                              );
                              setGichulHits([]);
                              notify(
                                `${subjectLabel} ${hit.year}년 ${hit.questionNo}번 선택`,
                                "success",
                              );
                            }}
                          >
                            <b className="text-[11px] text-ink">
                              {subjectLabel} {hit.year} · {hit.questionNo}번
                            </b>
                            <p className="mt-0.5 line-clamp-2 text-[11px] text-smoke">
                              {hit.stem}
                            </p>
                          </button>
                        );
                      })
                    ) : (
                      <p className="px-3 py-2 text-[11px] text-fog">
                        과목과 연도를 입력하면 문항이 나와요.
                      </p>
                    )}
                  </div>
                ) : null}
                {channelPostBlocked ? (
                  <div className="mb-2 rounded-xl border border-[#007AFF]/20 bg-[#007AFF]/5 px-3 py-2 text-[12px] font-semibold text-[#0066D6]">
                    채널은 운영자만 글을 올릴 수 있어요
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
                            {file.type.startsWith("video/")
                              ? "🎬"
                              : file.type.startsWith("audio/")
                                ? "🎙"
                                : "📄"}
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
                    onClick={() => setPlusOpen(true)}
                    disabled={sending || preparingFiles || channelPostBlocked}
                    className="chat-hit chat-focus flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-xl text-white shadow-md"
                    aria-label="보내기 메뉴"
                  >
                    ＋
                  </button>
                  <button
                    type="button"
                    onClick={() => (recording ? stopVoice() : void startVoice())}
                    disabled={sending || preparingFiles || channelPostBlocked}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg shadow-md ${
                      recording
                        ? "bg-rose-500 text-white"
                        : "bg-white text-[#0066D6] ring-1 ring-[#007AFF]/30"
                    }`}
                    aria-label={recording ? "녹음 중지" : "음성 메시지"}
                  >
                    {recording ? "⏹" : "🎙"}
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
                    placeholder={
                      channelPostBlocked
                        ? "채널은 운영자만 글을 올릴 수 있어요"
                        : "메시지를 입력하세요"
                    }
                    disabled={channelPostBlocked}
                    className="max-h-28 min-h-11 min-w-0 flex-1 resize-none rounded-[20px] border border-white bg-white/90 px-4 py-2.5 text-base shadow-inner outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:opacity-60 sm:text-[13px]"
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
                      channelPostBlocked ||
                      (!draft.trim() &&
                        !selectedFiles.length &&
                        shareMode === "none")
                    }
                    className="rounded-full bg-carbon px-4 py-2.5 text-[12px] font-semibold text-white shadow-md disabled:opacity-40"
                  >
                    {preparingFiles ? "준비 중" : sending ? "전송 중" : "전송"}
                  </button>
                </div>
                <p className="mt-1.5 text-center text-[9px] text-fog">
                  사진·동영상·문서·음성 · @닉네임 멘션
                </p>
              </form>
            </>
          ) : null}
        </div>
      ) : null}
      <ComposerPlusSheet
        open={plusOpen}
        onClose={() => setPlusOpen(false)}
        onPick={(mode) => {
          if (mode === "attach") {
            fileInputRef.current?.click();
            return;
          }
          if (mode === "mock-mini") {
            setShareMode("mock");
            const [subject, year] = shareMeta.split("|").map((s) => s.trim());
            if (subject && year) {
              setSheet({
                type: "mock-mini",
                subject,
                year,
                href: `/exam/${subject}/${year}/mock`,
              });
            }
            return;
          }
          setShareMode(mode);
        }}
      />
      {sheet?.type === "mock-mini" ? (
        <ChatSheet title="모의고사 미니" onClose={() => setSheet(null)}>
          <p className="mb-2 text-[12px] text-smoke">
            {sheet.subject} · {sheet.year}년 · 풀이가 끝나면 모의고사 페이지에서
            결과를 채팅으로 공유할 수 있어요.
          </p>
          <div className="mb-3 overflow-hidden rounded-2xl border border-mist bg-white">
            <iframe
              title="모의고사 미니"
              src={sheet.href}
              className="h-[52vh] w-full bg-white"
            />
          </div>
          <a
            href={sheet.href}
            target="_blank"
            rel="noreferrer"
            className="chat-focus flex w-full items-center justify-center rounded-full bg-[#007AFF] py-2.5 text-[13px] font-semibold text-white"
          >
            전체 화면에서 풀기
          </a>
        </ChatSheet>
      ) : null}
      {sheet?.type === "report" ? (
        <ChatSheet
            title="메시지 신고"
            onClose={() => setSheet(null)}
          >
            <label className="chat-label text-smoke">사유</label>
            <select
              value={sheet.reason}
              onChange={(e) =>
                setSheet({ ...sheet, reason: e.target.value })
              }
              className="mt-1 w-full rounded-xl border border-mist px-3 py-2.5 text-[13px]"
            >
              {[
                ["spam", "스팸"],
                ["abuse", "욕설·괴롭힘"],
                ["sexual", "음란"],
                ["illegal", "불법"],
                ["privacy", "개인정보"],
                ["other", "기타"],
              ].map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <label className="chat-label mt-3 block text-smoke">상세 (선택)</label>
            <textarea
              value={sheet.details}
              onChange={(e) =>
                setSheet({ ...sheet, details: e.target.value })
              }
              rows={3}
              className="mt-1 w-full rounded-xl border border-mist px-3 py-2.5 text-[13px]"
            />
            <button
              type="button"
              onClick={() => void submitReport()}
              className="chat-focus mt-4 w-full rounded-full bg-[#007AFF] py-2.5 text-[13px] font-semibold text-white"
            >
              신고 접수
            </button>
          </ChatSheet>
      ) : null}
      {sheet?.type === "checkin" ? (
        <ChatSheet title="학습 인증" onClose={() => setSheet(null)}>
            <label className="chat-label text-smoke">한마디 (선택)</label>
            <input
              value={sheet.note}
              onChange={(e) => setSheet({ ...sheet, note: e.target.value })}
              placeholder="오늘 목표 달성!"
              className="mt-1 w-full rounded-xl border border-mist px-3 py-2.5 text-[13px]"
            />
            <button
              type="button"
              onClick={() => void submitCheckin()}
              className="chat-focus mt-4 w-full rounded-full bg-[#007AFF] py-2.5 text-[13px] font-semibold text-white"
            >
              인증하기
            </button>
          </ChatSheet>
      ) : null}
      {sheet?.type === "edit" ? (
        <ChatSheet title="메시지 수정" onClose={() => setSheet(null)}>
            <textarea
              value={sheet.value}
              onChange={(e) => setSheet({ ...sheet, value: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-mist px-3 py-2.5 text-[13px]"
            />
            <button
              type="button"
              onClick={() => void submitEdit()}
              className="chat-focus mt-4 w-full rounded-full bg-[#007AFF] py-2.5 text-[13px] font-semibold text-white"
            >
              저장
            </button>
          </ChatSheet>
      ) : null}
      {sheet?.type === "keywords" ? (
        <ChatSheet title="키워드 알림" onClose={() => setSheet(null)}>
            <p className="chat-meta mb-2">쉼표로 구분해서 입력하세요.</p>
            <input
              value={sheet.value}
              onChange={(e) => setSheet({ ...sheet, value: e.target.value })}
              placeholder="민법, 등기, 취득세"
              className="w-full rounded-xl border border-mist px-3 py-2.5 text-[13px]"
            />
            <button
              type="button"
              onClick={() => {
                void savePrefs({
                  keyword_alerts: sheet.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .slice(0, 20),
                });
                setSheet(null);
                notify("키워드를 저장했어요.", "success");
              }}
              className="chat-focus mt-4 w-full rounded-full bg-[#007AFF] py-2.5 text-[13px] font-semibold text-white"
            >
              저장
            </button>
          </ChatSheet>
      ) : null}
      {sheet?.type === "rename" ? (
        <ChatSheet title="그룹 이름 변경" onClose={() => setSheet(null)}>
            <input
              value={sheet.value}
              onChange={(e) => setSheet({ ...sheet, value: e.target.value })}
              className="w-full rounded-xl border border-mist px-3 py-2.5 text-[13px]"
            />
            <button
              type="button"
              onClick={() => {
                if (sheet.value.trim())
                  void manageGroup("rename", undefined, sheet.value.trim());
                setSheet(null);
              }}
              className="chat-focus mt-4 w-full rounded-full bg-[#007AFF] py-2.5 text-[13px] font-semibold text-white"
            >
              변경
            </button>
          </ChatSheet>
      ) : null}
      {sheet?.type === "forward" ? (
        <ChatSheet title="메시지 전달" onClose={() => setSheet(null)}>
          <p className="chat-meta mb-2">전달할 대화를 고르세요.</p>
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {conversations
              .filter((c) => c.id !== activeConversation?.id)
              .slice(0, 40)
              .map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => void forwardMessage(sheet.message, c.id)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left hover:bg-[#007AFF]/8"
                >
                  <Avatar nickname={c.title} url={c.avatar_url} size="sm" />
                  <span className="truncate text-[13px] font-semibold">{c.title}</span>
                </button>
              ))}
          </div>
        </ChatSheet>
      ) : null}
      {sheet?.type === "quote" ? (
        <ChatSheet title="기출 인용" onClose={() => setSheet(null)}>
          <p className="mb-2 line-clamp-3 text-[12px] text-smoke">
            {(sheet.message.payload as ExamCardPayload | undefined)?.stem ||
              sheet.message.content}
          </p>
          <textarea
            value={sheet.comment}
            onChange={(e) =>
              setSheet({ ...sheet, comment: e.target.value })
            }
            placeholder="코멘트를 남겨 보세요"
            rows={3}
            className="w-full rounded-xl border border-mist px-3 py-2.5 text-[13px]"
          />
          <button
            type="button"
            onClick={() => void quoteExamMessage(sheet.message, sheet.comment)}
            className="chat-focus mt-4 w-full rounded-full bg-[#007AFF] py-2.5 text-[13px] font-semibold text-white"
          >
            인용 보내기
          </button>
        </ChatSheet>
      ) : null}
      {sheet?.type === "bookmark-folder" ? (
        <ChatSheet title="북마크 폴더" onClose={() => setSheet(null)}>
          <p className="chat-meta mb-2">저장할 폴더를 고르세요.</p>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                void saveBookmarkToFolder(sheet.message, "");
                setSheet(null);
              }}
              className="flex w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold hover:bg-[#007AFF]/8"
            >
              미분류
            </button>
            {bookmarkFolders.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => {
                  void saveBookmarkToFolder(sheet.message, folder.id);
                  setSheet(null);
                }}
                className="flex w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold hover:bg-[#007AFF]/8"
              >
                {folder.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              void loadBookmarkFolders();
              setSheet({ type: "new-folder", name: "" });
            }}
            className="mt-3 text-[12px] font-semibold text-[#0066D6]"
          >
            + 새 폴더
          </button>
        </ChatSheet>
      ) : null}
      {sheet?.type === "new-folder" ? (
        <ChatSheet title="새 북마크 폴더" onClose={() => setSheet(null)}>
          <input
            value={sheet.name}
            onChange={(e) => setSheet({ ...sheet, name: e.target.value })}
            placeholder="폴더 이름"
            maxLength={40}
            className="w-full rounded-xl border border-mist px-3 py-2.5 text-[13px]"
          />
          <button
            type="button"
            onClick={() => {
              void createBookmarkFolder(sheet.name);
              setSheet(null);
            }}
            className="chat-focus mt-4 w-full rounded-full bg-[#007AFF] py-2.5 text-[13px] font-semibold text-white"
          >
            만들기
          </button>
        </ChatSheet>
      ) : null}
      {sheet?.type === "slow" ? (
        <ChatSheet title="느린 채팅" onClose={() => setSheet(null)}>
            <p className="chat-meta mb-2">메시지 사이 최소 대기 시간(초). 0이면 해제.</p>
            <input
              type="number"
              min={0}
              max={600}
              value={sheet.value}
              onChange={(e) => setSheet({ ...sheet, value: e.target.value })}
              className="w-full rounded-xl border border-mist px-3 py-2.5 text-[13px]"
            />
            <button
              type="button"
              onClick={() => {
                void manageGroup("slow_mode", undefined, sheet.value || "0");
                setSheet(null);
              }}
              className="chat-focus mt-4 w-full rounded-full bg-[#007AFF] py-2.5 text-[13px] font-semibold text-white"
            >
              적용
            </button>
          </ChatSheet>
      ) : null}
      {profileId ? <ChatProfileModal profileId={profileId} myUserId={user.id} onClose={() => setProfileId(null)} /> : null}
    </>
  );
}
