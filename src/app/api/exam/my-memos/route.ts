import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/auth";
import { getPublicMemosForQuestion } from "@/lib/question-memos";

/**
 * 로그인 사용자에게 「내 것이 표시된」 이 문항의 공개 메모 목록을 준다.
 *
 * 문항 상세가 정적(ISR)이 되면서 서버 HTML 의 메모 목록은 방문자를 모른다 —
 * liked_by_viewer 가 전부 false 이고, ISR 스냅숏 이후 등록분도 빠져 있다.
 * 개인화 조각(내 좋아요)만 따로 주면 「방금 등록한 메모가 안 보이는」 구멍이
 * 남으므로, 목록을 통째로 개인화해 돌려주고 패널이 상태를 갈아끼운다.
 * 등록·좋아요·댓글 뒤의 새로고침도 이 길을 쓴다 — 정적 페이지에서
 * router.refresh() 는 서버 캐시를 무효화하지 못한다.
 */
export const runtime = "nodejs";

const PRIVATE_HEADERS = { "cache-control": "private, no-store" };

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const subject = params.get("subject") ?? "";
  const year = Number(params.get("year"));
  const questionNo = Number(params.get("no"));
  if (!subject || !Number.isFinite(year) || !Number.isFinite(questionNo)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400, headers: PRIVATE_HEADERS });
  }

  const user = await getUser();
  if (!user) {
    // 비로그인에게는 개인화할 것이 없다 — null 을 주어 패널이 정적 목록을 지키게 한다.
    return NextResponse.json({ memos: null }, { headers: PRIVATE_HEADERS });
  }

  const memos = await getPublicMemosForQuestion(subject, year, questionNo, user.id);
  return NextResponse.json({ memos }, { headers: PRIVATE_HEADERS });
}
