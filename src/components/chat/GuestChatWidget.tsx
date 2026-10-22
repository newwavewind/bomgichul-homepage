"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { OnlineUser } from "@/types/database";
import { TOPIC_TEASERS } from "@/lib/chat/features";
import "@/components/chat/chat-polish.css";
import { BrandChatFab, ChatGlyph } from "@/components/chat/ChatUiKit";

export function GuestChatWidget({
  forceOpen = false,
  openNonce = 0,
}: {
  forceOpen?: boolean;
  openNonce?: number;
}) {
  const [open, setOpen] = useState(forceOpen);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!forceOpen && openNonce === 0) return;
    setOpen(true);
  }, [forceOpen, openNonce]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const channel = supabase.channel("homepage-presence");
    channel.on("presence", { event: "sync" }, () => {
      const found = Object.values(channel.presenceState<OnlineUser>()).flat();
      setOnlineUsers(
        [...new Map(found.map((item) => [item.user_id, item])).values()].sort(
          (a, b) => a.nickname.localeCompare(b.nickname, "ko"),
        ),
      );
    });
    channel.subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const loginHref = "/login?next=/&chat=1";

  return (
    <>
      <BrandChatFab
        onClick={() => setOpen((value) => !value)}
        badge={
          <span className="chat-launcher-badge absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 font-display text-[10px] font-bold">
            {onlineUsers.length}
          </span>
        }
      />

      {open ? (
        <section
          aria-label="봄기출 채팅"
          className="chat-panel chat-panel--guest chat-panel-enter fixed inset-0 z-[60] flex flex-col overflow-hidden sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(82dvh,720px)] sm:w-[min(92vw,420px)] sm:rounded-[32px]"
          onTouchStart={(event) => {
            const touch = event.touches[0];
            swipeStartRef.current = touch
              ? { x: touch.clientX, y: touch.clientY }
              : null;
          }}
          onTouchEnd={(event) => {
            const start = swipeStartRef.current;
            const touch = event.changedTouches[0];
            swipeStartRef.current = null;
            if (!start || !touch) return;
            if (
              touch.clientX - start.x > 80 &&
              Math.abs(touch.clientY - start.y) < 70
            )
              setOpen(false);
          }}
        >
          <header className="chat-header chat-header--hub flex items-start gap-3 px-6 py-6">
            <div className="min-w-0 flex-1">
              <p className="chat-eyebrow">봄기출 · 함께 공부하는 공간</p>
              <h2 className="chat-title mt-2 font-display text-2xl font-semibold">
                함께 공부해요
              </h2>
              <p className="chat-subtitle mt-2">
                지금 {onlineUsers.length}명이 같이 공부 중
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="닫기"
              className="chat-icon-button chat-focus flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            >
              <ChatGlyph name="close" />
            </button>
          </header>

          <div className="chat-guest-body min-h-0 flex-1 overflow-y-auto px-5 pb-5">
            <div className="chat-guest-card rounded-[24px] p-5">
              <p className="chat-section-heading flex items-center gap-2 font-display text-sm font-semibold">
                <ChatGlyph name="friends" />
                지금 함께 공부 중인 사람
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {onlineUsers.length ? (
                  onlineUsers.map((online) => (
                    <span
                      key={online.user_id}
                      className="chat-presence-chip inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs"
                    >
                      <i className="chat-presence-dot h-1.5 w-1.5 rounded-full" aria-hidden="true" />
                      {online.nickname}
                    </span>
                  ))
                ) : (
                  <span className="chat-meta">현재 표시할 접속자가 없어요.</span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="chat-section-heading mb-3 font-display text-[12px] font-semibold">
                로그인하면 바로 들어갈 수 있는 스터디방
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TOPIC_TEASERS.map((topic) => (
                  <Link
                    key={topic.key}
                    href={loginHref}
                    className="chat-room-card chat-focus rounded-[24px] px-4 py-4 text-left"
                  >
                    <span className="chat-room-icon mb-3 inline-flex"><ChatGlyph name="study" /></span>
                    <b className="block font-display text-[13px]">
                      {topic.label}
                    </b>
                    <small className="chat-meta mt-1 block">{topic.blurb}</small>
                  </Link>
                ))}
              </div>
            </div>

            <div className="chat-guest-invite mt-4 rounded-[28px] p-6 text-center">
              <span className="chat-guest-invite-icon inline-flex" aria-hidden="true"><ChatGlyph name="spark" /></span>
              <h3 className="mt-3 font-display text-base font-semibold">
                로그인하고 바로 대화하기
              </h3>
              <p className="mt-2 chat-meta leading-relaxed">
                과목 스터디방 · 기출/오답 공유 · 타이머 · OX 폴 · @멘션
                <br />
                개인 대화와 기록은 로그인 후에만 볼 수 있어요.
              </p>
              <Link
                href={loginHref}
                className="chat-primary chat-focus mt-5 inline-flex items-center justify-center rounded-full px-5 py-3 font-display text-sm font-semibold"
              >
                로그인하고 채팅하기
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
