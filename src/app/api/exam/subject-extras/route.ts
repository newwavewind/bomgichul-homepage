import { NextRequest, NextResponse } from "next/server";
import { EXAM_SUBJECTS } from "@/lib/constants";
import { getBookmarksForUser } from "@/lib/bookmarks";
import { getNotesForSubject } from "@/lib/notes";
import { getUser } from "@/lib/auth";
import type { ExamSubject } from "@/lib/exam-questions";

/**
 * 과목 페이지의 개인화 숫자(복습 PDF 단추·북마크 타일)를 클라이언트에서 묻는 자리.
 *
 * 예전에는 과목 페이지가 서버에서 getUser() 로 이 숫자를 셌는데, 쿠키를 읽는
 * 순간 페이지 전체가 동적 렌더로 떨어져 정적 생성·CDN 캐시가 죽었다.
 * 숫자는 여기서 요청 시에만 세고, 페이지 본문은 정적으로 남긴다.
 */
export const runtime = "nodejs";

const VALID_SUBJECTS = EXAM_SUBJECTS.map((s) => s.value);

function isValidSubject(value: string): value is ExamSubject {
  return (VALID_SUBJECTS as string[]).includes(value);
}

const PRIVATE_HEADERS = { "cache-control": "private, no-store" };

export async function GET(request: NextRequest) {
  const subject = request.nextUrl.searchParams.get("subject") ?? "";
  if (!isValidSubject(subject)) {
    return NextResponse.json({ error: "잘못된 요청이에요." }, { status: 400 });
  }

  const user = await getUser();
  if (!user) {
    // 비로그인은 0 — 과목 페이지가 지금과 같은 겉모습(숫자 없음)을 그린다.
    return NextResponse.json(
      { bookmarkCount: 0, noteCount: 0 },
      { headers: PRIVATE_HEADERS },
    );
  }

  const [bookmarks, notes] = await Promise.all([
    getBookmarksForUser(user.id),
    getNotesForSubject(user.id, subject),
  ]);

  return NextResponse.json(
    {
      bookmarkCount: bookmarks.filter((b) => b.subject === subject).length,
      noteCount: notes.length,
    },
    { headers: PRIVATE_HEADERS },
  );
}
