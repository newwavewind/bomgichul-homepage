import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "@/lib/auth";
import { isQuestionBookmarked } from "@/lib/bookmarks";

/**
 * 로그인 사용자의 「이 문항 북마크 여부」를 클라이언트가 물어보는 자리.
 *
 * 문항 상세 페이지가 정적(ISR)이 되면서 서버 렌더가 방문자를 모르게 됐다 —
 * 북마크 단추(BookmarkButton)가 첫 그리기 뒤에 여기로 초기 상태를 얻는다.
 * subject 는 트랙별 저장 키(예: civillaw, police:law:2022-1)를 그대로 받는다.
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
    return NextResponse.json({ bookmarked: false }, { headers: PRIVATE_HEADERS });
  }

  const bookmarked = await isQuestionBookmarked(user.id, subject, year, questionNo);
  return NextResponse.json({ bookmarked }, { headers: PRIVATE_HEADERS });
}
