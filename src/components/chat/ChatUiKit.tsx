"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export function ChatGlyph({
  name,
  className,
}: {
  name: "message" | "friends" | "study" | "community" | "close" | "spark" | "back" | "more" | "search";
  className?: string;
}) {
  const paths: Record<typeof name, ReactNode> = {
    message: <><path d="M16.5 9.5a6.5 6.5 0 0 1-6.5 6.5H6.5L3 18v-5.2A6.5 6.5 0 1 1 16.5 9.5Z" /><path d="M6.5 8h7M6.5 11h4.5" /></>,
    friends: <><circle cx="7.5" cy="6.5" r="2.5" /><path d="M2.5 16v-1a5 5 0 0 1 10 0v1M13 4.3a2.5 2.5 0 0 1 0 4.4M14.5 11a4.5 4.5 0 0 1 3 4.3V16" /></>,
    study: <><path d="M10 5.5C7.8 3.8 5.4 3.4 2.5 4v11c2.9-.6 5.3-.2 7.5 1.5 2.2-1.7 4.6-2.1 7.5-1.5V4c-2.9-.6-5.3-.2-7.5 1.5ZM10 5.5v11" /><path d="m5 7 2.5.8M12.5 7.8 15 7" /></>,
    community: <><circle cx="10" cy="5.5" r="2.5" /><circle cx="5" cy="13.5" r="2.5" /><circle cx="15" cy="13.5" r="2.5" /><path d="m8.7 7.7-2.4 3.6m5-3.6 2.4 3.6M7.5 13.5h5" /></>,
    close: <path d="m5.5 5.5 9 9m0-9-9 9" />,
    spark: <><path d="m10 2 2.1 5.9L18 10l-5.9 2.1L10 18l-2.1-5.9L2 10l5.9-2.1L10 2Z" /><path d="M16 2v3m-1.5-1.5h3" /></>,
    back: <path d="m12 4.5-5.5 5.5 5.5 5.5" />,
    search: <><circle cx="9" cy="9" r="5.5" /><path d="m13.2 13.2 3.8 3.8" /></>,
    more: <><circle cx="4" cy="10" r=".75" /><circle cx="10" cy="10" r=".75" /><circle cx="16" cy="10" r=".75" /></>,
  };
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

export function BrandChatFab({
  onClick,
  badge,
  ariaLabel = "채팅 열기",
}: {
  onClick: () => void;
  badge?: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="web-chat-launcher chat-focus fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-carbon bg-paper text-2xl shadow-[var(--shadow-card)] transition-transform hover:scale-105"
    >
      💬
      {badge}
    </button>
  );
}

export function ChatBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="뒤로"
      className="chat-icon-button chat-focus flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
    >
      <ChatGlyph name="back" />
    </button>
  );
}

export function ChatHeaderAction({
  children,
  onClick,
  primary = false,
}: {
  children: ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chat-header-action chat-focus shrink-0 rounded-full px-3 py-2 font-display text-[12px] font-medium ${primary ? "is-primary" : ""}`}
    >
      {children}
    </button>
  );
}

export function ChatToast({
  message,
  tone = "info",
  onClose,
}: {
  message: string;
  tone?: "info" | "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onClose, tone === "error" ? 5200 : 3200);
    return () => window.clearTimeout(t);
  }, [message, onClose, tone]);

  const toneClass =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : tone === "success"
        ? "border-[#007AFF]/25 bg-[#007AFF]/10 text-[#0066D6]"
        : "border-mist bg-white text-ink";

  return (
    <div
      role="status"
      className={`pointer-events-auto absolute bottom-24 left-3 right-3 z-[90] mx-auto max-w-sm rounded-2xl border px-4 py-3 text-[13px] shadow-lg sm:bottom-4 ${toneClass}`}
    >
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 font-display leading-snug">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="chat-icon-button chat-hit chat-focus shrink-0 rounded-full"
          aria-label="닫기"
        >
          <ChatGlyph name="close" />
        </button>
      </div>
    </div>
  );
}

export function ChatSheet({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const titleId = useId();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="chat-sheet-backdrop fixed inset-0 z-[95] flex items-end justify-center p-3 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="닫기"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="chat-sheet relative max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-5"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 id={titleId} className="font-display text-[15px] font-semibold text-ink">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="chat-icon-button chat-hit chat-focus rounded-full"
            aria-label="닫기"
          >
            <ChatGlyph name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function OverflowMenu({
  items,
}: {
  items: Array<{ key: string; label: string; onClick: () => void }>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="chat-icon-button chat-focus flex h-11 w-11 items-center justify-center rounded-full"
        aria-expanded={open}
        aria-label="더보기"
      >
        <ChatGlyph name="more" />
      </button>
      {open ? (
        <div className="chat-menu absolute right-0 top-12 z-50 min-w-[176px] overflow-hidden rounded-3xl bg-white p-1.5">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              className="chat-focus flex min-h-11 w-full items-center rounded-2xl px-3 py-2.5 text-left font-display text-[13px]"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ChatEmptyState({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="chat-empty flex flex-1 flex-col items-center justify-center px-6 py-14 text-center">
      <span className="chat-empty-icon" aria-hidden="true"><ChatGlyph name="message" /></span>
      <h3 className="font-display text-[16px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-[240px] font-display text-[13px] leading-relaxed text-smoke">
        {body}
      </p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="chat-primary chat-focus mt-5 rounded-full px-5 py-3 font-display text-[13px] font-semibold"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function ComposerPlusSheet({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (
    mode:
      | "exam"
      | "wrong"
      | "timer"
      | "poll"
      | "mock"
      | "mock-mini"
      | "attach"
      | "note"
      | "live"
      | "voice",
  ) => void;
}) {
  if (!open) return null;
  const items = [
    { key: "attach" as const, label: "사진·파일" },
    { key: "voice" as const, label: "음성 메시지" },
    { key: "exam" as const, label: "기출 카드" },
    { key: "wrong" as const, label: "오답 공유" },
    { key: "note" as const, label: "노트 카드" },
    { key: "live" as const, label: "라이브 스터디" },
    { key: "timer" as const, label: "타이머" },
    { key: "poll" as const, label: "OX 폴" },
    { key: "mock" as const, label: "모의고사 초대" },
    { key: "mock-mini" as const, label: "모의 미니" },
  ];
  return (
    <ChatSheet title="보내기" onClose={onClose}>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className="chat-send-option chat-focus rounded-2xl px-4 py-4 text-left font-display text-[13px] font-semibold"
            onClick={() => {
              onPick(item.key);
              onClose();
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </ChatSheet>
  );
}
