"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { GuestChatWidget } from "@/components/chat/GuestChatWidget";
import { fetchMe, type MeUser } from "@/lib/client-session";

type Conversations = ComponentProps<typeof ChatWidget>["initialConversations"];

/**
 * 채팅 껍데기를 클라이언트에서 그린다 — Header 와 같은 까닭(쿠키를 읽는
 * 서버 컴포넌트가 레이아웃에 있으면 전 페이지가 동적 렌더로 떨어진다).
 * /api/me 는 Header 와 같은 프로미스를 나눠 쓰므로 왕복은 문서당 한 번이다.
 * 응답이 오기 전에는 아무것도 그리지 않는다 — 손님 위젯이 깜빡였다가
 * 바뀌는 것보다 반 박자 늦게 뜨는 쪽이 낫다.
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

  if (state.status === "pending") return null;
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
