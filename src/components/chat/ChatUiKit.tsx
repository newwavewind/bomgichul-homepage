"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

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
      className="chat-focus fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-carbon bg-paper text-2xl shadow-[var(--shadow-card)] transition-transform hover:scale-105"
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
      className="chat-focus flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/[0.06] active:bg-black/[0.1]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
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
      className={`chat-focus h-8 shrink-0 rounded-lg px-2.5 font-display text-[12px] font-medium transition-colors ${
        primary
          ? "text-[#0066D6] hover:bg-[#007AFF]/10"
          : "text-smoke hover:bg-black/[0.05] hover:text-ink"
      }`}
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
          className="chat-hit chat-focus shrink-0 rounded-full text-[14px] text-fog"
          aria-label="닫기"
        >
          ✕
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
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-black/25 p-3 sm:items-center">
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
        className="relative w-full max-w-md rounded-[24px] border border-white/80 bg-white p-4 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 id={titleId} className="font-display text-[15px] font-semibold text-ink">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="chat-hit chat-focus rounded-full text-[16px] text-fog"
            aria-label="닫기"
          >
            ✕
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
        className="chat-focus flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/[0.06]"
        aria-expanded={open}
        aria-label="더보기"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="5" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="19" cy="12" r="1.7" />
        </svg>
      </button>
      {open ? (
        <div className="absolute right-0 top-11 z-50 min-w-[148px] overflow-hidden rounded-2xl border border-mist bg-white py-1 shadow-xl">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              className="chat-focus flex w-full px-3 py-2.5 text-left font-display text-[13px] text-ink hover:bg-[#007AFF]/8"
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
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 text-center">
      <h3 className="font-display text-[16px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-[240px] font-display text-[13px] leading-relaxed text-smoke">
        {body}
      </p>
      <button
        type="button"
        onClick={onAction}
        className="chat-focus mt-5 rounded-full bg-[#007AFF] px-5 py-2.5 font-display text-[13px] font-semibold text-white"
      >
        {actionLabel}
      </button>
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
    mode: "exam" | "wrong" | "timer" | "poll" | "mock" | "mock-mini" | "attach",
  ) => void;
}) {
  if (!open) return null;
  const items = [
    { key: "attach" as const, label: "사진·파일" },
    { key: "exam" as const, label: "기출 카드" },
    { key: "wrong" as const, label: "오답 공유" },
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
            className="chat-focus rounded-2xl border border-mist bg-[#007AFF]/5 px-3 py-3 text-left font-display text-[13px] font-semibold text-[#0066D6]"
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
