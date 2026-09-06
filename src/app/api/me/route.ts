import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getUserActivityScores } from "@/lib/activity";
import { getDmConversations } from "@/lib/dm";

/**
 * 레이아웃(머리·채팅)이 클라이언트에서 로그인 상태를 물어보는 자리.
 *
 * 예전에는 Header·ChatShell 이 서버 컴포넌트에서 getUser() 를 불렀는데,
 * 쿠키를 읽는 순간 **모든 페이지가 동적 렌더**로 떨어져 정적 생성·CDN 캐시가
 * 통째로 죽었다(전 페이지 no-store — 크롤 예산을 갉아먹던 그 결함).
 * 로그인 정보는 여기서 요청 시에만 묻고, 페이지 본문은 정적으로 남긴다.
 */
export const runtime = "nodejs";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json(
      { user: null, conversations: [] },
      { headers: { "cache-control": "private, no-store" } },
    );
  }

  const [activity, conversations] = await Promise.all([
    getUserActivityScores([user.id]),
    user.usernameSet ? getDmConversations(user.id) : Promise.resolve([]),
  ]);

  return NextResponse.json(
    {
      user: {
        id: user.id,
        nickname: user.nickname,
        usernameSet: user.usernameSet,
        isAdmin: user.isAdmin,
        avatar_url: user.avatar_url,
        oceanRank: activity[user.id]?.rank ?? null,
      },
      conversations,
    },
    { headers: { "cache-control": "private, no-store" } },
  );
}
