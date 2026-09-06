"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PersonalStudyHome } from "@/components/platform/PersonalStudyHome";
import type { PersonalHomeData } from "@/lib/personal-home";
import { fetchMe, hasSignedInHint } from "@/lib/client-session";

/**
 * 홈 첫 블록의 갈림(개인 학습 현황 ↔ 손님 환영판)을 클라이언트로 옮긴 문.
 *
 * 홈이 서버에서 getUser() 를 부르면 첫 페이지 전체가 동적 렌더로 떨어진다 —
 * 정작 「봄기출」 검색으로 들어올 방문자에게 가장 빨라야 할 페이지가 가장
 * 느렸다. 손님판(guest)은 서버가 정적으로 만들어 프롭으로 넘겨주므로
 * 방문자(대다수)는 첫 그림부터 완성본을 본다. 로그인 흔적이 있는 사람에게만
 * 응답이 올 때까지 자리를 비워, 손님 환영판이 깜빡였다 바뀌는 것을 막는다.
 */
export function PersonalHomeGate({ guest }: { guest: ReactNode }) {
  const [state, setState] = useState<
    | { status: "pending" }
    | { status: "guest" }
    | { status: "personal"; nickname: string; data: PersonalHomeData }
  >({ status: "pending" });
  const [hint, setHint] = useState(false);

  useEffect(() => {
    setHint(hasSignedInHint());
    let alive = true;
    void fetchMe().then(async (me) => {
      if (!me.user) {
        if (alive) setState({ status: "guest" });
        return;
      }
      try {
        const res = await fetch("/api/personal-home", { cache: "no-store" });
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
      } catch {
        if (alive) setState({ status: "guest" });
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  if (state.status === "personal") {
    return <PersonalStudyHome nickname={state.nickname} data={state.data} />;
  }
  if (state.status === "pending" && hint) {
    // 로그인해 둔 사람의 첫 그림 — 손님 환영판 대신 자리만 지킨다.
    return <div aria-hidden className="mx-auto mb-10 min-h-56 max-w-5xl" />;
  }
  if (state.status === "pending") {
    // 흔적 없는 방문자는 곧장 손님판 — 대다수 방문자는 깜빡임이 없다.
    return <>{guest}</>;
  }
  return <>{guest}</>;
}
