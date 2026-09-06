"use client";

import { useEffect as reactUseEffect, useState as reactUseState } from "react";

/**
 * 클라이언트에서 로그인 상태를 한 번만 묻는다.
 *
 * 머리(Header)와 채팅(ChatShell)이 각자 /api/me 를 부르면 문서마다 두 번
 * 왕복하므로, 모듈 수준 프로미스로 겹치기를 접는다. 로그인·로그아웃 뒤에는
 * invalidateMe() 로 판을 비워 다시 묻게 한다.
 *
 * localStorage 의 로그인 흔적(HINT_KEY)은 「로그인해 둔 사람에게 로그인 버튼이
 * 깜빡 보이는」 것을 막는 용도다 — 상태의 원천이 아니라 그리기 힌트일 뿐이다.
 */

import type { OceanRank } from "@/lib/ocean-ranks";

export type MeUser = {
  id: string;
  nickname: string;
  usernameSet: boolean;
  isAdmin: boolean;
  avatar_url: string | null;
  oceanRank: OceanRank | null;
};

export type MePayload = {
  user: MeUser | null;
  conversations: unknown[];
};

const HINT_KEY = "bomgichul:signed-in";

let mePromise: Promise<MePayload> | null = null;

export function fetchMe(): Promise<MePayload> {
  mePromise ??= fetch("/api/me", { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as MePayload;
      try {
        if (data.user) window.localStorage.setItem(HINT_KEY, "1");
        else window.localStorage.removeItem(HINT_KEY);
      } catch {
        /* 저장소가 막힌 브라우저 — 힌트만 포기한다 */
      }
      return data;
    })
    .catch(() => {
      // 조회 실패는 「비로그인」으로 그리되, 다음 시도가 다시 묻게 판을 비운다.
      mePromise = null;
      return { user: null, conversations: [] } as MePayload;
    });
  return mePromise;
}

export function invalidateMe() {
  mePromise = null;
}

/** 마지막 방문에서 로그인돼 있었는가 — 깜빡임 방지용 그리기 힌트 */
export function hasSignedInHint(): boolean {
  try {
    return window.localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * 컴포넌트에서 로그인 사용자를 얻는 훅 — fetchMe 를 나눠 쓰므로 문서당 왕복 1회.
 * pending 동안은 null 이 아니라 「미정」임을 갈라 주어, 로그인 전용 UI 가
 * 깜빡 사라졌다 나타나는 것을 부르는 쪽에서 다룰 수 있게 한다.
 */
export function useMe(): { pending: boolean; user: MeUser | null } {
  const [state, setState] = reactUseState<{ pending: boolean; user: MeUser | null }>({
    pending: true,
    user: null,
  });
  reactUseEffect(() => {
    let alive = true;
    void fetchMe().then((me) => {
      if (alive) setState({ pending: false, user: me.user });
    });
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

/**
 * 방금 글·메모를 쓴 콘텐츠 페이지의 정적 캐시를 비워 달라고 알린다.
 * 실패해도 조용히 넘어간다 — 최악은 「남에게 최대 1시간 늦게 보이는」
 * 원래의 ISR 동작으로 되돌아가는 것뿐이다. 같은 경로 연타는 2초에 한 번만.
 */
const revalidateAskedAt = new Map<string, number>();

export function requestRevalidate(path?: string) {
  if (typeof window === "undefined") return;
  const p = path ?? window.location.pathname;
  const now = Date.now();
  if (now - (revalidateAskedAt.get(p) ?? 0) < 2000) return;
  revalidateAskedAt.set(p, now);
  void fetch("/api/revalidate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path: p }),
    keepalive: true,
  }).catch(() => {});
}
