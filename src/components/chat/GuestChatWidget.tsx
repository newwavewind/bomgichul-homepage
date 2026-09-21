"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { OnlineUser } from "@/types/database";
import { TOPIC_TEASERS } from "@/lib/chat/features";

export function GuestChatWidget({ forceOpen = false }: { forceOpen?: boolean }) {
  const [open, setOpen] = useState(forceOpen);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

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
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-carbon bg-paper text-2xl shadow-[var(--shadow-card)] transition-transform hover:scale-105"
        aria-label="채팅 열기"
      >
        💬
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#007AFF] px-1 font-display text-[10px] font-bold text-white">
          {onlineUsers.length}
        </span>
      </button>

      {open ? (
        <section
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top_right,#dbeafe_0,#f8fafc_38%,#fff_75%)] shadow-2xl sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(72vh,620px)] sm:w-[min(92vw,420px)] sm:rounded-[30px] sm:border sm:border-white/80"
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
          <header className="flex items-center border-b border-white/70 bg-white/70 px-4 py-3 backdrop-blur-2xl">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-body font-semibold text-ink">
                봄기출 채팅
              </h2>
              <p className="text-[11px] text-fog">
                지금 {onlineUsers.length}명이 같이 공부 중
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="닫기"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl text-fog transition-colors hover:bg-black/5 active:bg-black/10"
            >
              ✕
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="rounded-2xl border border-mist bg-white/75 p-4">
              <p className="font-display text-sm font-semibold text-ink">
                지금 함께 공부 중인 사람
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {onlineUsers.length ? (
                  onlineUsers.map((online) => (
                    <span
                      key={online.user_id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-ice px-3 py-1.5 text-xs text-ink"
                    >
                      <i className="h-2 w-2 rounded-full bg-[#007AFF]" />
                      {online.nickname}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-fog">
                    현재 표시할 접속자가 없어요.
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 font-display text-[12px] font-semibold text-smoke">
                로그인하면 바로 들어갈 수 있는 스터디방
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TOPIC_TEASERS.map((topic) => (
                  <Link
                    key={topic.key}
                    href={loginHref}
                    className="rounded-2xl border border-mist bg-white/80 px-3 py-2.5 text-left shadow-sm"
                  >
                    <b className="block font-display text-[13px] text-ink">
                      {topic.label}
                    </b>
                    <small className="text-[11px] text-fog">{topic.blurb}</small>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#e9eaf8] p-5 text-center">
              <span className="text-3xl">💬</span>
              <h3 className="mt-2 font-display text-base font-semibold text-[#30344a]">
                로그인하고 바로 대화하기
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#686d89]">
                과목 스터디방 · 기출/오답 공유 · 타이머 · OX 폴 · @멘션
                <br />
                개인 대화와 기록은 로그인 후에만 볼 수 있어요.
              </p>
              <Link
                href={loginHref}
                className="mt-4 inline-flex rounded-full bg-[#007AFF] px-5 py-2.5 font-display text-sm font-semibold text-white"
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
