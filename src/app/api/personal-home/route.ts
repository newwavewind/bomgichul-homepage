import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getPersonalHomeData } from "@/lib/personal-home";

/**
 * 홈의 「이어서 공부」 블록용 개인 데이터 — 홈 페이지가 쿠키를 읽지 않게
 * 클라이언트에서 요청 시에만 묻는다(홈을 정적으로 남기기 위한 분리).
 */
export const runtime = "nodejs";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json(
      { nickname: null, data: null },
      { headers: { "cache-control": "private, no-store" } },
    );
  }
  const data = await getPersonalHomeData(user.id);
  return NextResponse.json(
    { nickname: user.nickname, data },
    { headers: { "cache-control": "private, no-store" } },
  );
}
