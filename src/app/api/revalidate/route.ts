import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";

/**
 * 글·메모·좋아요가 써진 콘텐츠 페이지의 정적 캐시를 그 자리에서 비운다.
 *
 * 콘텐츠 페이지는 revalidate 3600 의 정적(ISR) 렌더라, 이 표시가 없으면
 * 다른 방문자는 남이 쓴 새 글을 최대 1시간 늦게 본다. 쓰기는 클라이언트에서
 * supabase 로 바로 나가므로 서버가 쓰기를 목격하지 못한다 — 그래서 변이에
 * 성공한 클라이언트가 여기로 알려 준다.
 *
 * 문지기: 쓰기는 로그인 전용이므로 로그인만 요구하고, 경로는 콘텐츠 나무
 * (concepts·exam)만 허용한다 — 최악의 남용이 「콘텐츠 페이지 캐시 한 장을
 * 미리 비우는 것」이라 잃을 것이 없다. 라우트 핸들러의 revalidatePath 는
 * 즉시 재렌더가 아니라 「다음 방문 때 새로 만들라」는 표시다(이 판 Next 문서).
 */
export const runtime = "nodejs";

const CONTENT_PATH =
  /^\/(?:(?:public-service|police|housing|social-worker|history|english)\/)?(?:concepts|exam)(?:\/[^/?#]{1,120}){2,4}$/;

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  let path = "";
  try {
    path = String((await request.json())?.path ?? "");
  } catch {
    /* 본문이 JSON 이 아니면 아래 검증에서 걸린다 */
  }
  try {
    path = decodeURIComponent(path);
  } catch {
    /* 이미 풀린 경로면 그대로 검증한다 */
  }
  if (path.length > 512 || path.includes("..") || !CONTENT_PATH.test(path)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  revalidatePath(path);
  return NextResponse.json({ ok: true });
}
