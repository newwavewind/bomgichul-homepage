"use client";

import { useEffect, useState } from "react";
import { HeaderNav } from "@/components/layout/HeaderNav";
import { DailyStudyTracker } from "@/components/analytics/DailyStudyTracker";
import { fetchMe, hasSignedInHint, invalidateMe, type MeUser } from "@/lib/client-session";
import { createClient } from "@/lib/supabase/client";

/**
 * 머리를 클라이언트에서 그린다.
 *
 * 예전에는 서버 컴포넌트에서 getUser() 를 불렀는데, 레이아웃이 쿠키를 읽는
 * 순간 **사이트의 모든 페이지가 동적 렌더**가 됐다(전 페이지 no-store).
 * 이제 본문은 정적으로 나가고, 로그인 표시만 그림이 뜬 뒤 /api/me 로 채운다.
 *
 * 로그인해 둔 사람에게 「무료로 시작」 버튼이 깜빡 보이지 않도록,
 * 지난 방문의 로그인 흔적이 있으면 응답이 올 때까지 자리만 비워 둔다.
 */
export function Header() {
  const [state, setState] = useState<{ pending: boolean; user: MeUser | null }>(() => ({
    pending: true,
    user: null,
  }));
  const [hint, setHint] = useState(false);

  useEffect(() => {
    setHint(hasSignedInHint());
    let alive = true;
    const load = () =>
      void fetchMe().then((me) => {
        if (alive) setState({ pending: false, user: me.user });
      });
    load();

    // 로그인·로그아웃은 RSC 내비게이션이라 레이아웃이 남는다 — 세션 변화를
    // 직접 듣고 다시 묻지 않으면 머리가 옛 상태로 남는다.
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        invalidateMe();
        load();
      }
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      {state.user ? <DailyStudyTracker userId={state.user.id} /> : null}
      <HeaderNav user={state.user} authPending={state.pending && hint} />
    </>
  );
}
