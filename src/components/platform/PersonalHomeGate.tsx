"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PersonalStudyHome } from "@/components/platform/PersonalStudyHome";
import type { PersonalHomeData } from "@/lib/personal-home";
import { fetchMe, useSignedInHint } from "@/lib/client-session";

/** 로그인 힌트가 있을 때 personal-home 응답까지 자리·형태를 유지 */
function PersonalHomeSkeleton() {
  return (
    <section
      className="mx-auto mb-10 max-w-4xl rounded-[24px] border border-mist bg-paper p-5 shadow-[var(--shadow-subtle)] md:p-7"
      aria-busy="true"
      aria-label="학습 홈 불러오는 중"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-snow" />
          <div className="h-7 w-full max-w-sm animate-pulse rounded bg-snow md:h-8" />
        </div>
        <div className="h-11 w-28 shrink-0 animate-pulse rounded-full bg-snow" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-y-4 border-t border-mist pt-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={`space-y-2 px-3 first:pl-0 md:px-5 ${i % 2 ? "border-l border-mist" : ""} ${i > 0 ? "md:border-l md:border-mist" : "md:border-l-0"}`}
          >
            <div className="h-3 w-12 animate-pulse rounded bg-snow" />
            <div className="h-6 w-16 animate-pulse rounded bg-snow" />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 홈 첫 블록의 갈림(개인 학습 현황 ↔ 손님 환영판).
 *
 * 손님판은 서버가 정적으로 넘겨 방문자 첫 그림이 빠르다.
 * 로그인 사용자는 /api/me 를 기다리지 않고 /api/personal-home 한 번만 친다.
 */
export function PersonalHomeGate({ guest }: { guest: ReactNode }) {
  const [state, setState] = useState<
    | { status: "pending" }
    | { status: "guest" }
    | { status: "personal"; nickname: string; data: PersonalHomeData }
  >({ status: "pending" });
  const hint = useSignedInHint();

  useEffect(() => {
    let alive = true;

    // 헤더 등과 세션 공유 — 학습 홈 표시는 막지 않음
    void fetchMe();

    void fetch("/api/personal-home", { cache: "no-store" })
      .then(async (res) => {
        const body = (await res.json()) as {
          nickname: string | null;
          data: PersonalHomeData | null;
        };
        if (!alive) return;
        if (body.nickname && body.data) {
          setState({ status: "personal", nickname: body.nickname, data: body.data });
        } else {
          setState({ status: "guest" });
        }
      })
      .catch(() => {
        if (alive) setState({ status: "guest" });
      });

    return () => {
      alive = false;
    };
  }, []);

  if (state.status === "personal") {
    return <PersonalStudyHome nickname={state.nickname} data={state.data} />;
  }
  if (state.status === "pending" && hint) {
    return <PersonalHomeSkeleton />;
  }
  if (state.status === "pending") {
    return <>{guest}</>;
  }
  return <>{guest}</>;
}
