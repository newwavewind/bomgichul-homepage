"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { GuestChatWidget } from "@/components/chat/GuestChatWidget";
import { fetchMe, type MeUser } from "@/lib/client-session";

type Conversations = ComponentProps<typeof ChatWidget>["initialConversations"];

/** /api/me 전 — 손님·회원 FAB 과 같은 자리·모양만 먼저 그린다 */
function ChatFabPlaceholder() {
  return (
    <div
      className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-carbon bg-paper text-2xl shadow-[var(--shadow-card)]"
      aria-hidden
      aria-busy="true"
    >
      💬
    </div>
  );
}

/**
 * 채팅 껍데기를 클라이언트에서 그린다 — Header 와 같은 까닭(쿠키를 읽는
 * 서버 컴포넌트가 레이아웃에 있으면 전 페이지가 동적 렌더로 떨어진다).
 * /api/me 는 Header 와 같은 프로미스를 나눠 쓰므로 왕복은 문서당 한 번이다.
 * 응답 전에는 FAB 자리만 먼저 두어 구석이 텅 비었다가 뜨는 느낌을 줄인다.
 */
export function ChatShell() {
  const [state, setState] = useState<
    | { status: "pending" }
    | { status: "guest" }
    | { status: "user"; user: MeUser; conversations: Conversations }
  >({ status: "pending" });

  useEffect(() => {
    let alive = true;
    void fetchMe().then((me) => {
      if (!alive) return;
      if (me.user?.usernameSet) {
        setState({
          status: "user",
          user: me.user,
          conversations: me.conversations as Conversations,
        });
      } else {
        setState({ status: "guest" });
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  if (state.status === "pending") return <ChatFabPlaceholder />;
  if (state.status === "guest") return <GuestChatWidget />;
  return (
    <ChatWidget
      user={{
        id: state.user.id,
        nickname: state.user.nickname,
        avatar_url: state.user.avatar_url,
        isAdmin: state.user.isAdmin,
      }}
      initialConversations={state.conversations}
    />
  );
}
